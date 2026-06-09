/**
 * ListaProdutos.test.js
 * Testes de componente para ListaProdutos.vue usando @vue/test-utils.
 *
 * Conceito aplicado: testes de componente (integration-light) — montamos o
 * componente num ambiente DOM simulado (jsdom) e verificamos o que o usuário
 * realmente vê e pode fazer, sem depender de navegador real.
 *
 * ProdutoService é mockado para controlar os dados retornados pela API e
 * garantir que os testes sejam rápidos e determinísticos.
 *
 * Executar: npm test
 */

import { mount, flushPromises } from '@vue/test-utils'
import ListaProdutos from '@/components/ListaProdutos.vue'
import ProdutoService from '@/services/ProdutoService'

// Mocka o serviço inteiro — os testes definem o comportamento por teste
jest.mock('@/services/ProdutoService')

// Stubs para diretivas e componentes do Vue Router
const globalStubs = {
  'router-link': { template: '<a><slot /></a>' },
  'router-view': true
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ── Teste 1: lista de produtos renderizada ───────────────────────────────────

test('renderiza a tabela quando há produtos', async () => {
  ProdutoService.getAll.mockResolvedValue({
    data: [
      { id: 1, nome: 'Parafuso M6', categoria: 'Fixação', quantidade: 100, quantidadeMinima: 10, preco: 0.50 },
      { id: 2, nome: 'Porca M6',    categoria: 'Fixação', quantidade: 50,  quantidadeMinima: 5,  preco: 0.30 }
    ]
  })

  const wrapper = mount(ListaProdutos, { global: { stubs: globalStubs } })
  await flushPromises()

  expect(wrapper.find('table').exists()).toBe(true)
  expect(wrapper.text()).toContain('Parafuso M6')
  expect(wrapper.text()).toContain('Porca M6')
})

// ── Teste 2: mensagem de lista vazia ────────────────────────────────────────

test('exibe mensagem quando não há produtos', async () => {
  ProdutoService.getAll.mockResolvedValue({ data: [] })

  const wrapper = mount(ListaProdutos, { global: { stubs: globalStubs } })
  await flushPromises()

  expect(wrapper.find('table').exists()).toBe(false)
  expect(wrapper.text()).toContain('Nenhum produto encontrado')
})

// ── Teste 3: contagem de estoque baixo ──────────────────────────────────────

test('exibe alerta quando há produtos com estoque abaixo do mínimo', async () => {
  ProdutoService.getAll.mockResolvedValue({
    data: [
      { id: 1, nome: 'Parafuso M6', categoria: 'Fixação', quantidade: 2, quantidadeMinima: 10, preco: 0.50 }
    ]
  })

  const wrapper = mount(ListaProdutos, { global: { stubs: globalStubs } })
  await flushPromises()

  expect(wrapper.text()).toContain('1 produto(s)')
  expect(wrapper.text()).toContain('estoque abaixo do mínimo')
})

// ── Teste 4: modal de confirmação de exclusão ────────────────────────────────

test('abre modal de confirmação ao clicar em Excluir', async () => {
  ProdutoService.getAll.mockResolvedValue({
    data: [
      { id: 1, nome: 'Parafuso M6', categoria: 'Fixação', quantidade: 100, quantidadeMinima: 10, preco: 0.50 }
    ]
  })

  const wrapper = mount(ListaProdutos, { global: { stubs: globalStubs } })
  await flushPromises()

  // Modal não deve estar visível antes do clique
  expect(wrapper.find('.modal').exists()).toBe(false)

  // Clica no botão de excluir
  await wrapper.find('button.btn-danger').trigger('click')

  // Modal deve aparecer com o nome do produto
  expect(wrapper.find('.modal').exists()).toBe(true)
  expect(wrapper.text()).toContain('Confirmar Exclusão')
  expect(wrapper.text()).toContain('Parafuso M6')
})
