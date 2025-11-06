import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

function App() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  // ScrollToTop ao trocar de rota
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname])
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-3 py-2 rounded">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-soft" role="banner">
        <div className="container-app">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                <span className="text-white font-bold text-lg">🚨</span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight">
                  <span className="text-gradient">HC</span> BRIDGE
                </div>
                <div className="text-xs text-gray-500 -mt-1">Assistente Virtual 24/7</div>
              </div>
            </Link>
            <button className="sm:hidden p-2 rounded hover:bg-gray-100" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)}>
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <nav className="hidden sm:flex gap-1 text-sm">
              <NavLink to="/" end className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-red-100 text-red-700 shadow-soft' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>Home</NavLink>
              <NavLink to="/emergencias" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-red-100 text-red-700 shadow-soft' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}>🚨 Emergências</NavLink>
              <NavLink to="/chatbot" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-700 shadow-soft' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>🤖 Chatbot</NavLink>
              <NavLink to="/servicos" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-green-100 text-green-700 shadow-soft' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'}`}>🏥 Serviços</NavLink>
              <NavLink to="/sobre" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-700 shadow-soft' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>Sobre</NavLink>
              <NavLink to="/faq" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-700 shadow-soft' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>FAQ</NavLink>
              <NavLink to="/integrantes" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-700 shadow-soft' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>Integrantes</NavLink>
              <NavLink to="/contato" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-700 shadow-soft' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>Contato</NavLink>
              <NavLink to="/teleconsulta" className={({ isActive }) => `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-purple-100 text-purple-700 shadow-soft' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}>📹 Teleconsulta</NavLink>
            </nav>
          </div>
          {open && (
            <nav className="sm:hidden pb-3 -mt-2 space-y-1">
              <NavLink onClick={() => setOpen(false)} to="/" end className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}>Home</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/emergencias" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}>🚨 Emergências</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/chatbot" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>🤖 Chatbot</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/servicos" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}>🏥 Serviços</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/sobre" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>Sobre</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/faq" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>FAQ</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/integrantes" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>Integrantes</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/contato" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>Contato</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/teleconsulta" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'}`}>📹 Teleconsulta</NavLink>
            </nav>
          )}
        </div>
      </header>

      <main id="conteudo" className="flex-1" role="main">
        <div className="container-app py-10">
          <Outlet />
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20" role="contentinfo">
        <div className="container-app">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🚨</span>
                </div>
              <div className="font-bold text-lg">HC BRIDGE</div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Assistente virtual inteligente para emergências médicas, marcação de consultas e orientações de saúde 24/7.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <div className="space-y-2 text-sm">
                <a href="/emergencias" className="block text-gray-300 hover:text-white transition-colors">🚨 Emergências</a>
                <a href="/chatbot" className="block text-gray-300 hover:text-white transition-colors">🤖 Chatbot</a>
                <a href="/servicos" className="block text-gray-300 hover:text-white transition-colors">🏥 Serviços</a>
                <a href="/faq" className="block text-gray-300 hover:text-white transition-colors">❓ FAQ</a>
                <a href="/contato" className="block text-gray-300 hover:text-white transition-colors">✉️ Contato</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contatos de Emergência</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">🚑</span>
                  <a href="tel:192" className="text-gray-300 hover:text-white transition-colors">SAMU - 192</a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">🚒</span>
                  <a href="tel:193" className="text-gray-300 hover:text-white transition-colors">Bombeiros - 193</a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">💬</span>
                  <a href="tel:188" className="text-gray-300 hover:text-white transition-colors">CVV - 188</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} HC Emergency Assistant — Assistente Virtual para Emergências Médicas
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
