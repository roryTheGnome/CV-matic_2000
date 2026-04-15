import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  verbose: true,
  clearMocks: true,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

const finalConfig = createJestConfig(config)

const defaultFunction = async () => {
  const awaitedConfig = await finalConfig()
  awaitedConfig.transformIgnorePatterns = [
    '/node_modules/(?!(next-intl|use-intl|@formatjs|@apollo/client|jose|@panva/hkdf)/)',
  ]
  return awaitedConfig
}

export default defaultFunction
