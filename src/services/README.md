# Integração com API RESTful

Este diretório contém os serviços para integração com sua API RESTful em Java.

## Configuração

1. **Configure a URL da API** no arquivo `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. **Ajuste a URL conforme seu ambiente**:
   - Desenvolvimento: `http://localhost:8080/api`
   - Produção: `https://seu-dominio.com/api`

## Estrutura

- `api.ts` - Cliente HTTP base com métodos GET, POST, PUT, PATCH, DELETE
- `emergencyService.ts` - Exemplo de serviço para emergências
- `types/api.ts` - Tipos TypeScript para requisições e respostas

## Como Usar

### Exemplo 1: Usando o cliente base diretamente

```typescript
import api from './services/api'

// GET
const response = await api.get('/emergencias')
console.log(response.data)

// POST
const newEmergency = await api.post('/emergencias', {
  tipo: 'cardiaco',
  descricao: 'Dor no peito',
  contato: '11999999999'
})

// PUT
await api.put('/emergencias/1', { status: 'atendido' })

// DELETE
await api.delete('/emergencias/1')
```

### Exemplo 2: Usando um serviço específico

```typescript
import emergencyService from './services/emergencyService'

// Listar todas
const emergencies = await emergencyService.getAll()

// Criar nova
const emergency = await emergencyService.create({
  tipo: 'cardiaco',
  descricao: 'Dor no peito',
  contato: '11999999999'
})

// Buscar por ID
const emergency = await emergencyService.getById(1)

// Atualizar
await emergencyService.update(1, { status: 'atendido' })

// Deletar
await emergencyService.delete(1)
```

### Exemplo 3: Em um componente React

```typescript
import { useEffect, useState } from 'react'
import emergencyService from '../services/emergencyService'
import type { EmergencyResponse } from '../types/api'

function EmergenciasPage() {
  const [emergencies, setEmergencies] = useState<EmergencyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEmergencies() {
      try {
        setLoading(true)
        const data = await emergencyService.getAll()
        setEmergencies(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Erro ao carregar emergências')
        }
      } finally {
        setLoading(false)
      }
    }

    loadEmergencies()
  }, [])

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {emergencies.map(emergency => (
        <div key={emergency.id}>
          <h3>{emergency.tipo}</h3>
          <p>{emergency.descricao}</p>
        </div>
      ))}
    </div>
  )
}
```

## Tratamento de Erros

O cliente API trata automaticamente:
- Timeouts de requisição
- Erros HTTP (400, 401, 404, 500, etc.)
- Erros de rede
- Erros de parsing JSON

Todos os erros são lançados como `ApiError`:

```typescript
import type { ApiError } from '../types/api'

try {
  await emergencyService.create(data)
} catch (error: unknown) {
  if (error && typeof error === 'object' && 'status' in error) {
    const apiError = error as ApiError
    console.error(`Erro ${apiError.status}: ${apiError.message}`)
  }
}
```

## Autenticação

O cliente API adiciona automaticamente o token de autenticação se existir no `localStorage`:

```typescript
// Salvar token após login
localStorage.setItem('auth_token', 'seu-token-jwt')

// O cliente adiciona automaticamente: Authorization: Bearer seu-token-jwt
```

## Criando Novos Serviços

1. Crie um novo arquivo em `src/services/` (ex: `userService.ts`)
2. Importe o cliente base: `import api from './api'`
3. Defina os tipos em `src/types/api.ts`
4. Crie métodos específicos:

```typescript
import api from './api'
import type { UserResponse } from '../types/api'

const userService = {
  async getAll() {
    const response = await api.get<UserResponse[]>('/users')
    return response.data || []
  },
  
  async getById(id: number) {
    const response = await api.get<UserResponse>(`/users/${id}`)
    return response.data
  },
  
  // ... outros métodos
}

export default userService
```

## CORS

Se sua API Java estiver em outro domínio/porta, configure CORS no backend:

```java
@CrossOrigin(origins = "http://localhost:5173") // URL do Vite em dev
public class YourController {
    // ...
}
```

Ou configure globalmente no Spring Boot:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*");
            }
        };
    }
}
```

## Próximos Passos

1. Ajuste os tipos em `src/types/api.ts` conforme sua API Java
2. Crie serviços específicos para cada recurso (users, services, etc.)
3. Integre os serviços nos componentes existentes
4. Configure autenticação se necessário
5. Teste a integração com sua API Java


