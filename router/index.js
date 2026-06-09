import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading de componentes (boas práticas de performance)
const ListaProdutos   = () => import('../components/ListaProdutos.vue')
const FormProduto     = () => import('../components/FormProduto.vue')
const DetalhesProduto = () => import('../components/DetalhesProduto.vue')

const routes = [
  {
    path: '/',
    redirect: '/produtos'
  },
  {
    path: '/produtos',
    name: 'lista-produtos',
    component: ListaProdutos,
    meta: { title: 'Produtos em Estoque' }
  },
  {
    path: '/produtos/novo',
    name: 'novo-produto',
    component: FormProduto,
    meta: { title: 'Cadastrar Produto' }
  },
  {
    path: '/produtos/:id',
    name: 'detalhes-produto',
    component: DetalhesProduto,
    props: true,
    meta: { title: 'Detalhes do Produto' }
  },
  {
    path: '/produtos/:id/editar',
    name: 'editar-produto',
    component: FormProduto,
    props: true,
    meta: { title: 'Editar Produto' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guard global: atualiza o título da aba do navegador
router.beforeEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Estoque`
    : 'Controle de Estoque'
})

export default router
