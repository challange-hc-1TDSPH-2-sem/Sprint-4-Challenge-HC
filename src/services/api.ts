import type { ApiResponse, ApiError, RequestConfig } from '../types/api'

/**
 * Cliente HTTP base para integração com API RESTful
 * 
 * Uso:
 * import api from './services/api'
 * 
 * // GET
 * const data = await api.get('/emergencias')
 * 
 * // POST
 * const result = await api.post('/emergencias', { tipo: '...', descricao: '...' })
 * 
 * // PUT
 * await api.put('/emergencias/1', { status: 'atendido' })
 * 
 * // DELETE
 * await api.delete('/emergencias/1')
 */

// URL base da API - sem o prefixo /api pois a API Java não usa esse prefixo
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sprint4java564969.onrender.com'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

/**
 * Constrói a URL completa com query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(endpoint, API_BASE_URL)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }
  
  return url.toString()
}

/**
 * Trata erros da API
 */
function handleError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
    }
  }
  
  return {
    message: 'Erro desconhecido',
    status: 0,
  }
}

/**
 * Faz uma requisição HTTP
 */
async function request<T = unknown>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    timeout = API_TIMEOUT,
  } = config

  const url = buildUrl(endpoint, params)
  
  // Headers padrão
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Adiciona token de autenticação se existir (opcional)
  const token = localStorage.getItem('auth_token')
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  try {
    // Cria a requisição com timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Verifica se a resposta é OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        message: errorData.message || `Erro ${response.status}: ${response.statusText}`,
        status: response.status,
        errors: errorData.errors,
      } as ApiError
    }

    // Parse da resposta
    const data = await response.json().catch(() => null)

    // A API pode retornar os dados diretamente ou dentro de um objeto
    // Se for um array ou objeto simples, retorna diretamente
    const responseData = data as T

    return {
      data: responseData,
      success: true,
      status: response.status,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        message: 'Timeout: A requisição demorou muito para responder',
        status: 408,
      } as ApiError
    }

    throw handleError(error)
  }
}

/**
 * Cliente API com métodos HTTP
 */
const api = {
  /**
   * GET - Buscar dados
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    config?: Omit<RequestConfig, 'method' | 'body' | 'params'>
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'GET', params })
  },

  /**
   * POST - Criar novo recurso
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'POST', body })
  },

  /**
   * PUT - Atualizar recurso completo
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'PUT', body })
  },

  /**
   * PATCH - Atualizar recurso parcialmente
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'PATCH', body })
  },

  /**
   * DELETE - Deletar recurso
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'DELETE' })
  },
}

export default api


