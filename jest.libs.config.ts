import { readFileSync } from 'fs'
import { parse } from 'json5'
import { resolve } from 'path'
import { pathsToModuleNameMapper } from 'ts-jest'

const tsconfig = parse(
  readFileSync(resolve(__dirname, './tsconfig.json')).toString()
)

const { paths } = tsconfig.compilerOptions

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/schematics/**/*.test.ts',
    '<rootDir>/libs/**/*.test.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
}
