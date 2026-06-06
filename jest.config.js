/**
 * jest.config.js - Configuracao do Jest para o frontend Vue 3
 *
 * Conceito: V&V (Verificacao e Validacao de Software).
 * testMatch cobre dois padroes:
 *   - src/tests/**\/*.test.js  (convencao .test.js deste projeto)
 *   - tests/unit/**\/*.spec.js (convencao padrao do @vue/cli-plugin-unit-jest)
 */
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!src/tests/**'
  ],
  coverageThreshold: {
    global: {
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testMatch: [
    '**/src/tests/**/*.test.[jt]s?(x)',
    '**/tests/unit/**/*.spec.[jt]s?(x)'
  ]
}
