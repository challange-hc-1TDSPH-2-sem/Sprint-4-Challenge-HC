import api from './api'
import type { TeleconsultaRequest, TeleconsultaResponse, TeleconsultaStatus, TeleconsultaApiResponse } from '../types/api'

/**
 * Extrai apenas a data de uma string datetime
 */
function extractDate(dateTimeString: string): string {
  if (dateTimeString.includes(' ')) {
    return dateTimeString.split(' ')[0]
  }
  return dateTimeString
}

/**
 * Normaliza o status da API para o formato esperado
 */
function normalizeStatus(status: string | null | undefined): TeleconsultaStatus {
  // Se status for null ou undefined, retorna o valor padrão
  if (!status) {
    return 'agendada'
  }
  
  const normalized = status.toLowerCase()
  if (normalized === 'agendada') return 'agendada'
  if (normalized === 'confirmada') return 'confirmada'
  if (normalized === 'realizada') return 'realizada'
  if (normalized === 'cancelada') return 'cancelada'
  return 'agendada' // default
}

/**
 * Mapeia a resposta da API para o formato esperado pelo frontend
 */
function mapApiResponseToTeleconsulta(apiData: TeleconsultaApiResponse): TeleconsultaResponse {
  return {
    id: apiData.codigo, // Mapeia codigo para id
    nomePaciente: apiData.nomePaciente,
    sobrenomePaciente: apiData.sobrenomePaciente,
    emailPaciente: apiData.emailPaciente,
    idade: apiData.idade,
    whatsapp: apiData.whatsapp,
    especialidade: apiData.especialidade,
    dataConsulta: extractDate(apiData.dataConsulta), // Extrai apenas a data (YYYY-MM-DD)
    horaConsulta: apiData.horaConsulta,
    cep: apiData.cep,
    status: normalizeStatus(apiData.status),
    createdAt: new Date().toISOString(), // API não retorna, usamos data atual
    updatedAt: new Date().toISOString(), // API não retorna, usamos data atual
  }
}

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
      const response = await api.get<TeleconsultaApiResponse[]>('/teleconsulta')
      // A API pode retornar um array diretamente ou dentro de um objeto
      if (Array.isArray(response.data)) {
        return response.data.map(mapApiResponseToTeleconsulta)
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
      const response = await api.get<TeleconsultaApiResponse>(`/teleconsulta/${id}`)
      if (!response.data) {
        return null
      }
      return mapApiResponseToTeleconsulta(response.data)
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
      const response = await api.post<TeleconsultaApiResponse>('/teleconsulta', data)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return mapApiResponseToTeleconsulta(response.data)
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
      const response = await api.put<TeleconsultaApiResponse>(`/teleconsulta/${id}`, data)
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      
      // Se a resposta não tiver todos os campos, busca novamente para garantir dados completos
      if (!response.data.codigo || !response.data.nomePaciente) {
        // Se a resposta estiver incompleta, busca novamente por ID
        const teleconsulta = await this.getById(id)
        if (!teleconsulta) {
          throw new Error('Não foi possível obter a teleconsulta atualizada')
        }
        return teleconsulta
      }
      
      return mapApiResponseToTeleconsulta(response.data)
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
      // A API espera o status com primeira letra maiúscula
      const statusForApi = status.charAt(0).toUpperCase() + status.slice(1)
      const response = await api.put<TeleconsultaApiResponse>(`/teleconsulta/${id}`, { status: statusForApi })
      if (!response.data) {
        throw new Error('Resposta da API não contém dados')
      }
      return mapApiResponseToTeleconsulta(response.data)
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

