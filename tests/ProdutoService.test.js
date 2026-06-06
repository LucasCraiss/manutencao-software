/**
 * ProdutoService.test.js
 * Testes unitários para a camada de serviço (HTTP) de Produtos.
 *
 * Conceito aplicado: Test Double / Mock — substituímos o Axios real por um
 * dublê controlado (jest.mock), isolando o teste da rede e da API externa.
 * Isso garante testes rápidos, determinísticos e sem dependências externas.
 *
 * Executar: npm test
 */

import ProdutoService from '@/services/ProdutoService'
import http from '@/services/http-common'

// Mocka todo o módulo http-common (instância Axios)
jest.mock('@/services/http-common', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

// Limpa contadores de chamadas entre testes
beforeEach(() => {
  jest.clearAllMocks()
})

// ── getAll ──────────────────────────────────────────────────────────────────

test('getAll retorna lista de produtos', async () => {
  const mockProdutos = [
    { id: 1, nome: 'Parafuso M6', preco: 0.50 },
    { id: 2, nome: 'Porca M6',    preco: 0.30 }
  ]
  http.get.mockResolvedValue({ data: mockProdutos })

  const resultado = await ProdutoService.getAll()

  expect(http.get).toHaveBeenCalledWith('/produtos', { params: { nome: '' } })
  expect(resultado.data).toHaveLength(2)
  expect(resultado.data[0].nome).toBe('Parafuso M6')
})

// ── getById ─────────────────────────────────────────────────────────────────

test('getById retorna o produto correto pelo ID', async () => {
  const mockProduto = { id: 1, nome: 'Parafuso M6', preco: 0.50 }
  http.get.mockResolvedValue({ data: mockProduto })

  const resultado = await ProdutoService.getById(1)

  expect(http.get).toHaveBeenCalledWith('/produtos/1')
  expect(resultado.data.id).toBe(1)
})

// ── create ──────────────────────────────────────────────────────────────────

test('create envia POST e retorna produto criado', async () => {
  const novoProduto = { nome: 'Arruela M6', preco: 0.10, quantidade: 500 }
  const resposta = { id: 3, ...novoProduto }
  http.post.mockResolvedValue({ data: resposta })

  const resultado = await ProdutoService.create(novoProduto)

  expect(http.post).toHaveBeenCalledWith('/produtos', novoProduto)
  expect(resultado.data.id).toBe(3)
})

// ── update ──────────────────────────────────────────────────────────────────

test('update envia PUT com dados atualizados', async () => {
  const dadosAtualizados = { nome: 'Parafuso M8', preco: 0.75 }
  http.put.mockResolvedValue({ data: { id: 1, ...dadosAtualizados } })

  const resultado = await ProdutoService.update(1, dadosAtualizados)

  expect(http.put).toHaveBeenCalledWith('/produtos/1', dadosAtualizados)
  expect(resultado.data.nome).toBe('Parafuso M8')
})

// ── delete ──────────────────────────────────────────────────────────────────

test('delete envia DELETE para o endpoint correto', async () => {
  http.delete.mockResolvedValue({ data: {} })

  await ProdutoService.delete(1)

  expect(http.delete).toHaveBeenCalledWith('/produtos/1')
  expect(http.delete).toHaveBeenCalledTimes(1)
})
