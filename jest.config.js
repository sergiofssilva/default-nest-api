module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
