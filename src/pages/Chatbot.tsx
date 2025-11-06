import { useEffect, useState } from 'react'

const quickActions = [
  { id: 'symptoms', label: 'Descrever Sintomas', icon: '🤒' },
  { id: 'appointment', label: 'Marcar Consulta', icon: '📅' },
  { id: 'results', label: 'Ver Resultados', icon: '📋' },
  { id: 'medication', label: 'Dúvidas sobre Medicamentos', icon: '💊' },
  { id: 'emergency', label: 'Emergência', icon: '🚨' },
  { id: 'general', label: 'Pergunta Geral', icon: '❓' }
]

const sampleQuestions = [
  'Como marcar uma consulta de emergência?',
  'Onde posso ver meus exames?',
  'Preciso de orientação sobre meus medicamentos',
  'Estou com dor de cabeça forte, o que fazer?',
  'Como acessar minha receita digital?'
]

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o assistente virtual do HC. Como posso ajudar você hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    document.title = 'Chatbot | HC BRIDGE'
    const saved = sessionStorage.getItem('hc_chat_msgs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as unknown
        if (Array.isArray(parsed) && parsed.length) {
          const parsedMessages = (parsed as StoredMessage[])
            .filter((m) => typeof m === 'object' && m !== null && 'timestamp' in m)
            .map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
          setMessages(parsedMessages)
        }
      } catch (error) {
        // Falha ao restaurar mensagens; ignora armazenamento corrompido
        console.error('Erro ao carregar mensagens do chat:', error)
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('hc_chat_msgs', JSON.stringify(messages))
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: generateBotResponse(text),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userText: string): string => {
    const text = userText.toLowerCase()
    
    if (text.includes('emergência') || text.includes('urgente') || text.includes('dor forte')) {
      return '🚨 Entendo que você está com uma emergência. Para situações críticas, ligue 192 imediatamente. Posso ajudar a orientar primeiros socorros ou conectar você com especialistas. Descreva melhor seus sintomas.'
    }
    
    if (text.includes('consulta') || text.includes('marcar') || text.includes('agendar')) {
      return '📅 Posso ajudar você a marcar uma consulta! Para consultas de emergência, posso conectar você diretamente com especialistas. Para consultas de rotina, posso orientar sobre disponibilidade. Qual tipo de consulta você precisa?'
    }
    
    if (text.includes('exame') || text.includes('resultado') || text.includes('laudo')) {
      return '📋 Para acessar seus exames e resultados, você pode usar o Portal do Paciente HC. Posso orientar você no processo de login e navegação. Precisa de ajuda para acessar algum resultado específico?'
    }
    
    if (text.includes('medicamento') || text.includes('remédio') || text.includes('receita')) {
      return '💊 Posso ajudar com dúvidas sobre medicamentos! Posso orientar sobre dosagem, interações medicamentosas, ou ajudar a acessar sua receita digital. Qual sua dúvida específica?'
    }
    
    if (text.includes('sintoma') || text.includes('dor') || text.includes('mal-estar')) {
      return '🤒 Entendo que você está com sintomas. Para uma avaliação adequada, preciso de mais informações: há quanto tempo você está com esses sintomas? A intensidade é leve, moderada ou forte? Isso me ajudará a orientar melhor.'
    }
    
    return 'Entendo sua pergunta. Posso ajudar com informações sobre consultas, exames, medicamentos, emergências e orientações gerais de saúde. Pode ser mais específico sobre o que precisa?'
  }

  const handleQuickAction = (actionId: string) => {
    const actionTexts = {
      symptoms: 'Gostaria de descrever meus sintomas para avaliação',
      appointment: 'Preciso marcar uma consulta',
      results: 'Quero acessar meus exames e resultados',
      medication: 'Tenho dúvidas sobre meus medicamentos',
      emergency: 'Estou com uma emergência médica',
      general: 'Tenho uma pergunta geral sobre saúde'
    }
    
    sendMessage(actionTexts[actionId as keyof typeof actionTexts])
  }

  return (
    <section className="max-w-5xl mx-auto space-y-8">
      <div className="text-center py-8">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 shadow-soft animate-pulse-soft">
            🤖 Assistente Inteligente
          </span>
        </div>
        <h1 className="heading-xl text-gradient-blue mb-6">
          Assistente Virtual HC
        </h1>
        <p className="text-body text-muted max-w-3xl mx-auto">
          Seu assistente inteligente para emergências, consultas e orientações de saúde
        </p>
      </div>

      {/* Ações Rápidas */}
      <div className="gradient-primary rounded-3xl p-8 border border-blue-200/50 shadow-large">
        <h2 className="heading-lg text-center mb-8 text-gradient-blue">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              className="flex items-center gap-3 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 text-sm group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
                <span className="text-lg text-white">{action.icon}</span>
              </div>
              <span className="text-left font-medium text-gray-700 group-hover:text-blue-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-large overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Assistente Virtual HC</h3>
              <p className="text-blue-100 text-sm">Online • Resposta em segundos</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-soft ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-soft">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>

      {/* Perguntas Frequentes */}
      <div className="gradient-primary rounded-3xl p-8 border border-blue-200/50 shadow-large">
        <h2 className="heading-lg text-center mb-8 text-gradient-blue">Perguntas Frequentes</h2>
        <div className="space-y-3">
          {sampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => sendMessage(question)}
              className="w-full text-left p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 text-sm group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-700">{question}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Informações de Emergência */}
      <div className="gradient-emergency rounded-3xl p-8 border border-red-200/50 shadow-large">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span className="text-3xl text-white">🚨</span>
          </div>
          <h3 className="heading-lg text-red-800 mb-3">
            Emergência Médica?
          </h3>
          <p className="text-body text-red-700 mb-6">
            Para situações de emergência crítica, ligue imediatamente:
          </p>
          <a
            href="tel:192"
            className="btn-emergency"
          >
            📞 SAMU - 192
          </a>
        </div>
      </div>
    </section>
  )
}
