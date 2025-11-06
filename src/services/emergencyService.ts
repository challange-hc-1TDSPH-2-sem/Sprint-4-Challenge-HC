import api from './api'
import type { 
  EmergencyRequest, 
  EmergencyResponse,
  EmergencyStatus,
  Priority,
  PaginatedResponse 
} from '../types/api'

/**
 * Serviço para gerenciar emergências via API
 * 
 * Exemplo de uso:
 * import emergencyService from './services/emergencyService'
 * 
 * // Criar emergência
 * const emergency = await emergencyService.create({
 *   tipo: 'cardiaco',
 *   descricao: 'Dor no peito',
 *   contato: '11999999999'
 * })
 * 
 * // Listar emergências
 * const emergencies = await emergencyService.getAll()
 * 
 * // Buscar por ID
 * const emergency = await emergencyService.getById(1)
 */

const emergencyService = {
  /**
   * Lista todas as emergências
   * GET /api/emergencias
   */
  async getAll(): Promise<EmergencyResponse[]> {
    try {
      const response = await api.get<EmergencyResponse[]>('/emergencias')
      return response.data || []
    } catch (error) {
      console.error('Erro ao buscar emergências:', error)
      throw error
    }
  },

  /**
   * Lista emergências com paginação
   * GET /api/emergencias?page=1&limit=10
   */
  async getAllPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<EmergencyResponse>> {
    try {
      const response = await api.get<PaginatedResponse<EmergencyResponse>>(
        '/emergencias',
        { page, limit }
      )
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error('Erro ao buscar emergências paginadas:', error)
      throw error
    }
  },

  /**
   * Busca uma emergência por ID
   */
  async getById(id: number): Promise<EmergencyResponse | null> {
    try {
      const response = await api.get<EmergencyResponse>(`/emergencias/${id}`)
      return response.data || null
    } catch (error) {
      console.error(`Erro ao buscar emergência ${id}:`, error)
      throw error
    }
  },

  /**
   * Cria uma nova emergência
   */
  async create(data: EmergencyRequest): Promise<EmergencyResponse> {
    try {
      const response = await api.post<EmergencyResponse>('/emergencias', data)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error('Erro ao criar emergência:', error)
      throw error
    }
  },

  /**
   * Atualiza uma emergência existente
   * PUT /api/emergencias/:id
   */
  async update(id: number, data: Partial<EmergencyRequest>): Promise<EmergencyResponse> {
    try {
      const response = await api.put<EmergencyResponse>(`/emergencias/${id}`, data)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar emergência ${id}:`, error)
      throw error
    }
  },

  /**
   * Atualiza parcialmente uma emergência (status, prioridade, etc.)
   * PATCH /api/emergencias/:id
   */
  async patch(id: number, updates: { status?: EmergencyStatus; prioridade?: Priority }): Promise<EmergencyResponse> {
    try {
      const response = await api.patch<EmergencyResponse>(`/emergencias/${id}`, updates)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar parcialmente emergência ${id}:`, error)
      throw error
    }
  },

  /**
   * Deleta uma emergência
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/emergencias/${id}`)
    } catch (error) {
      console.error(`Erro ao deletar emergência ${id}:`, error)
      throw error
    }
  },
}

export default emergencyService


