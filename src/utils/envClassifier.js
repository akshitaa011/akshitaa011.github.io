/**
 * EnvGuard AST Static Environment Variable Classifier
 * - Detects 'use client' directives via ast.program.directives
 * - Next.js client component scoping rules (unexposed server secrets)
 * - Sensitive keyword exposure detection (leakRisk)
 * - Single source of truth: each variable receives exactly one status
 */

export const SENSITIVE_KEYWORDS = ['SECRET', 'PASSWORD', 'PRIVATE', 'TOKEN'];

export const STATUS_MESSAGES = {
  unexposed: "server-only variable read in a client component; move to a server component or API route, do not rename secrets to NEXT_PUBLIC_",
  leakRisk: "looks like a secret but is exposed to the browser bundle",
  missing: "referenced in AST code, not declared in .env",
  empty: "assigned empty string in .env; will evaluate to undefined",
  dead: "declared in .env with value but zero AST read nodes found",
  duplicate: "defined multiple times in .env",
  valid: "active and verified in AST"
};

/**
 * Parse .env content into structured entries and counts
 */
export function parseEnvContent(envContent) {
  if (!envContent || typeof envContent !== 'string') {
    return { entries: [], keyCounts: {} };
  }

  const lines = envContent.split('\n');
  const entries = [];
  const keyCounts = {};

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1];
      const rawValue = match[2];
      keyCounts[key] = (keyCounts[key] || 0) + 1;

      entries.push({
        key,
        value: rawValue,
        line: index + 1,
        isEmpty: rawValue.trim() === '',
        isDuplicate: false
      });
    }
  });

  entries.forEach(e => {
    if (keyCounts[e.key] > 1) {
      e.isDuplicate = true;
    }
  });

  return { entries, keyCounts };
}

/**
 * Helpers for Babel AST node matching
 */
export function isProcessEnvNode(node) {
  if (!node) return false;
  if (node.type !== 'MemberExpression' && node.type !== 'OptionalMemberExpression') return false;
  const obj = node.object;
  const prop = node.property;
  return (
    obj &&
    obj.type === 'Identifier' &&
    obj.name === 'process' &&
    prop &&
    prop.type === 'Identifier' &&
    prop.name === 'env'
  );
}

export function isImportMetaEnvNode(node) {
  if (!node) return false;
  if (node.type !== 'MemberExpression' && node.type !== 'OptionalMemberExpression') return false;
  const obj = node.object;
  const prop = node.property;
  return (
    obj &&
    obj.type === 'MetaProperty' &&
    obj.meta?.name === 'import' &&
    obj.property?.name === 'meta' &&
    prop &&
    prop.type === 'Identifier' &&
    prop.name === 'env'
  );
}

export function getPropertyAccessorName(prop, computed) {
  if (!prop) return null;
  if (!computed) {
    return prop.type === 'Identifier' ? prop.name : null;
  }
  if (prop.type === 'StringLiteral') return prop.value;
  if (prop.type === 'TemplateLiteral' && prop.quasis?.length === 1) {
    return prop.quasis[0].value?.raw;
  }
  if (prop.type === 'Identifier') return prop.name;
  return null;
}

/**
 * Traverse Babel AST to collect env references, 'use client' directives, and readable node graph
 */
