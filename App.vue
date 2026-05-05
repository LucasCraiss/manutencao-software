<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <i class="bi bi-box-seam me-2"></i>
          Controle de Estoque
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/produtos">
                <i class="bi bi-grid me-1"></i>Produtos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/produtos/novo">
                <i class="bi bi-plus-circle me-1"></i>Novo Produto
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <div class="container mt-4">
      <router-view />
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3 mt-5">
      <small>
        Sistema de Controle de Estoque &mdash; Disciplina de Manutenção de Software
      </small>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  background-color: #f8f9fa;
}
.navbar-brand {
  font-weight: bold;
  font-size: 1.3rem;
}
</style>
