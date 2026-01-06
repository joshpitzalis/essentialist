export default async () => ({
  displayName: 'Backend (E2E)',
  preset: 'ts-jest',
  testMatch: ['**/@(src|tests)/**/*.@(e2e).*'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {}],
  },
  maxWorkers: 1,
  globalSetup: './tests/support/globalDevEnvTestSetup.ts',
});
