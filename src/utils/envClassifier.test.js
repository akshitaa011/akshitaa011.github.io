import { describe, it, expect } from 'vitest';
import { parse } from '@babel/parser';
import {
  parseEnvContent,
  extractAstData,
  classifyEnvironmentVariables,
  formatCliOutput,
  STATUS_MESSAGES
} from './envClassifier';

function runScan(code, envContent, mode = 'nextjs') {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });

  const parsedEnv = parseEnvContent(envContent);
  const { references, isClientComponent, nodesList } = extractAstData(ast, code);
  const results = classifyEnvironmentVariables({
    parsedEnv,
    envReferences: references,
    isClientComponent,
    mode
  });

  const cliOutput = formatCliOutput({
    results,
    mode,
    isClientComponent,
    executionTimeMs: 1.25
  });

  return {
    isClientComponent,
    references,
    results,
    nodesList,
    cliOutput,
    violations: results.filter(r => r.status !== 'valid'),
    getResult: (key) => results.find(r => r.key === key)
  };
}

describe('EnvGuard Next.js AST Scoping & Secret Leak Heuristics', () => {

  it("fails: 'use client' + STRIPE_SECRET_KEY is unexposed in client component", () => {
    const code = `
'use client';
const pub = process.env.NEXT_PUBLIC_API_URL;
const secret = process.env.STRIPE_SECRET_KEY;
`;
    const env = `
NEXT_PUBLIC_API_URL=https://api.example.com
STRIPE_SECRET_KEY=sk_live_123
`;

    const scan = runScan(code, env, 'nextjs');

    expect(scan.isClientComponent).toBe(true);

    const stripeVar = scan.getResult('STRIPE_SECRET_KEY');
    expect(stripeVar).toBeDefined();
    expect(stripeVar.status).toBe('unexposed');
    expect(stripeVar.isViolation).toBe(true);
    expect(stripeVar.message).toBe(STATUS_MESSAGES.unexposed);
    expect(stripeVar.message).toContain('server-only variable read in a client component');

    const pubVar = scan.getResult('NEXT_PUBLIC_API_URL');
    expect(pubVar.status).toBe('valid');
    expect(pubVar.isViolation).toBe(false);

    expect(scan.violations.length).toBe(1);
    expect(scan.cliOutput).toContain('[FAIL] 1 static environment violation(s) detected:');
    expect(scan.cliOutput).toContain('UNEXPOSED');
    expect(scan.cliOutput).toContain(STATUS_MESSAGES.unexposed);
  });

  it('passes: same code without the directive treats server component as valid', () => {
    const code = `
const pub = process.env.NEXT_PUBLIC_API_URL;
const secret = process.env.STRIPE_SECRET_KEY;
`;
    const env = `
NEXT_PUBLIC_API_URL=https://api.example.com
STRIPE_SECRET_KEY=sk_live_123
`;

    const scan = runScan(code, env, 'nextjs');

    expect(scan.isClientComponent).toBe(false);

    const stripeVar = scan.getResult('STRIPE_SECRET_KEY');
    expect(stripeVar).toBeDefined();
    expect(stripeVar.status).toBe('valid');
    expect(stripeVar.isViolation).toBe(false);

    const pubVar = scan.getResult('NEXT_PUBLIC_API_URL');
    expect(pubVar.status).toBe('valid');
    expect(pubVar.isViolation).toBe(false);

    expect(scan.violations.length).toBe(0);
    expect(scan.cliOutput).toContain('[PASS] 0 violations detected. Clean AST environment configuration.');
    expect(scan.cliOutput).toContain('2 Valid');
  });

  it('flags leakRisk: NEXT_PUBLIC_STRIPE_SECRET_KEY exposes sensitive keyword to client', () => {
    const code = `
const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
`;
    const env = `
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_123
`;

    const scan = runScan(code, env, 'nextjs');

    const leakedVar = scan.getResult('NEXT_PUBLIC_STRIPE_SECRET_KEY');
    expect(leakedVar).toBeDefined();
    expect(leakedVar.status).toBe('leakRisk');
    expect(leakedVar.isViolation).toBe(true);
    expect(leakedVar.message).toBe(STATUS_MESSAGES.leakRisk);
    expect(leakedVar.message).toBe('looks like a secret but is exposed to the browser bundle');

    expect(scan.violations.length).toBe(1);
    expect(scan.cliOutput).toContain('[FAIL] 1 static environment violation(s) detected:');
    expect(scan.cliOutput).toContain('LEAK RISK');
    expect(scan.cliOutput).toContain('looks like a secret but is exposed to the browser bundle');
  });

  it('allows NODE_ENV in client components without violation', () => {
    const code = `
'use client';
const isDev = process.env.NODE_ENV === 'development';
`;
    const env = `
NODE_ENV=development
`;

    const scan = runScan(code, env, 'nextjs');
    const nodeEnvVar = scan.getResult('NODE_ENV');
    expect(nodeEnvVar.status).toBe('valid');
    expect(scan.violations.length).toBe(0);
  });
});

