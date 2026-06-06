/**
 * ValidadorProduto.test.js
 * Testes unitários para as funções de validação do domínio Produto.
 *
 * Conceito aplicado: testes de caixa-branca (white-box) — conhecemos
 * a implementação interna e cobrimos cada branch da lógica de validação.
 *
 * Executar: npm test
 */

import ValidadorProduto from '@/utils/ValidadorProduto'

// ── validarEmail ────────────────────────────────────────────────────────────

describe('ValidadorProduto.validarEmail', () => {
  test('aceita e-mail válido', () => {
    const resultado = ValidadorProduto.validarEmail('usuario@empresa.com.br')
    expect(resultado.valido).toBe(true)
    expect(resultado.erro).toBeNull()
  })

  test('rejeita e-mail sem @', () => {
    const resultado = ValidadorProduto.validarEmail('emailinvalido.com')
    expect(resultado.valido).toBe(false)
    expect(resultado.erro).toBe('E-mail inválido.')
  })
})

// ── validarNome ─────────────────────────────────────────────────────────────

describe('ValidadorProduto.validarNome', () => {
  test('aceita nome com 3 ou mais caracteres', () => {
    const resultado = ValidadorProduto.validarNome('Parafuso M6')
    expect(resultado.valido).toBe(true)
    expect(resultado.erro).toBeNull()
  })

  test('rejeita nome com menos de 3 caracteres', () => {
    const resultado = ValidadorProduto.validarNome('AB')
    expect(resultado.valido).toBe(false)
    expect(resultado.erro).toBe('Nome deve ter pelo menos 3 caracteres.')
  })
})

// ── validarPreco ─────────────────────────────────────────────────────────────

describe('ValidadorProduto.validarPreco', () => {
  test('aceita preço zero (produto gratuito)', () => {
    const resultado = ValidadorProduto.validarPreco(0)
    expect(resultado.valido).toBe(true)
    expect(resultado.erro).toBeNull()
  })

  test('rejeita preço negativo', () => {
    const resultado = ValidadorProduto.validarPreco(-5.99)
    expect(resultado.valido).toBe(false)
    expect(resultado.erro).toBe('Preço não pode ser negativo.')
  })
})

// ── validarSenha ─────────────────────────────────────────────────────────────

describe('ValidadorProduto.validarSenha', () => {
  test('aceita senha forte com letras e números', () => {
    const resultado = ValidadorProduto.validarSenha('Estoque2024')
    expect(resultado.valido).toBe(true)
    expect(resultado.erro).toBeNull()
  })

  test('rejeita senha com menos de 8 caracteres', () => {
    const resultado = ValidadorProduto.validarSenha('abc1')
    expect(resultado.valido).toBe(false)
    expect(resultado.erro).toBe('Senha deve ter pelo menos 8 caracteres.')
  })
})
