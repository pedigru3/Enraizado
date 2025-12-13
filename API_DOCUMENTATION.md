# Documentação da API - Enraizado

Esta documentação descreve como usar a API do aplicativo Enraizado, incluindo autenticação, endpoints disponíveis e exemplos de uso.

## Base URL

```
http://localhost:3000/api/v1
```

## Autenticação

A API utiliza autenticação baseada em sessões através de cookies. Todos os endpoints que requerem autenticação precisam do cookie `session_id`.

### Fluxo de Autenticação

1. **Registro**: Criar uma conta de usuário
2. **Ativação**: Confirmar o email através do token de ativação
3. **Login**: Obter uma sessão válida
4. **Usar endpoints**: Enviar o cookie da sessão nas requisições
5. **Logout**: Encerrar a sessão

### 1. Registro de Usuário

**Endpoint:** `POST /users`

Cria uma nova conta de usuário. Após o registro, é necessário ativar a conta através do email.

**Parâmetros do corpo (JSON):**

```json
{
  "username": "seu_username",
  "email": "seu@email.com",
  "password": "sua_senha"
}
```

**Exemplo de requisição:**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_teste",
    "email": "teste@email.com",
    "password": "senha123"
  }'
```

**Resposta de sucesso (201):**

```json
{
  "id": "uuid-do-usuario",
  "username": "usuario_teste",
  "email": "teste@email.com",
  "features": ["read:activation_token"],
  "forests": [],
  "last_insight": null,
  "last_insight_reference": null,
  "last_sync_at": null,
  "points": 0,
  "reading_progress": null,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### 2. Ativação da Conta

**Endpoint:** `PATCH /activations/{token}`

Ativa a conta do usuário usando o token enviado por email.

**Exemplo de requisição:**

```bash
curl -X PATCH http://localhost:3000/api/v1/activations/seu-token-de-ativacao
```

**Resposta de sucesso (200):**

```json
{
  "id": "uuid-do-usuario",
  "username": "usuario_teste",
  "email": "teste@email.com",
  "features": ["create:session"],
  "activated_at": "2025-01-01T00:00:00.000Z"
}
```

### 3. Login (Criar Sessão)

**Endpoint:** `POST /sessions`

Faz login e cria uma nova sessão. O cookie de sessão é automaticamente definido na resposta.

**Parâmetros do corpo (JSON):**

```json
{
  "email": "seu@email.com",
  "password": "sua_senha"
}
```

**Exemplo de requisição:**

```bash
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }' \
  -c cookies.txt
```

**Resposta de sucesso (201):**

```json
{
  "id": "uuid-da-sessao",
  "user_id": "uuid-do-usuario",
  "token": "token-da-sessao",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### 4. Logout (Encerrar Sessão)

**Endpoint:** `DELETE /sessions`

Encerra a sessão atual.

**Exemplo de requisição:**

```bash
curl -X DELETE http://localhost:3000/api/v1/sessions \
  -b cookies.txt
```

**Resposta de sucesso (200):**

```json
{
  "id": "uuid-da-sessao",
  "expires_at": "2025-01-01T00:00:00.000Z"
}
```

## Endpoints da API

### Status da Aplicação

**Endpoint:** `GET /status`

Retorna informações sobre o status da aplicação e suas dependências.

**Exemplo de requisição:**

```bash
curl http://localhost:3000/api/v1/status
```

**Resposta de sucesso (200):**

```json
{
  "updated_at": "2025-01-01T00:00:00.000Z",
  "dependencies": {
    "database": {
      "version": "15.0",
      "max_connections": 100,
      "opened_connections": 1
    }
  }
}
```

### Informações do Usuário Atual

**Endpoint:** `GET /user`

Retorna as informações do usuário autenticado.

**Cabeçalhos obrigatórios:**

- Cookie: `session_id=token_da_sessao`

**Exemplo de requisição:**

```bash
curl http://localhost:3000/api/v1/user \
  -b cookies.txt
```

**Resposta de sucesso (200):**

```json
{
  "id": "uuid-do-usuario",
  "username": "usuario_teste",
  "email": "teste@email.com",
  "points": 150,
  "forests": ["floresta1", "floresta2"],
  "reading_progress": "Capítulo 5",
  "last_insight": "Texto do último insight",
  "last_insight_reference": "Referência do insight",
  "last_sync_at": "2025-01-01T00:00:00.000Z",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### Informações de Outro Usuário

**Endpoint:** `GET /users/{username}`

Retorna as informações públicas de um usuário específico.

**Cabeçalhos obrigatórios:**

- Cookie: `session_id=token_da_sessao`

**Exemplo de requisição:**

```bash
curl http://localhost:3000/api/v1/users/outro_usuario \
  -b cookies.txt
```

### Ranking de Usuários

**Endpoint:** `GET /ranking`

Retorna o ranking de usuários ordenado por pontos.

**Parâmetros de query (opcionais):**

- `limit`: Número máximo de resultados (1-100, padrão: 10)
- `offset`: Número de resultados para pular (≥ 0, padrão: 0)

**Cabeçalhos obrigatórios:**

- Cookie: `session_id=token_da_sessao`

**Exemplo de requisição:**

```bash
curl "http://localhost:3000/api/v1/ranking?limit=5&offset=0" \
  -b cookies.txt
```

**Resposta de sucesso (200):**

```json
{
  "users": [
    {
      "username": "usuario1",
      "points": 200,
      "forests": ["floresta1"],
      "last_insight": "Último insight",
      "last_insight_reference": "Referência"
    },
    {
      "username": "usuario2",
      "points": 150,
      "forests": ["floresta2"],
      "last_insight": "Outro insight",
      "last_insight_reference": "Outra referência"
    }
  ],
  "pagination": {
    "limit": 5,
    "offset": 0,
    "total": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Sincronização de Pontos

**Endpoint:** `POST /sync`

Atualiza os pontos e dados de progresso do usuário.

**Cabeçalhos obrigatórios:**

- Cookie: `session_id=token_da_sessao`
- Content-Type: `application/json`

**Parâmetros do corpo (JSON):**

```json
{
  "points": 150,
  "forests": ["floresta1", "floresta2"],
  "readingProgress": "Capítulo 5",
  "lastInsight": "Texto do insight",
  "lastInsightReference": "Referência do insight",
  "lastSyncAt": "2025-01-01T00:00:00.000Z"
}
```

**Exemplo de requisição:**

```bash
curl -X POST http://localhost:3000/api/v1/sync \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "points": 150,
    "forests": ["floresta1"],
    "readingProgress": "Capítulo 5",
    "lastInsight": "Meu último insight sobre leitura",
    "lastInsightReference": "Página 42",
    "lastSyncAt": "2025-01-01T12:00:00.000Z"
  }'
```

**Resposta de sucesso (200):**

```json
{
  "id": "uuid-do-usuario",
  "username": "usuario_teste",
  "points": 150,
  "forests": ["floresta1"],
  "reading_progress": "Capítulo 5",
  "last_insight": "Meu último insight sobre leitura",
  "last_insight_reference": "Página 42",
  "last_sync_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Configurações de Tema

**Endpoint:** `GET /theme`

Retorna as configurações de tema do usuário.

**Endpoint:** `POST /theme`

Cria ou atualiza as configurações de tema.

**Endpoint:** `DELETE /theme`

Reseta o tema para as configurações padrão.

**Cabeçalhos obrigatórios:**

- Cookie: `session_id=token_da_sessao`
- Content-Type: `application/json` (para POST)

**Exemplo de requisição GET:**

```bash
curl http://localhost:3000/api/v1/theme \
  -b cookies.txt
```

**Exemplo de requisição POST:**

```bash
curl -X POST http://localhost:3000/api/v1/theme \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "colors": {
      "primary": "#FF6B6B",
      "secondary": "#4ECDC4",
      "background": "#FFFFFF"
    }
  }'
```

## Tratamento de Erros

A API retorna erros padronizados com a seguinte estrutura:

```json
{
  "name": "NomeDoErro",
  "message": "Mensagem descritiva do erro",
  "action": "Ação sugerida para resolver o problema",
  "status_code": 400
}
```

### Tipos de Erro Comuns

- **ValidationError (400)**: Dados inválidos ou campos obrigatórios faltando
- **UnauthorizedError (401)**: Credenciais incorretas ou usuário não autenticado
- **ForbiddenError (403)**: Usuário não tem permissão para a operação
- **NotFoundError (404)**: Recurso não encontrado

### Exemplos de Erros

**Usuário não autenticado:**

```json
{
  "name": "UnauthorizedError",
  "message": "Usuário não autenticado.",
  "action": "Faça novamente o login para continuar.",
  "status_code": 401
}
```

**Dados de validação incorretos:**

```json
{
  "name": "ValidationError",
  "message": "Os seguintes campos são obrigatórios: username, email, password",
  "action": "Envie todos os campos obrigatórios na requisição.",
  "status_code": 400
}
```

## Exemplos de Uso Completo

### Fluxo Completo: Registro → Ativação → Login → Uso da API

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste_user",
    "email": "teste@email.com",
    "password": "senha123"
  }'

# 2. Ativar conta (usar token do email)
curl -X PATCH http://localhost:3000/api/v1/activations/SEU_TOKEN_AQUI

# 3. Fazer login
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }' \
  -c cookies.txt

# 4. Ver informações do usuário
curl http://localhost:3000/api/v1/user \
  -b cookies.txt

# 5. Sincronizar pontos
curl -X POST http://localhost:3000/api/v1/sync \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "points": 50,
    "forests": ["floresta1"],
    "readingProgress": "Capítulo 1",
    "lastInsight": "Primeiro insight",
    "lastInsightReference": "Página 1",
    "lastSyncAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'

# 6. Ver ranking
curl http://localhost:3000/api/v1/ranking \
  -b cookies.txt

# 7. Fazer logout
curl -X DELETE http://localhost:3000/api/v1/sessions \
  -b cookies.txt
```

## Considerações de Segurança

- Sempre use HTTPS em produção
- As senhas são hasheadas antes de serem armazenadas
- Os tokens de sessão têm expiração automática
- As requisições são validadas quanto às permissões do usuário
- Dados sensíveis são filtrados na resposta baseado nas permissões

## Suporte

Para dúvidas sobre o uso da API, consulte a documentação do código fonte ou entre em contato com a equipe de desenvolvimento.
