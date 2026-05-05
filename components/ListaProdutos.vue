<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2><i class="bi bi-box-seam me-2"></i>Produtos em Estoque</h2>
      <router-link to="/produtos/novo" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>Novo Produto
      </router-link>
    </div>

    <!-- Barra de busca -->
    <div class="input-group mb-3">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input
        v-model="termoBusca"
        type="text"
        class="form-control"
        placeholder="Buscar produto por nome..."
        @keyup.enter="buscarProdutos"
      />
      <button class="btn btn-outline-secondary" @click="buscarProdutos">Buscar</button>
      <button class="btn btn-outline-danger" @click="limparBusca">Limpar</button>
    </div>

    <!-- Alertas de feedback -->
    <div v-if="mensagem" :class="`alert alert-${tipoMensagem} alert-dismissible`" role="alert">
      {{ mensagem }}
      <button type="button" class="btn-close" @click="mensagem = ''"></button>
    </div>

    <!-- Tabela de produtos -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <div v-else-if="produtos.length === 0" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      Nenhum produto encontrado. <router-link to="/produtos/novo">Cadastre o primeiro!</router-link>
    </div>

    <div v-else>
      <!-- Alerta de estoque baixo -->
      <div v-if="produtosEstoqueBaixo > 0" class="alert alert-warning mb-3">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <strong>{{ produtosEstoqueBaixo }} produto(s)</strong> com estoque abaixo do mínimo.
      </div>

      <div class="table-responsive">
        <table class="table table-hover table-striped align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Qtd. em Estoque</th>
              <th>Qtd. Mínima</th>
              <th>Preço (R$)</th>
              <th>Status</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="produto in produtos"
              :key="produto.id"
              :class="{ 'table-danger': produto.quantidade < produto.quantidadeMinima }"
            >
              <td>{{ produto.id }}</td>
              <td>
                <strong>{{ produto.nome }}</strong>
                <small v-if="produto.descricao" class="d-block text-muted">{{ produto.descricao }}</small>
              </td>
              <td>
                <span class="badge bg-secondary">{{ produto.categoria || '—' }}</span>
              </td>
              <td>{{ produto.quantidade }}</td>
              <td>{{ produto.quantidadeMinima }}</td>
              <td>{{ formatarPreco(produto.preco) }}</td>
              <td>
                <span
                  class="badge"
                  :class="produto.quantidade >= produto.quantidadeMinima ? 'bg-success' : 'bg-danger'"
                >
                  {{ produto.quantidade >= produto.quantidadeMinima ? 'OK' : 'Baixo' }}
                </span>
              </td>
              <td class="text-center">
                <router-link
                  :to="`/produtos/${produto.id}`"
                  class="btn btn-sm btn-info me-1"
                  title="Visualizar"
                >
                  <i class="bi bi-eye"></i>
                </router-link>
                <router-link
                  :to="`/produtos/${produto.id}/editar`"
                  class="btn btn-sm btn-warning me-1"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button
                  class="btn btn-sm btn-danger"
                  title="Excluir"
                  @click="confirmarExclusao(produto)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <small class="text-muted">Total: {{ produtos.length }} produto(s)</small>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="produtoParaExcluir" class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir o produto <strong>{{ produtoParaExcluir.nome }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="produtoParaExcluir = null">Cancelar</button>
            <button class="btn btn-danger" @click="excluirProduto(produtoParaExcluir.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProdutoService from '../services/ProdutoService'

export default {
  name: 'ListaProdutos',
  data () {
    return {
      produtos: [],
      termoBusca: '',
      carregando: false,
      mensagem: '',
      tipoMensagem: 'success',
      produtoParaExcluir: null
    }
  },
  computed: {
    produtosEstoqueBaixo () {
      return this.produtos.filter(p => p.quantidade < p.quantidadeMinima).length
    }
  },
  created () {
    this.carregarProdutos()
  },
  methods: {
    async carregarProdutos () {
      this.carregando = true
      try {
        const resp = await ProdutoService.getAll()
        this.produtos = resp.data
      } catch (err) {
        this.exibirMensagem('Erro ao carregar produtos.', 'danger')
      } finally {
        this.carregando = false
      }
    },
    async buscarProdutos () {
      this.carregando = true
      try {
        const resp = await ProdutoService.getAll(this.termoBusca)
        this.produtos = resp.data
      } catch (err) {
        this.exibirMensagem('Erro ao buscar produtos.', 'danger')
      } finally {
        this.carregando = false
      }
    },
    limparBusca () {
      this.termoBusca = ''
      this.carregarProdutos()
    },
    confirmarExclusao (produto) {
      this.produtoParaExcluir = produto
    },
    async excluirProduto (id) {
      try {
        await ProdutoService.delete(id)
        this.produtos = this.produtos.filter(p => p.id !== id)
        this.exibirMensagem('Produto excluído com sucesso.', 'success')
      } catch (err) {
        this.exibirMensagem('Erro ao excluir produto.', 'danger')
      } finally {
        this.produtoParaExcluir = null
      }
    },
    formatarPreco (valor) {
      if (!valor) return '—'
      return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    exibirMensagem (texto, tipo = 'success') {
      this.mensagem = texto
      this.tipoMensagem = tipo
      setTimeout(() => { this.mensagem = '' }, 4000)
    }
  }
}
</script>
