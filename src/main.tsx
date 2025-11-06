import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Emergencias from './pages/Emergencias.tsx'
import Chatbot from './pages/Chatbot.tsx'
import Servicos from './pages/Servicos.tsx'
import Integrantes from './pages/Integrantes.tsx'
import Sobre from './pages/Sobre.tsx'
import FAQ from './pages/FAQ.tsx'
import Contato from './pages/Contato.tsx'
import ServicoDetalhe from './pages/ServicoDetalhe.tsx'
import NotFound from './pages/NotFound.tsx'
import Teleconsulta from './pages/Teleconsulta.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'emergencias', element: <Emergencias /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'servicos', element: <Servicos /> },
      { path: 'servicos/:id', element: <ServicoDetalhe /> },
      { path: 'integrantes', element: <Integrantes /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'contato', element: <Contato /> },
      { path: 'teleconsulta', element: <Teleconsulta /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
