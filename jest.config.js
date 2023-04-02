// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  testPathIgnorePatterns: ['<rootDir>/apps/test/', '<rootDir>/src/config/__tests__/', '<rootDir>/packages'],
  moduleNameMapper: {
    '^@kazamaswap/uikit': '<rootDir>/packages/uikit/src',
    '^@kazamaswap/sdk': '<rootDir>/packages/swap-sdk/src',
    '^@kazamaswap/localization': ['<rootDir>/packages/localization/src'],
    '^@kazamaswap/hooks': ['<rootDir>/packages/hooks/src'],
    '^@kazamaswap/wagmi/chains': ['<rootDir>/packages/wagmi/chains'],
    '^@kazamaswap/wagmi/connectors/miniProgram': ['<rootDir>/packages/wagmi/connectors/miniProgram'],
    '^@kazamaswap/wagmi/connectors/binanceWallet': ['<rootDir>/packages/wagmi/connectors/binanceWallet'],
    '^@kazamaswap/wagmi': ['<rootDir>/packages/wagmi/src'],
  },
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 20000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig)
