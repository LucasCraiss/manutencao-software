<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <router-link to="/produtos" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <h2><i class="bi bi-info-circle me-2"></i>Detalhes do Produto</h2>
    </div>

    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="!produto" class="alert alert-danger">Produto não encontrado.</div>

    <div v-else class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ produto.nome }}</h5>
        <span
          class="badge fs-6"
          :class="produto.quantidade >= produto.quantidadeMinima ? 'bg-success' : 'bg-danger'"
        >
          {{ produto.quantidade >= produto.quantidadeMinima ? '✓ Estoque OK' : '⚠ Estoque Baixo' }}
        </span>
      </div>

      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="text-muted small">Categoria</label>
              <div><span class="badge bg-secondary fs-6">{{ produto.categoria || '—' }}</span></div>
            </div>
            <div class="mb-3">
              <label class="text-muted small">Descrição</label>
              <div>{{ produto.descricao || '—' }}</div>
            </div>
            <div class="mb-3">
              <label class="text-muted small">Fornecedor</label>
              <div>{{ produto.fornecedor || '—' }}</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="row g-2">
              <div class="col-6">
                <div class="card bg-light text-center p-2">
                  <div class="fs-3 fw-bold">{{ produto.quantidade }}</div>
                  <div class="small text-muted">Qtd. em Estoque</div>
                </div>
              </div>
              <div class="col-6">
                <div class="card bg-light text-center p-2">
                  <div class="fs-3 fw-bold">{{ produto.quantidadeMinima }}</div>
                  <div class="small text-muted">Estoque Mínimo</div>
                </div>
              </div>
              <div class="col-6">
                <div class="card bg-light text-center p-2">
                  <div class="fs-4 fw-bold">{{ formatarPreco(produto.preco) }}</div>
                  <div class="small text-muted">Preço Unitário</div>
                </div>
              </div>
              <div class="col-6">
                <div class="card bg-light text-center p-2">
                  <div class="fs-4 fw-bold">{{ produto.unidade || 'un' }}</div>
                  <div class="small text-muted">Unidade</div>
                </div>
              </div>
            </div>

            <div class="mt-3">
              <label class="text-muted small">Localização no Estoque</label>
              <div>{{ produto.localizacao || '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer d-flex gap-2">
        <router-link :to="`/produtos/${produto.id}/editar`" class="btn btn-warning">
          <i class="bi bi-pencil me-1"></i>Editar
        </router-link>
        <button class="btn btn-danger ms-auto" @click="confirmarExclusao">
          <i class="bi bi-trash me-1"></i>Excluir
        </button>
      </div>
    </div>

    <!-- Modal exclusão -->
    <div v-if="mostrarModal" class="modal d-block" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
          </div>
          <div class="modal-body">
            Excluir <strong>{{ produto.nome }}</strong>? Esta ação não pode ser desfeita.
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
            <button class="btn btn-danger" @click="excluirProduto">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProdutoService from '../services/ProdutoService'

export default {
  name: 'DetalhesProduto',
  props: {
    id: { type: [String, Number], required: true }
  },
  data () {
    return {
      produto: null,
      carregando: false,
      mostrarModal: false
    }
  },
  created () {
    this.carregarProduto()
  },
  methods: {
    async carregarProduto () {
      this.carregando = true
      try {
        const resp = await ProdutoService.getById(this.id)
        this.produto = resp.data
      } catch {
        this.produto = null
      } finally {
        this.carregando = false
      }
    },
    confirmarExclusao () {
      this.mostrarModal = true
    },
    async excluirProduto () {
      try {
        await ProdutoService.delete(this.id)
        this.$router.push('/produtos')
      } catch {
        alert('Erro ao excluir produto.')
      }
    },
    formatarPreco (valor) {
      if (!valor) return '—'
      return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }
}
</script>