export function extractAstData(ast, code = '') {
  if (!ast || !ast.program) {
    return {
      references: [],
      directives: [],
      isClientComponent: false,
      nodesList: []
    };
  }

  // Detect 'use client' directive via ast.program.directives
  const directives = ast.program.directives || [];
  const isClientComponent = directives.some(d => d.value?.value === 'use client');

  const references = [];
  const nodesList = [];

  const handleObjectPattern = (pattern, prefix) => {
    if (!pattern || pattern.type !== 'ObjectPattern') return;
    for (const prop of pattern.properties) {
      if (prop.type === 'ObjectProperty') {
        let varName = null;
        if (!prop.computed && prop.key?.type === 'Identifier') {
          varName = prop.key.name;
        } else if (prop.key?.type === 'StringLiteral') {
          varName = prop.key.value;
        }

        if (varName && typeof varName === 'string') {
          references.push({
            varName,
            prefix,
            loc: prop.loc,
            range: [prop.start, prop.end]
          });
        }
      }
    }
  };

  const walk = (node, depth = 0) => {
    if (!node || typeof node !== 'object') return;

    if (node.type && typeof node.type === 'string' && code) {
      const preview = code.substring(node.start, Math.min(node.end, node.start + 35)).replace(/\n/g, ' ');
      nodesList.push({
        type: node.type,
        depth,
        range: [node.start, node.end],
        loc: node.loc,
        preview: preview || node.type,
        astNode: node
      });
    }

    // MemberExpression & OptionalMemberExpression: process.env.X, process.env?.X, import.meta.env.X
    if (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression') {
      const obj = node.object;
      const prop = node.property;

      if (isProcessEnvNode(obj)) {
        const varName = getPropertyAccessorName(prop, node.computed);
        if (varName && typeof varName === 'string') {
          references.push({
            varName,
            prefix: 'process.env',
            loc: node.loc,
            range: [node.start, node.end]
          });
        }
      } else if (isImportMetaEnvNode(obj)) {
        const varName = getPropertyAccessorName(prop, node.computed);
        if (varName && typeof varName === 'string') {
          references.push({
            varName,
            prefix: 'import.meta.env',
            loc: node.loc,
            range: [node.start, node.end]
          });
        }
      }
    }

    // Destructuring: const { A, B } = process.env;
    if (node.type === 'VariableDeclarator' && node.init) {
      if (isProcessEnvNode(node.init)) {
        handleObjectPattern(node.id, 'process.env');
      } else if (isImportMetaEnvNode(node.init)) {
        handleObjectPattern(node.id, 'import.meta.env');
      }
    }

    // Assignment destructuring: ({ A, B } = process.env);
    if (node.type === 'AssignmentExpression' && node.right) {
      if (isProcessEnvNode(node.right)) {
        handleObjectPattern(node.left, 'process.env');
      } else if (isImportMetaEnvNode(node.right)) {
        handleObjectPattern(node.left, 'import.meta.env');
      }
    }

    // Default params destructuring: ({ A, B } = process.env)
    if (node.type === 'AssignmentPattern' && node.right) {
      if (isProcessEnvNode(node.right)) {
        handleObjectPattern(node.left, 'process.env');
      } else if (isImportMetaEnvNode(node.right)) {
        handleObjectPattern(node.left, 'import.meta.env');
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'range' || key === 'comments' || key === 'tokens') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item.type === 'string') walk(item, depth + 1);
        }
      } else if (child && typeof child.type === 'string') {
        walk(child, depth + 1);
      }
    }
  };

  walk(ast.program, 0);

  return {
    references,
    directives,
    isClientComponent,
    nodesList
  };
}

/**
 * Check if a client-exposed variable name contains sensitive secret keywords
 */
export function hasSensitiveKeyword(varName) {
  if (!varName || typeof varName !== 'string') return false;
  const upper = varName.toUpperCase();
  return SENSITIVE_KEYWORDS.some(keyword => upper.includes(keyword));
}

/**
 * Single source-of-truth classification function
 * Every variable gets exactly ONE status in the returned array.
 */