describe('EnvGuard Environment Variable Aliases & Shadowing', () => {
  it('resolves alias read in a nested function', () => {
    const code = `
const env = process.env;
function outer() {
  function inner() {
    return env.NESTED_SECRET;
  }
  return inner();
}
`;
    const env = `
NESTED_SECRET=nested_value_123
`;
    const scan = runScan(code, env, 'nextjs');
    const res = scan.getResult('NESTED_SECRET');
    expect(res).toBeDefined();
    expect(res.status).toBe('valid');
    expect(scan.violations.length).toBe(0);
    expect(scan.cliOutput).toContain('1 Valid');
  });

  it('resolves alias destructuring: const { A } = env', () => {
    const code = `
const env = process.env;
const { DEST_VAR } = env;
`;
    const env = `
DEST_VAR=destructured_val
`;
    const scan = runScan(code, env, 'nextjs');
    const res = scan.getResult('DEST_VAR');
    expect(res).toBeDefined();
    expect(res.status).toBe('valid');
    expect(scan.violations.length).toBe(0);
    expect(scan.cliOutput).toContain('1 Valid');
  });

  it('skips alias shadowed by a function parameter of the same name (must NOT count)', () => {
    const code = `
const env = process.env;
function handler(env) {
  return env.PARAM_SHADOWED_KEY;
}
`;
    const env = `
PARAM_SHADOWED_KEY=secret_val
`;
    const scan = runScan(code, env, 'nextjs');
    const res = scan.getResult('PARAM_SHADOWED_KEY');
    expect(res).toBeDefined();
    expect(res.status).toBe('dead');
    expect(res.isViolation).toBe(true);
    expect(scan.references.length).toBe(0);
    expect(scan.cliOutput).toContain('1 Dead');
    expect(scan.cliOutput).toContain('PARAM_SHADOWED_KEY');
  });

  it('resolves env reads through aliases in repro: expect 2 Valid', () => {
    const code = `
const env = process.env;
function getKey(){ return env.API_KEY }
const cfg = { url: process.env.API_URL };
`;
    const env = `
API_KEY=1
API_URL=2
`;
    const scan = runScan(code, env, 'nextjs');
    expect(scan.violations.length).toBe(0);
    expect(scan.getResult('API_KEY')?.status).toBe('valid');
    expect(scan.getResult('API_URL')?.status).toBe('valid');
    const validCount = scan.results.filter(r => r.status === 'valid').length;
    expect(validCount).toBe(2);
    expect(scan.cliOutput).toContain('2 Valid');
    expect(scan.cliOutput).toContain('[PASS] 0 violations detected. Clean AST environment configuration.');
  });

  it('resolves aliases unwrapping TypeScript as, non-null assertions, and optional chaining', () => {
    const code = `
const env = ((process.env as any)!);
function getVal() {
  return (env as any)?.OPTIONAL_TS_KEY;
}
`;
    const env = `
OPTIONAL_TS_KEY=ts_value
`;
    const scan = runScan(code, env, 'nextjs');
    expect(scan.violations.length).toBe(0);
    expect(scan.getResult('OPTIONAL_TS_KEY')?.status).toBe('valid');
    expect(scan.cliOutput).toContain('1 Valid');
  });

  it('skips alias shadowed by arrow function parameter or destructured parameter', () => {
    const code = `
const env = process.env;
const fn1 = (env) => env.PARAM_KEY_1;
const fn2 = ({ env }) => env.PARAM_KEY_2;
`;
    const env = `
PARAM_KEY_1=val1
PARAM_KEY_2=val2
`;
    const scan = runScan(code, env, 'nextjs');
    expect(scan.references.length).toBe(0);
    expect(scan.getResult('PARAM_KEY_1')?.status).toBe('dead');
    expect(scan.getResult('PARAM_KEY_2')?.status).toBe('dead');
  });
});


