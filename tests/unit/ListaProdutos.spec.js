/**
 * ListaProdutos.spec.js
 * Testes unitários do componente ListaProdutos.vue
 *
 * Conceito aplicado: Component Testing com Vue Test Utils.
 * Testa o comportamento do componente de forma isolada,
 * verificando renderização, interações do usuário e chamadas
 * ao serviço — sem depender de servidor real.
 */
import { mount, flushPromises } from '@vue/test-utils'
import ListaProdutos from '@/components/ListaProdutos.vue'
import ProdutoService from '@/services/ProdutoService'

// Mock do serviço
jest.mock('@/services/ProdutoService')

const produtosMock = [
  { id: 1, nome: 'Teclado Mecânico', categoria: 'Informática', quantidade: 10, quantidadeMinima: 5, preco: 299.90, unidade: 'un' },
  { id: 2, nome: 'Mouse Gamer', categoria: 'Informática', quantidade: 2, quantidadeMinima: 5, preco: 149.90, unidade: 'un' }
]

describe('ListaProdutos.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ProdutoService.getAll.mockResolvedValue({ data: produtosMock })
  })

  // ── Renderização ─────────────────────────────────────────────────────────
  it('deve renderizar a tabela de produtos após o carregamento', async () => {
    const wrapper = mount(ListaProdutos, {
      global: {
        stubs: { RouterLink: true, RouterView: true }
      }
    })

    await flushPromises()

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Teclado Mecânico')
    expect(wrapper.text()).toContain('Mouse Gamer')
  })

  it('deve exibir alerta quando há produtos com estoque baixo', async () => {
    const wrapper = mount(ListaProdutos, {
      global: { stubs: { RouterLink: true } }
    })
    await flushPromises()

    // Mouse Gamer tem quantidade (2) < quantidadeMinima (5)
    expect(wrapper.text()).toContain('1 produto(s) com estoque abaixo do mínimo')
  })

  it('deve exibir mensagem quando não há produtos', async () => {
    ProdutoService.getAll.mockResolvedValue({ data: [] })

    const wrapper = mount(ListaProdutos, {
      global: { stubs: { RouterLink: true } }
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhum produto encontrado')
  })

  // ── Busca ────────────────────────────────────────────────────────────────
  it('deve chamar getAll com o termo de busca ao pressionar Enter', async () => {
    ProdutoService.getAll.mockResolvedValue({ data: [produtosMock[0]] })

    const wrapper = mount(ListaProdutos, {
      global: { stubs: { RouterLink: true } }
    })
    await flushPromises()

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Teclado')
    await input.trigger('keyup.enter')

    expect(ProdutoService.getAll).toHaveBeenCalledWith('Teclado')
  })

  // ── Exclusão ─────────────────────────────────────────────────────────────
  it('deve abrir modal de confirmação ao clicar em excluir', async () => {
    const wrapper = mount(ListaProdutos, {
      global: { stubs: { RouterLink: true } }
    })
    await flushPromises()

    // Clicar no botão de excluir do primeiro produto
    const botaoExcluir = wrapper.findAll('button.btn-danger')[0]
    await botaoExcluir.trigger('click')

    // Modal deve aparecer
    expect(wrapper.find('.modal').exists()).toBe(true)
    expect(wrapper.text()).toContain('Teclado Mecânico')
  })

  it('deve remover produto da lista após confirmar exclusão', async () => {
    ProdutoService.delete.mockResolvedValue({})

    const wrapper = mount(ListaProdutos, {
      global: { stubs: { RouterLink: true } }
    })
    await flushPromises()

    // Abrir modal e confirmar
    await wrapper.findAll('button.btn-danger')[0].trigger('click')
    await wrapper.find('.modal .btn-danger').trigger('click')
    await flushPromises()

    expect(ProdutoService.delete).toHaveBeenCalledWith(1)
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })
})
