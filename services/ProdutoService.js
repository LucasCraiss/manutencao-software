/**
 * ProdutoService.js
 * Camada de serviço responsável pela comunicação com a API de Produtos.
 *
 * Conceito aplicado: padrão Repository / Service Layer — isola a lógica de
 * acesso a dados dos componentes Vue, facilitando testes unitários e
 * manutenção futura.
 *
 * Engenharia Reversa: esta camada substitui o TutorialDataService.js
 * original do repositório bezkoder/vue-3-crud, adaptando os endpoints
 * para o domínio de Controle de Estoque.
 */
import http from './http-common'

class ProdutoService {
  // ── CRUD básico ──────────────────────────────────────────────────────────

  /** Lista todos os produtos (com filtro opcional por nome) */
  getAll (nome = '') {
    return http.get('/produtos', { params: { nome } })
  }

  /** Busca um produto pelo ID */
  getById (id) {
    return http.get(`/produtos/${id}`)
  }

  /** Cria um novo produto */
  create (data) {
    return http.post('/produtos', data)
  }

  /** Atualiza os dados de um produto */
  update (id, data) {
    return http.put(`/produtos/${id}`, data)
  }

  /** Remove um produto */
  delete (id) {
    return http.delete(`/produtos/${id}`)
  }

  // ── Operações específicas de estoque ────────────────────────────────────

  /** Busca produtos com estoque abaixo do mínimo */
  getEstoqueBaixo () {
    return http.get('/produtos/estoque-baixo')
  }

  /** Lista produtos por categoria */
  getPorCategoria (categoria) {
    return http.get('/produtos', { params: { categoria } })
  }
}

export default new ProdutoService()
