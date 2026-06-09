/**
 * http-common.js
 * Configuração centralizada do cliente HTTP (Axios).
 *
 * Conceito aplicado: separação de concerns (SoC) — toda configuração de
 * comunicação com a API fica neste arquivo, isolada dos componentes.
 */
import axios from 'axios'

export default axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
})
