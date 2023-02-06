// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
import fs from 'fs-extra'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url))
)

/**
 * @type {import('@jest/types/build/Config').ProjectConfig}
 */
export default {
  name: pkg.name,
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', 'cypress'],
}
