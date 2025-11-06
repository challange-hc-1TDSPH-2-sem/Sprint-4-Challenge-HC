/**
 * Tipos e interfaces para integração com a API RESTful
 * Demonstração de tipos básicos, Union Types, Intersection Types e Interfaces
 */

// ============================================
// TIPOS BÁSICOS (number, string, boolean, object)
// ============================================

// Tipos primitivos
export type ID = number
export type Email = string
export type Phone = string
export type Status = string
export type Timestamp = string

// Tipos booleanos
export type IsActive = boolean
export type IsEmergency = boolean

// Tipos de objeto
export type Metadata = {
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================
// UNION TYPES
// ============================================

// Union Type: Status pode ser um dos valores específicos
export type EmergencyStatus = 'pendente' | 'em_atendimento' | 'resolvida' | 'cancelada'

// Union Type: Tipo de emergência
export type EmergencyType = 'cardiaco' | 'respiratorio' | 'trauma' | 'neurologico' | 'outro'

// Union Type: Método HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Union Type: Tipo de resposta da API
export type ApiResult<T> = 
  | { success: true; data: T; status: number }
  | { success: false; error: string; status: number }

// Union Type: Prioridade
export type Priority = 'baixa' | 'media' | 'alta' | 'critica'

// ============================================
// INTERSECTION TYPES
// ============================================

// Base: Dados básicos de uma emergência
export interface EmergencyBase {
  tipo: EmergencyType
  descricao: string
  contato: Phone
}

// Metadata: Informações de sistema
export interface EmergencyMetadata {
  id: ID
  status: EmergencyStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Intersection Type: Combina base + metadata
export type Emergency = EmergencyBase & EmergencyMetadata

// Intersection Type: Emergência com localização opcional
export interface EmergencyWithLocation {
  localizacao?: string
  latitude?: number
  longitude?: number
}

export type EmergencyComplete = Emergency & EmergencyWithLocation

// Intersection Type: Usuário com permissões
export interface UserBase {
  id: ID
  nome: string
  email: Email
}

export interface UserPermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

export type UserWithPermissions = UserBase & UserPermissions

// ============================================
// INTERFACES
// ============================================

// Interface: Resposta genérica da API
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  success?: boolean
  error?: string
  status?: number
}

// Interface: Erro da API
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Interface: Configuração de requisição
export interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string | number | boolean>
  timeout?: number
}

// Interface: Dados de login
export interface LoginRequest {
  email: Email
  password: string
}

// Interface: Resposta de login
export interface LoginResponse {
  token: string
  user: UserBase
  expiresIn: number
}

// Interface: Requisição de emergência
export interface EmergencyRequest extends EmergencyBase {
  localizacao?: string
  prioridade?: Priority
}

// Interface: Resposta de emergência (usando Intersection)
export interface EmergencyResponse extends Emergency {
  prioridade: Priority
  atendidoPor?: UserBase
}

// Interface: Paginação
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Interface: Resposta paginada
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// TIPOS COMPLEXOS COM UNION + INTERSECTION
// ============================================

// Union Type: Diferentes tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// Intersection: Notificação completa
export interface NotificationBase {
  type: NotificationType
  message: string
}

export interface NotificationMetadata {
  id: ID
  timestamp: Timestamp
  read: boolean
}

export type Notification = NotificationBase & NotificationMetadata

// Union Type: Tipo de serviço médico
export type ServiceType = 'consulta' | 'exame' | 'procedimento' | 'emergencia'

// Intersection: Serviço completo
export interface ServiceBase {
  tipo: ServiceType
  titulo: string
  descricao: string
}

export interface ServiceDetails {
  duracao: number // em minutos
  preco: number
  disponivel: boolean
}

export type Service = ServiceBase & ServiceDetails & Metadata

// ============================================
// TIPOS PARA TELECONSULTA
// ============================================

// Union Type: Status de teleconsulta
export type TeleconsultaStatus = 'agendada' | 'confirmada' | 'realizada' | 'cancelada'

// Union Type: Especialidade médica
export type Especialidade = 
  | 'clinica_geral' 
  | 'cardiologia' 
  | 'dermatologia' 
  | 'endocrinologia' 
  | 'ginecologia' 
  | 'neurologia' 
  | 'ortopedia' 
  | 'pediatria' 
  | 'psiquiatria' 
  | 'outro'

// Interface: Requisição de teleconsulta (conforme API Java)
export interface TeleconsultaRequest {
  nomePaciente: string
  sobrenomePaciente: string
  emailPaciente: string
  idade: number
  whatsapp: number
  especialidade: string
  dataConsulta: string
  horaConsulta: string
  cep: string
}

// Interface: Resposta de teleconsulta (usando Intersection)
export interface TeleconsultaBase {
  nomePaciente: string
  sobrenomePaciente: string
  emailPaciente: string
  idade: number
  whatsapp: number
  especialidade: string
  dataConsulta: string
  horaConsulta: string
  cep: string
}

export interface TeleconsultaMetadata {
  id: ID
  status: TeleconsultaStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type TeleconsultaResponse = TeleconsultaBase & TeleconsultaMetadata

// Interface para resposta bruta da API (com codigo em vez de id)
export interface TeleconsultaApiResponse {
  codigo: number
  nomePaciente: string
  sobrenomePaciente: string
  emailPaciente: string
  idade: number
  whatsapp: number
  especialidade: string
  dataConsulta: string
  horaConsulta: string
  cep: string
  status: string // API retorna "Agendada" com A maiúscula
}


