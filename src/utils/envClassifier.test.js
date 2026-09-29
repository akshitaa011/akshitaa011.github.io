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