export function classifyEnvironmentVariables({
  parsedEnv,
  envReferences,
  isClientComponent = false,
  mode = 'nextjs'
}) {
  const envMap = new Map();
  parsedEnv.entries.forEach(e => {
    if (!envMap.has(e.key)) envMap.set(e.key, []);
    envMap.get(e.key).push(e);
  });

  const codeRefMap = new Map();
  envReferences.forEach(ref => {
    if (!codeRefMap.has(ref.varName)) codeRefMap.set(ref.varName, []);
    codeRefMap.get(ref.varName).push(ref);
  });

  const results = [];
  const processedKeys = new Set();

  // 1. Process variables referenced in code
  codeRefMap.forEach((refs, varName) => {
    processedKeys.add(varName);
    const inEnv = envMap.get(varName) || [];
    const isDeclared = inEnv.length > 0;
    const hasEmpty = isDeclared && inEnv.some(e => e.isEmpty);
    const isDuplicate = isDeclared && inEnv.length > 1;

    let status = 'valid';
    let message = STATUS_MESSAGES.valid;

    // Rule A: Missing from .env
    if (!isDeclared) {
      status = 'missing';
      message = STATUS_MESSAGES.missing;
    }
    // Rule B: Empty value in .env
    else if (hasEmpty) {
      status = 'empty';
      message = STATUS_MESSAGES.empty;
    }
    // Rule C: Next.js Client Component Scoping
    // If 'use client' directive is present, any process.env.X without NEXT_PUBLIC_ (except NODE_ENV) is unexposed
    else if (
      mode === 'nextjs' &&
      isClientComponent &&
      !varName.startsWith('NEXT_PUBLIC_') &&
      varName !== 'NODE_ENV'
    ) {
      status = 'unexposed';
      message = STATUS_MESSAGES.unexposed;
    }
    // Rule D: Next.js / Client leak risk (NEXT_PUBLIC_ containing SECRET, PASSWORD, PRIVATE, TOKEN)
    else if (
      mode === 'nextjs' &&
      varName.startsWith('NEXT_PUBLIC_') &&
      hasSensitiveKeyword(varName)
    ) {
      status = 'leakRisk';
      message = STATUS_MESSAGES.leakRisk;
    }
    // Rule E: Vite prefix check for import.meta.env
    else if (
      mode === 'vite' &&
      refs.some(r => r.prefix === 'import.meta.env') &&
      !varName.startsWith('VITE_')
    ) {
      status = 'unexposed';
      message = "Vite rule requires 'VITE_' prefix to expose variables to client bundle";
    }
    // Rule F: Vite client leak risk (VITE_ containing SECRET, PASSWORD, PRIVATE, TOKEN)
    else if (
      mode === 'vite' &&
      varName.startsWith('VITE_') &&
      hasSensitiveKeyword(varName)
    ) {
      status = 'leakRisk';
      message = STATUS_MESSAGES.leakRisk;
    }
    // Rule G: Duplicate in .env (if no higher severity issue)
    else if (isDuplicate) {
      status = 'duplicate';
      message = `Defined multiple times in .env (lines: ${inEnv.map(e => e.line).join(', ')})`;
    }

    results.push({
      key: varName,
      status,
      message,
      refs,
      envEntries: inEnv,
      line: refs[0]?.loc?.start?.line || inEnv[0]?.line || 1,
      isViolation: status !== 'valid'
    });
  });

  // 2. Process variables in .env that were NOT referenced in AST
  envMap.forEach((entries, key) => {
    if (processedKeys.has(key)) return;

    if (entries.length > 1) {
      results.push({
        key,
        status: 'duplicate',
        message: `Defined multiple times in .env (lines: ${entries.map(e => e.line).join(', ')})`,
        refs: [],
        envEntries: entries,
        line: entries[0].line,
        isViolation: true
      });
    } else {
      results.push({
        key,
        status: 'dead',
        message: STATUS_MESSAGES.dead,
        refs: [],
        envEntries: entries,
        line: entries[0].line,
        isViolation: true
      });
    }
  });

  return results;
}

/**
 * Generate formatted CLI text from unified results array
 */
