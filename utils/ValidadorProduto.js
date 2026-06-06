/**
 * ValidadorProduto.js
 * Funções puras de validação dos campos do domínio Produto.
 *
 * Conceito aplicado: funções puras facilitam testes unitários —
 * dado o mesmo input, sempre retornam o mesmo output, sem efeitos colaterais.
 */

const ValidadorProduto = {
  /**
   * Valida e-mail no formato padrão.
   * @param {string} email
   * @returns {{ valido: boolean, erro: string|null }}
   */
  validarEmail (email) {
    if (!email || typeof email !== 'string') {
      return { valido: false, erro: 'E-mail é obrigatório.' }
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email.trim())) {
      return { valido: false, erro: 'E-mail inválido.' }
    }
    return { valido: true, erro: null }
  },

  /**
   * Valida nome do produto (mínimo 3, máximo 100 caracteres).
   * @param {string} nome
   * @returns {{ valido: boolean, erro: string|null }}
   */
  validarNome (nome) {
    if (!nome || typeof nome !== 'string') {
      return { valido: false, erro: 'Nome é obrigatório.' }
    }
    const trimmed = nome.trim()
    if (trimmed.length < 3) {
      return { valido: false, erro: 'Nome deve ter pelo menos 3 caracteres.' }
    }
    if (trimmed.length > 100) {
      return { valido: false, erro: 'Nome não pode ultrapassar 100 caracteres.' }
    }
    return { valido: true, erro: null }
  },

  /**
   * Valida preço (número positivo).
   * @param {number|string} preco
   * @returns {{ valido: boolean, erro: string|null }}
   */
  validarPreco (preco) {
    const valor = Number(preco)
    if (preco === null || preco === undefined || preco === '') {
      return { valido: false, erro: 'Preço é obrigatório.' }
    }
    if (isNaN(valor)) {
      return { valido: false, erro: 'Preço deve ser um número.' }
    }
    if (valor < 0) {
      return { valido: false, erro: 'Preço não pode ser negativo.' }
    }
    return { valido: true, erro: null }
  },

  /**
   * Valida senha (mínimo 8 caracteres, pelo menos uma letra e um número).
   * @param {string} senha
   * @returns {{ valido: boolean, erro: string|null }}
   */
  validarSenha (senha) {
    if (!senha || typeof senha !== 'string') {
      return { valido: false, erro: 'Senha é obrigatória.' }
    }
    if (senha.length < 8) {
      return { valido: false, erro: 'Senha deve ter pelo menos 8 caracteres.' }
    }
    if (!/[a-zA-Z]/.test(senha)) {
      return { valido: false, erro: 'Senha deve conter pelo menos uma letra.' }
    }
    if (!/[0-9]/.test(senha)) {
      return { valido: false, erro: 'Senha deve conter pelo menos um número.' }
    }
    return { valido: true, erro: null }
  }
}

export default ValidadorProduto
