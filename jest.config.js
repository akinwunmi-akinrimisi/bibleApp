// Jest configuration for VerseProjection testing
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@assets/(.*)$': '<rootDir>/attached_assets/$1',
  },
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/client/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/server/**/__tests__/**/*.{ts,js}',
    '<rootDir>/server/**/*.{test,spec}.{ts,js}',
  ],
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    'server/**/*.{ts,js}',
    '!client/src/**/*.d.ts',
    '!server/**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};