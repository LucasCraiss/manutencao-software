<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <router-link to="/produtos" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <h2>
        <i class="bi bi-box me-2"></i>
        {{ modoEdicao ? 'Editar Produto' : 'Novo Produto' }}
      </h2>
    </div>

    <div v-if="mensagem" :class="`alert alert-${tipoMensagem}`">{{ mensagem }}</div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="salvarProduto" novalidate>
          <div class="row g-3">

            <!-- Nome -->
            <div class="col-md-8">
              <label class="form-label fw-bold">Nome do Produto *</label>
              <input
                v-model.trim="produto.nome"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': erros.nome }"
                placeholder="Ex: Notebook Dell Inspiron"
                maxlength="150"
              />
              <div v-if="erros.nome" class="invalid-feedback">{{ erros.nome }}</div>
            </div>

            <!-- Categoria -->
            <div class="col-md-4">
              <label class="form-label fw-bold">Categoria</label>
              <select v-model="produto.categoria" class="form-select">
                <option value="">Selecione...</option>
                <option>Eletrônicos</option>
                <option>Informática</option>
                <option>Escritório</option>
                <option>Ferramentas</option>
                <option>Higiene</option>
                <option>Alimentação</option>
                <option>Outros</option>
              </select>
            </div>

            <!-- Descrição -->
            <div class="col-12">
              <label class="form-label fw-bold">Descrição</label>
              <textarea
                v-model.trim="produto.descricao"
                class="form-control"
                rows="2"
                placeholder="Descrição detalhada do produto..."
                maxlength="500"
              ></textarea>
            </div>

            <!-- Quantidade atual -->
            <div class="col-md-3">
              <label class="form-label fw-bold">Quantidade em Estoque *</label>
              <input
                v-model.number="produto.quantidade"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': erros.quantidade }"
                min="0"
              />
              <div v-if="erros.quantidade" class="invalid-feedback">{{ erros.quantidade }}</div>
            </div>

            <!-- Quantidade mínima -->
            <div class="col-md-3">
              <label class="form-label fw-bold">Estoque Mínimo *</label>
              <input
                v-model.number="produto.quantidadeMinima"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': erros.quantidadeMinima }"
                min="0"
              />
              <div v-if="erros.quantidadeMinima" class="invalid-feedback">{{ erros.quantidadeMinima }}</div>
            </div>

            <!-- Preço -->
            <div class="col-md-3">
              <label class="form-label fw-bold">Preço (R$)</label>
              <div class="input-group">
                <span class="input-group-text">R$</span>
                <input
                  v-model.number="produto.preco"
                  type="number"
                  class="form-control"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                />
              </div>
            </div>

            <!-- Unidade -->
            <div class="col-md-3">
              <label class="form-label fw-bold">Unidade</label>
              <select v-model="produto.unidade" class="form-select">
                <option value="un">Unidade (un)</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="l">Litro (l)</option>
                <option value="cx">Caixa (cx)</option>
                <option value="pc">Pacote (pc)</option>
              </select>
            </div>

            <!-- Localização no estoque -->
            <div class="col-md-6">
              <label class="form-label fw-bold">Localização no Estoque</label>
              <input
                v-model.trim="produto.localizacao"
                type="text"
                class="form-control"
                placeholder="Ex: Prateleira A3, Depósito 2..."
              />
            </div>

            <!-- Fornecedor -->
            <div class="col-md-6">
              <label class="form-label fw-bold">Fornecedor</label>
              <input
                v-model.trim="produto.fornecedor"
                type="text"
                class="form-control"
                placeholder="Nome do fornecedor..."
              />
            </div>

          </div>

          <hr class="my-4">

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="salvando">
              <span v-if="salvando" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-lg me-1"></i>
              {{ modoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="limparFormulario">
              <i class="bi bi-x-lg me-1"></i>Limpar
            </button>
            <router-link to="/produtos" class="btn btn-outline-danger ms-auto">
              Cancelar
            </router-link>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ProdutoService from '../services/ProdutoService'

const produtoVazio = () => ({
  nome: '',
  descricao: '',
  categoria: '',
  quantidade: 0,
  quantidadeMinima: 5,
  preco: null,
  unidade: 'un',
  localizacao: '',
  fornecedor: ''
})

export default {
  name: 'FormProduto',
  props: {
    id: { type: [String, Number], default: null }
  },
  data () {
    return {
      produto: produtoVazio(),
      erros: {},
      mensagem: '',
      tipoMensagem: 'success',
      salvando: false
    }
  },
  computed: {
    modoEdicao () {
      return !!this.id
    }
  },
  created () {
    if (this.modoEdicao) this.carregarProduto()
  },
  methods: {
    async carregarProduto () {
      try {
        const resp = await ProdutoService.getById(this.id)
        this.produto = resp.data
      } catch {
        this.exibirMensagem('Erro ao carregar produto.', 'danger')
      }
    },
    validar () {
      this.erros = {}
      if (!this.produto.nome) this.erros.nome = 'Nome é obrigatório.'
      if (this.produto.quantidade < 0) this.erros.quantidade = 'Quantidade não pode ser negativa.'
      if (this.produto.quantidadeMinima < 0) this.erros.quantidadeMinima = 'Estoque mínimo inválido.'
      return Object.keys(this.erros).length === 0
    },
    async salvarProduto () {
      if (!this.validar()) return
      this.salvando = true
      try {
        if (this.modoEdicao) {
          await ProdutoService.update(this.id, this.produto)
          this.exibirMensagem('Produto atualizado com sucesso!', 'success')
        } else {
          await ProdutoService.create(this.produto)
          this.exibirMensagem('Produto cadastrado com sucesso!', 'success')
          this.limparFormulario()
        }
      } catch {
        this.exibirMensagem('Erro ao salvar produto.', 'danger')
      } finally {
        this.salvando = false
      }
    },
    limparFormulario () {
      this.produto = produtoVazio()
      this.erros = {}
    },
    exibirMensagem (texto, tipo = 'success') {
      this.mensagem = texto
      this.tipoMensagem = tipo
      setTimeout(() => { this.mensagem = '' }, 4000)
    }
  }
}
</script>
