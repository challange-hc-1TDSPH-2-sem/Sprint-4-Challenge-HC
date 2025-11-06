import api from './api'
import type { TeleconsultaRequest, TeleconsultaResponse, TeleconsultaStatus } from '../types/api'

/**
 * Serviço para gerenciar teleconsultas via API
 * 
 * Exemplo de uso:
 * import teleconsultaService from './services/teleconsultaService'
 * 
 * // Criar teleconsulta
 * const teleconsulta = await teleconsultaService.create({
 *   pacienteNome: 'João Silva',
 *   pacienteCpf: '12345678900',
 *   pacienteEmail: 'joao@email.com',
 *   pacienteTelefone: '11999999999',
 *   especialidade: 'cardiologia',
 *   dataPreferencia: '2024-12-15',
 *   horarioPreferencia: '14:00',
 *   motivo: 'Dor no peito'
 * })
 * 
 * // Listar teleconsultas
 * const teleconsultas = await teleconsultaService.getAll()
 */

const teleconsultaService = {
  /**
   * Lista todas as teleconsultas
   * GET /teleconsulta
   */
  async getAll(): Promise<TeleconsultaResponse[]> {
    try {
      const response = await api.get<TeleconsultaResponse[]>('/teleconsulta')
      // A API pode retornar um array diretamente ou dentro de um objeto
      if (Array.isArray(response.data)) {
        return response.data
      }
      // Se retornar um objeto, tenta acessar uma propriedade comum
      return []
    } catch (error) {
      console.error('Erro ao buscar teleconsultas:', error)
      throw error
    }
  },

  /**
   * Busca uma teleconsulta por ID (codigo)
   * GET /teleconsulta/(codigo)
   */
  async getById(id: number): Promise<TeleconsultaResponse | null> {
    try {
      const response = await api.get<TeleconsultaResponse>(`/teleconsulta/${id}`)
      return response.data || null
    } catch (error) {
      console.error(`Erro ao buscar teleconsulta ${id}:`, error)
      throw error
    }
  },

  /**
   * Cria uma nova teleconsulta
   * POST /teleconsulta
   */
  async create(data: TeleconsultaRequest): Promise<TeleconsultaResponse> {
    try {
      const response = await api.post<TeleconsultaResponse>('/teleconsulta', data)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error('Erro ao criar teleconsulta:', error)
      throw error
    }
  },

  /**
   * Atualiza uma teleconsulta existente
   * PUT /teleconsulta/(codigo)
   */
  async update(id: number, data: Partial<TeleconsultaRequest>): Promise<TeleconsultaResponse> {
    try {
      const response = await api.put<TeleconsultaResponse>(`/teleconsulta/${id}`, data)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar teleconsulta ${id}:`, error)
      throw error
    }
  },

  /**
   * Atualiza o status de uma teleconsulta
   * PUT /teleconsulta/(codigo) - usando PUT para atualizar status
   */
  async updateStatus(id: number, status: TeleconsultaStatus): Promise<TeleconsultaResponse> {
    try {
      const response = await api.put<TeleconsultaResponse>(`/teleconsulta/${id}`, { status })
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar status da teleconsulta ${id}:`, error)
      throw error
    }
  },

  /**
   * Cancela/Desmarca uma teleconsulta
   * DELETE /teleconsulta/(codigo)
   */
  async cancel(id: number): Promise<void> {
    try {
      await api.delete(`/teleconsulta/${id}`)
    } catch (error) {
      console.error(`Erro ao cancelar teleconsulta ${id}:`, error)
      throw error
    }
  },
}

export default teleconsultaService

