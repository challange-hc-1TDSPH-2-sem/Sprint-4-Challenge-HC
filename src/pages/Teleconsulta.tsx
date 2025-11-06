import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import teleconsultaService from '../services/teleconsultaService'
import type { TeleconsultaRequest, TeleconsultaResponse } from '../types/api'

type FormData = {
  nomePaciente: string
  sobrenomePaciente: string
  emailPaciente: string
  idade: number
  whatsapp: string
  especialidade: string
  dataConsulta: string
  horaConsulta: string
  cep: string
}

export default function Teleconsulta() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<FormData>()
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [teleconsultas, setTeleconsultas] = useState<TeleconsultaResponse[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados para modais e ações
  const [selectedTeleconsulta, setSelectedTeleconsulta] = useState<TeleconsultaResponse | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    document.title = 'Teleconsulta | HC BRIDGE'
    loadTeleconsultas()
  }, [])

  const loadTeleconsultas = async () => {
    try {
      setLoading(true)
      const data = await teleconsultaService.getAll()
      setTeleconsultas(data)
    } catch (error) {
      console.error('Erro ao carregar teleconsultas:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSuccessMsg(null)
    setErrorMsg(null)
    
    try {
      const requestData: TeleconsultaRequest = {
        nomePaciente: data.nomePaciente,
        sobrenomePaciente: data.sobrenomePaciente,
        emailPaciente: data.emailPaciente,
        idade: Number(data.idade),
        whatsapp: Number(data.whatsapp.replace(/\D/g, '')), // Remove formatação e converte para número
        especialidade: data.especialidade,
        dataConsulta: data.dataConsulta,
        horaConsulta: data.horaConsulta,
        cep: data.cep.replace(/\D/g, ''), // Remove formatação do CEP
      }

      await teleconsultaService.create(requestData)
      setSuccessMsg('Teleconsulta agendada com sucesso! Você receberá um email de confirmação em breve.')
      reset()
      await loadTeleconsultas() // Recarrega a lista
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao agendar teleconsulta. Tente novamente.'
      setErrorMsg(errorMessage)
    }
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
    }
    return value
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  // Função para buscar detalhes por ID
  const handleViewDetails = async (id: number) => {
    try {
      setLoadingDetails(true)
      const teleconsulta = await teleconsultaService.getById(id)
      if (teleconsulta) {
        setSelectedTeleconsulta(teleconsulta)
        setShowDetailsModal(true)
      } else {
        setErrorMsg('Teleconsulta não encontrada.')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      setErrorMsg('Erro ao buscar detalhes da teleconsulta.')
    } finally {
      setLoadingDetails(false)
    }
  }

  // Função para abrir modal de edição
  const handleEdit = (teleconsulta: TeleconsultaResponse) => {
    setSelectedTeleconsulta(teleconsulta)
    // Preenche o formulário com os dados existentes
    setValue('nomePaciente', teleconsulta.nomePaciente)
    setValue('sobrenomePaciente', teleconsulta.sobrenomePaciente)
    setValue('emailPaciente', teleconsulta.emailPaciente)
    setValue('idade', teleconsulta.idade)
    setValue('whatsapp', formatWhatsApp(teleconsulta.whatsapp.toString()))
    setValue('especialidade', teleconsulta.especialidade)
    setValue('dataConsulta', teleconsulta.dataConsulta)
    setValue('horaConsulta', teleconsulta.horaConsulta)
    setValue('cep', formatCEP(teleconsulta.cep))
    setIsEditing(true)
    setShowEditModal(true)
  }

  // Função para atualizar consulta
  const handleUpdate = async (data: FormData) => {
    if (!selectedTeleconsulta?.id) return
    
    setSuccessMsg(null)
    setErrorMsg(null)
    
    try {
      const requestData: Partial<TeleconsultaRequest> = {
        nomePaciente: data.nomePaciente,
        sobrenomePaciente: data.sobrenomePaciente,
        emailPaciente: data.emailPaciente,
        idade: Number(data.idade),
        whatsapp: Number(data.whatsapp.replace(/\D/g, '')),
        especialidade: data.especialidade,
        dataConsulta: data.dataConsulta,
        horaConsulta: data.horaConsulta,
        cep: data.cep.replace(/\D/g, ''),
      }

      await teleconsultaService.update(selectedTeleconsulta.id, requestData)
      setSuccessMsg('Teleconsulta atualizada com sucesso!')
      setShowEditModal(false)
      setIsEditing(false)
      reset()
      await loadTeleconsultas()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar teleconsulta. Tente novamente.'
      setErrorMsg(errorMessage)
    }
  }

  // Função para deletar consulta
  const handleDelete = async () => {
    if (!selectedTeleconsulta?.id) return
    
    setIsDeleting(true)
    setErrorMsg(null)
    
    try {
      await teleconsultaService.cancel(selectedTeleconsulta.id)
      setSuccessMsg('Teleconsulta cancelada com sucesso!')
      setShowDeleteModal(false)
      setSelectedTeleconsulta(null)
      await loadTeleconsultas()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar teleconsulta. Tente novamente.'
      setErrorMsg(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  // Função para abrir modal de confirmação de delete
  const handleDeleteClick = (teleconsulta: TeleconsultaResponse) => {
    setSelectedTeleconsulta(teleconsulta)
    setShowDeleteModal(true)
  }

  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <div className="text-center py-8">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 shadow-soft animate-pulse-soft">
            📹 Teleconsulta Online
          </span>
        </div>
        <h1 className="heading-xl text-gradient-blue mb-6">
          Agendar Teleconsulta
        </h1>
        <p className="text-body text-muted max-w-3xl mx-auto">
          Agende sua consulta médica online de forma rápida e segura. Nossos profissionais estão disponíveis para atendê-lo via videoconferência.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-large p-8">
          <h2 className="heading-md mb-6 text-gray-800">Preencha os dados</h2>
          
          {successMsg && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 shadow-soft" role="alert" aria-live="polite">
              ✅ {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-soft" role="alert" aria-live="polite">
              ❌ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(isEditing ? handleUpdate : onSubmit)} className="space-y-6" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="nomePaciente">
                  Nome <span className="text-red-600">*</span>
                </label>
                <input
                  id="nomePaciente"
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Seu nome"
                  aria-invalid={!!errors.nomePaciente}
                  {...register('nomePaciente', { 
                    required: 'Nome é obrigatório',
                    minLength: { value: 2, message: 'Mínimo de 2 caracteres' }
                  })}
                />
                {errors.nomePaciente && (
                  <p className="text-sm text-red-600 mt-1">{errors.nomePaciente.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="sobrenomePaciente">
                  Sobrenome <span className="text-red-600">*</span>
                </label>
                <input
                  id="sobrenomePaciente"
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Seu sobrenome"
                  aria-invalid={!!errors.sobrenomePaciente}
                  {...register('sobrenomePaciente', { 
                    required: 'Sobrenome é obrigatório',
                    minLength: { value: 2, message: 'Mínimo de 2 caracteres' }
                  })}
                />
                {errors.sobrenomePaciente && (
                  <p className="text-sm text-red-600 mt-1">{errors.sobrenomePaciente.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="emailPaciente">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="emailPaciente"
                type="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                placeholder="seu@email.com"
                aria-invalid={!!errors.emailPaciente}
                {...register('emailPaciente', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email inválido'
                  }
                })}
              />
              {errors.emailPaciente && (
                <p className="text-sm text-red-600 mt-1">{errors.emailPaciente.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="idade">
                  Idade <span className="text-red-600">*</span>
                </label>
                <input
                  id="idade"
                  type="number"
                  min="1"
                  max="120"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Ex: 30"
                  aria-invalid={!!errors.idade}
                  {...register('idade', {
                    required: 'Idade é obrigatória',
                    min: { value: 1, message: 'Idade deve ser maior que 0' },
                    max: { value: 120, message: 'Idade inválida' },
                    valueAsNumber: true
                  })}
                />
                {errors.idade && (
                  <p className="text-sm text-red-600 mt-1">{errors.idade.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="whatsapp">
                  WhatsApp <span className="text-red-600">*</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  aria-invalid={!!errors.whatsapp}
                  {...register('whatsapp', {
                    required: 'WhatsApp é obrigatório',
                    pattern: {
                      value: /^\(\d{2}\) \d{5}-\d{4}$/,
                      message: 'WhatsApp inválido'
                    }
                  })}
                  onChange={(e) => {
                    const formatted = formatWhatsApp(e.target.value)
                    e.target.value = formatted
                  }}
                />
                {errors.whatsapp && (
                  <p className="text-sm text-red-600 mt-1">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="especialidade">
                  Especialidade <span className="text-red-600">*</span>
                </label>
                <select
                  id="especialidade"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  aria-invalid={!!errors.especialidade}
                  {...register('especialidade', { required: 'Selecione uma especialidade' })}
                >
                  <option value="">Selecione...</option>
                  <option value="clinica_geral">Clínica Geral</option>
                  <option value="cardiologia">Cardiologia</option>
                  <option value="dermatologia">Dermatologia</option>
                  <option value="endocrinologia">Endocrinologia</option>
                  <option value="ginecologia">Ginecologia</option>
                  <option value="neurologia">Neurologia</option>
                  <option value="ortopedia">Ortopedia</option>
                  <option value="pediatria">Pediatria</option>
                  <option value="psiquiatria">Psiquiatria</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.especialidade && (
                  <p className="text-sm text-red-600 mt-1">{errors.especialidade.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="cep">
                  CEP <span className="text-red-600">*</span>
                </label>
                <input
                  id="cep"
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="00000-000"
                  maxLength={9}
                  aria-invalid={!!errors.cep}
                  {...register('cep', {
                    required: 'CEP é obrigatório',
                    pattern: {
                      value: /^\d{5}-\d{3}$/,
                      message: 'CEP inválido'
                    }
                  })}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value)
                    e.target.value = formatted
                  }}
                />
                {errors.cep && (
                  <p className="text-sm text-red-600 mt-1">{errors.cep.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="dataConsulta">
                  Data da Consulta <span className="text-red-600">*</span>
                </label>
                <input
                  id="dataConsulta"
                  type="date"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  aria-invalid={!!errors.dataConsulta}
                  {...register('dataConsulta', { required: 'Selecione uma data' })}
                />
                {errors.dataConsulta && (
                  <p className="text-sm text-red-600 mt-1">{errors.dataConsulta.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="horaConsulta">
                  Horário <span className="text-red-600">*</span>
                </label>
                <select
                  id="horaConsulta"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  aria-invalid={!!errors.horaConsulta}
                  {...register('horaConsulta', { required: 'Selecione um horário' })}
                >
                  <option value="">Selecione...</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
                {errors.horaConsulta && (
                  <p className="text-sm text-red-600 mt-1">{errors.horaConsulta.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setShowEditModal(false)
                    reset()
                    setSelectedTeleconsulta(null)
                  }}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isEditing ? 'flex-1' : 'w-full'} px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 shadow-large hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-large`}
              >
                {isSubmitting ? (isEditing ? 'Atualizando...' : 'Agendando...') : (isEditing ? '💾 Atualizar Teleconsulta' : '📅 Agendar Teleconsulta')}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Teleconsultas Agendadas */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-large p-8">
          <h2 className="heading-md mb-6 text-gray-800">Suas Teleconsultas</h2>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : teleconsultas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Nenhuma teleconsulta agendada ainda.</p>
              <p className="text-sm">Preencha o formulário ao lado para agendar.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {teleconsultas.map((teleconsulta) => (
                <div
                  key={teleconsulta.id || Math.random()}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-medium transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {teleconsulta.nomePaciente} {teleconsulta.sobrenomePaciente}
                      </h3>
                      <p className="text-sm text-gray-600">{teleconsulta.especialidade}</p>
                    </div>
                    {teleconsulta.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teleconsulta.status === 'agendada' ? 'bg-green-100 text-green-800' :
                        teleconsulta.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {teleconsulta.status}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>📅 {new Date(teleconsulta.dataConsulta).toLocaleDateString('pt-BR')}</p>
                    <p>🕐 {teleconsulta.horaConsulta}</p>
                    <p>📧 {teleconsulta.emailPaciente}</p>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => teleconsulta.id && handleViewDetails(teleconsulta.id)}
                      disabled={loadingDetails || !teleconsulta.id}
                      className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loadingDetails ? 'Carregando...' : '👁️ Ver'}
                    </button>
                    <button
                      onClick={() => handleEdit(teleconsulta)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(teleconsulta)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                    >
                      🗑️ Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedTeleconsulta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Detalhes da Teleconsulta</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-gray-800 font-semibold">{selectedTeleconsulta.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTeleconsulta.status === 'agendada' ? 'bg-green-100 text-green-800' :
                    selectedTeleconsulta.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                    selectedTeleconsulta.status === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedTeleconsulta.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome</label>
                  <p className="text-gray-800">{selectedTeleconsulta.nomePaciente} {selectedTeleconsulta.sobrenomePaciente}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Idade</label>
                  <p className="text-gray-800">{selectedTeleconsulta.idade} anos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-800">{selectedTeleconsulta.emailPaciente}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                  <p className="text-gray-800">{formatWhatsApp(selectedTeleconsulta.whatsapp.toString())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Especialidade</label>
                  <p className="text-gray-800">{selectedTeleconsulta.especialidade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CEP</label>
                  <p className="text-gray-800">{formatCEP(selectedTeleconsulta.cep)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data da Consulta</label>
                  <p className="text-gray-800">{new Date(selectedTeleconsulta.dataConsulta).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Horário</label>
                  <p className="text-gray-800">{selectedTeleconsulta.horaConsulta}</p>
                </div>
                {selectedTeleconsulta.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Criado em</label>
                    <p className="text-gray-800">{new Date(selectedTeleconsulta.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                )}
                {selectedTeleconsulta.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Atualizado em</label>
                    <p className="text-gray-800">{new Date(selectedTeleconsulta.updatedAt).toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  handleEdit(selectedTeleconsulta)
                }}
                className="px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl font-medium transition-all"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedTeleconsulta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => {
          setShowEditModal(false)
          setIsEditing(false)
          reset()
        }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Editar Teleconsulta</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setIsEditing(false)
                  reset()
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
                {/* Mesmo formulário, mas já preenchido */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Nome <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      {...register('nomePaciente', { 
                        required: 'Nome é obrigatório',
                        minLength: { value: 2, message: 'Mínimo de 2 caracteres' }
                      })}
                    />
                    {errors.nomePaciente && (
                      <p className="text-sm text-red-600 mt-1">{errors.nomePaciente.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Sobrenome <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      {...register('sobrenomePaciente', { 
                        required: 'Sobrenome é obrigatório',
                        minLength: { value: 2, message: 'Mínimo de 2 caracteres' }
                      })}
                    />
                    {errors.sobrenomePaciente && (
                      <p className="text-sm text-red-600 mt-1">{errors.sobrenomePaciente.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    {...register('emailPaciente', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email inválido'
                      }
                    })}
                  />
                  {errors.emailPaciente && (
                    <p className="text-sm text-red-600 mt-1">{errors.emailPaciente.message}</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Idade <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      {...register('idade', {
                        required: 'Idade é obrigatória',
                        min: { value: 1, message: 'Idade deve ser maior que 0' },
                        max: { value: 120, message: 'Idade inválida' },
                        valueAsNumber: true
                      })}
                    />
                    {errors.idade && (
                      <p className="text-sm text-red-600 mt-1">{errors.idade.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      WhatsApp <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      maxLength={15}
                      {...register('whatsapp', {
                        required: 'WhatsApp é obrigatório',
                        pattern: {
                          value: /^\(\d{2}\) \d{5}-\d{4}$/,
                          message: 'WhatsApp inválido'
                        }
                      })}
                      onChange={(e) => {
                        const formatted = formatWhatsApp(e.target.value)
                        e.target.value = formatted
                      }}
                    />
                    {errors.whatsapp && (
                      <p className="text-sm text-red-600 mt-1">{errors.whatsapp.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Especialidade <span className="text-red-600">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      {...register('especialidade', { required: 'Selecione uma especialidade' })}
                    >
                      <option value="">Selecione...</option>
                      <option value="clinica_geral">Clínica Geral</option>
                      <option value="cardiologia">Cardiologia</option>
                      <option value="dermatologia">Dermatologia</option>
                      <option value="endocrinologia">Endocrinologia</option>
                      <option value="ginecologia">Ginecologia</option>
                      <option value="neurologia">Neurologia</option>
                      <option value="ortopedia">Ortopedia</option>
                      <option value="pediatria">Pediatria</option>
                      <option value="psiquiatria">Psiquiatria</option>
                      <option value="outro">Outro</option>
                    </select>
                    {errors.especialidade && (
                      <p className="text-sm text-red-600 mt-1">{errors.especialidade.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      CEP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      maxLength={9}
                      {...register('cep', {
                        required: 'CEP é obrigatório',
                        pattern: {
                          value: /^\d{5}-\d{3}$/,
                          message: 'CEP inválido'
                        }
                      })}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value)
                        e.target.value = formatted
                      }}
                    />
                    {errors.cep && (
                      <p className="text-sm text-red-600 mt-1">{errors.cep.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Data da Consulta <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('dataConsulta', { required: 'Selecione uma data' })}
                    />
                    {errors.dataConsulta && (
                      <p className="text-sm text-red-600 mt-1">{errors.dataConsulta.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Horário <span className="text-red-600">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      {...register('horaConsulta', { required: 'Selecione um horário' })}
                    >
                      <option value="">Selecione...</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                    {errors.horaConsulta && (
                      <p className="text-sm text-red-600 mt-1">{errors.horaConsulta.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setIsEditing(false)
                      reset()
                    }}
                    className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 shadow-large hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Atualizando...' : '💾 Atualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {showDeleteModal && selectedTeleconsulta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Cancelar Teleconsulta</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja cancelar a teleconsulta de <strong>{selectedTeleconsulta.nomePaciente} {selectedTeleconsulta.sobrenomePaciente}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Data: {new Date(selectedTeleconsulta.dataConsulta).toLocaleDateString('pt-BR')} às {selectedTeleconsulta.horaConsulta}
              </p>
              <p className="text-sm text-red-600 mt-2 font-medium">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                Não, manter
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Cancelando...' : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="gradient-primary rounded-3xl p-8 border border-purple-200/50 shadow-large">
        <h3 className="heading-lg text-center mb-4 text-gradient-blue">Como Funciona</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h4 className="font-semibold mb-2">1. Preencha o Formulário</h4>
            <p className="text-sm text-gray-600">Informe seus dados e preferências de agendamento</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h4 className="font-semibold mb-2">2. Confirmação</h4>
            <p className="text-sm text-gray-600">Receba a confirmação por email com o link da consulta</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📹</span>
            </div>
            <h4 className="font-semibold mb-2">3. Atendimento Online</h4>
            <p className="text-sm text-gray-600">Participe da consulta via videoconferência no horário agendado</p>
          </div>
        </div>
      </div>
    </section>
  )
}
