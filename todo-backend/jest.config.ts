module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    setupFilesAfterEnv: ['./jest.setup.ts'], // If you have global setup
    collectCoverage: true, // Optional: for coverage reports
};