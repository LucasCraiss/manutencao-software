/**
 * ProdutoService.spec.js
 * Testes unitários da camada de serviço (ProdutoService).
 *
 * Conceito aplicado: Verificação & Validação (V&V) — IEEE 1012.
 * Testes unitários verificam o comportamento de cada unidade de
 * código de forma isolada, usando mocks para simular dependências
 * externas (no caso, a API HTTP via Axios).
 *
 * Pirâmide de Testes (Cohn, 2009): estes são testes de base —
 * rápidos, baratos e determinísticos.
 */
import ProdutoService from '@/services/ProdutoService'
import http from '@/services/http-common'

// ── Mock do módulo Axios ─────────────────────────────────────────────────────
// Isolamos a unidade de teste: o ProdutoService não deve depender da API real.
jest.mock('@/services/http-common', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

describe('ProdutoService', () => {
  // Limpa os mocks antes de cada teste para evitar efeitos colaterais
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── getAll ───────────────────────────────────────────────────────────────
  describe('getAll()', () => {
    it('deve chamar GET /produtos sem parâmetros quando nome não é fornecido', async () => {
      const mockProdutos = [
        { id: 1, nome: 'Teclado', quantidade: 10 },
        { id: 2, nome: 'Mouse', quantidade: 5 }
      ]
      http.get.mockResolvedValue({ data: mockProdutos })

      const result = await ProdutoService.getAll()

      expect(http.get).toHaveBeenCalledTimes(1)
      expect(http.get).toHaveBeenCalledWith('/produtos', { params: { nome: '' } })
      expect(result.data).toHaveLength(2)
      expect(result.data[0].nome).toBe('Teclado')
    })

    it('deve passar o filtro de nome na query string', async () => {
      http.get.mockResolvedValue({ data: [{ id: 1, nome: 'Teclado' }] })

      await ProdutoService.getAll('Teclado')

      expect(http.get).toHaveBeenCalledWith('/produtos', { params: { nome: 'Teclado' } })
    })

    it('deve rejeitar a promise quando a API retorna erro', async () => {
      http.get.mockRejectedValue(new Error('Erro de rede'))

      await expect(ProdutoService.getAll()).rejects.toThrow('Erro de rede')
    })
  })

  // ── getById ──────────────────────────────────────────────────────────────
  describe('getById()', () => {
    it('deve chamar GET /produtos/:id com o ID correto', async () => {
      const mockProduto = { id: 42, nome: 'Monitor', quantidade: 3 }
      http.get.mockResolvedValue({ data: mockProduto })

      const result = await ProdutoService.getById(42)

      expect(http.get).toHaveBeenCalledWith('/produtos/42')
      expect(result.data.nome).toBe('Monitor')
    })
  })

  // ── create ───────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('deve chamar POST /produtos com os dados do produto', async () => {
      const novoProduto = { nome: 'Cadeira', quantidade: 8, quantidadeMinima: 2 }
      const respostaMock = { id: 99, ...novoProduto }
      http.post.mockResolvedValue({ data: respostaMock })

      const result = await ProdutoService.create(novoProduto)

      expect(http.post).toHaveBeenCalledWith('/produtos', novoProduto)
      expect(result.data.id).toBe(99)
    })
  })

  // ── update ───────────────────────────────────────────────────────────────
  describe('update()', () => {
    it('deve chamar PUT /produtos/:id com os dados atualizados', async () => {
      const dadosAtualizados = { nome: 'Cadeira Ergonômica', quantidade: 6 }
      http.put.mockResolvedValue({ data: { id: 99, ...dadosAtualizados } })

      await ProdutoService.update(99, dadosAtualizados)

      expect(http.put).toHaveBeenCalledWith('/produtos/99', dadosAtualizados)
    })
  })

  // ── delete ───────────────────────────────────────────────────────────────
  describe('delete()', () => {
    it('deve chamar DELETE /produtos/:id', async () => {
      http.delete.mockResolvedValue({ data: {} })

      await ProdutoService.delete(99)

      expect(http.delete).toHaveBeenCalledWith('/produtos/99')
    })
  })

  // ── getEstoqueBaixo ──────────────────────────────────────────────────────
  describe('getEstoqueBaixo()', () => {
    it('deve chamar o endpoint de estoque-baixo', async () => {
      http.get.mockResolvedValue({ data: [] })

      await ProdutoService.getEstoqueBaixo()

      expect(http.get).toHaveBeenCalledWith('/produtos/estoque-baixo')
    })
  })
})