export function formatCliOutput({
  results = [],
  mode = 'nextjs',
  isClientComponent = false,
  executionTimeMs = 0
}) {
  const violations = results.filter(r => r.status !== 'valid');
  const counts = {
    valid: results.filter(r => r.status === 'valid').length,
    unexposed: results.filter(r => r.status === 'unexposed').length,
    leakRisk: results.filter(r => r.status === 'leakRisk').length,
    missing: results.filter(r => r.status === 'missing').length,
    dead: results.filter(r => r.status === 'dead').length,
    empty: results.filter(r => r.status === 'empty').length,
    duplicate: results.filter(r => r.status === 'duplicate').length
  };

  const projectName = mode === 'nextjs'
    ? (isClientComponent ? 'Next.js Client Component' : 'Next.js App')
    : 'Vite React';

  let out = `$ npx envguard scan --strict\n\n`;
  out += `🔍 Scanning AST in ${projectName} project...\n`;
  out += `📁 Analyzed 1 source file + .env configuration\n\n`;

  if (violations.length > 0) {
    out += `✖ [FAIL] ${violations.length} static environment violation(s) detected:\n\n`;
  } else {
    out += `✔ [PASS] 0 violations detected. Clean AST environment configuration.\n\n`;
  }

  // Grouped reports
  const unexposedList = results.filter(r => r.status === 'unexposed');
  if (unexposedList.length > 0) {
    out += `✖ UNEXPOSED (${mode === 'nextjs' ? 'server-only variable read in client component' : 'missing client prefix'}):\n`;
    unexposedList.forEach(item => {
      out += `  • ${item.key}\n`;
      out += `    └─ ${item.message}\n`;
    });
    out += `\n`;
  }

  const leakRiskList = results.filter(r => r.status === 'leakRisk');
  if (leakRiskList.length > 0) {
    out += `🔒 LEAK RISK (sensitive keyword exposed to client):\n`;
    leakRiskList.forEach(item => {
      out += `  • ${item.key}\n`;
      out += `    └─ ${item.message}\n`;
    });
    out += `\n`;
  }

  const missingList = results.filter(r => r.status === 'missing');
  if (missingList.length > 0) {
    out += `✖ MISSING (referenced in AST, not declared in .env):\n`;
    missingList.forEach(item => {
      out += `  • ${item.key}\n`;
      item.refs.forEach(r => {
        out += `    └─ Referenced at line ${r.loc?.start?.line}:${r.loc?.start?.column} (${r.prefix}.${item.key})\n`;
      });
    });
    out += `\n`;
  }

  const deadList = results.filter(r => r.status === 'dead');
  if (deadList.length > 0) {
    out += `✖ DEAD (declared in .env, never referenced in AST):\n`;
    deadList.forEach(item => {
      out += `  • ${item.key} (line ${item.line})\n`;
      out += `    └─ Declared with value but zero AST read nodes found\n`;
    });
    out += `\n`;
  }

  const emptyList = results.filter(r => r.status === 'empty');
  if (emptyList.length > 0) {
    out += `⚠ EMPTY (declared with blank/empty value in .env):\n`;
    emptyList.forEach(item => {
      out += `  • ${item.key} (line ${item.line})\n`;
      out += `    └─ Assigned empty string; will evaluate to undefined\n`;
    });
    out += `\n`;
  }

  const duplicateList = results.filter(r => r.status === 'duplicate');
  if (duplicateList.length > 0) {
    out += `⚠ DUPLICATE (defined multiple times in .env):\n`;
    duplicateList.forEach(item => {
      out += `  • ${item.key}\n`;
      out += `    └─ ${item.message}\n`;
    });
    out += `\n`;
  }

  const validList = results.filter(r => r.status === 'valid');
  if (validList.length > 0) {
    out += `✔ VALID (active and verified in AST):\n`;
    validList.forEach(item => {
      const lineStr = item.envEntries[0]?.line ? ` (defined line ${item.envEntries[0].line})` : '';
      out += `  • ${item.key}${lineStr}\n`;
    });
    out += `\n`;
  }

  out += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  out += `Summary: ${counts.valid} Valid | ${counts.unexposed} Unexposed | ${counts.leakRisk} Leak Risk | ${counts.missing} Missing | ${counts.dead} Dead | ${counts.empty} Empty | ${counts.duplicate} Duplicate\n`;

  const timeStr = executionTimeMs < 1000
    ? `${executionTimeMs.toFixed(2)}ms`
    : `${(executionTimeMs / 1000).toFixed(3)}s`;

  out += `Execution: ${timeStr} | @babel/parser dynamic engine`;

  return out;
}
