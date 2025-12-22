import orchestrator from "tests/orchestrator.js"
import user from "models/user.js"

let sessionObject

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()

  // Criar usuários de teste com diferentes quantidades de pontos
  await user.create({
    username: "user_100_points",
    email: "user100@test.com",
    password: "test123",
  })

  await user.create({
    username: "user_50_points",
    email: "user50@test.com",
    password: "test123",
  })

  await user.create({
    username: "user_200_points",
    email: "user200@test.com",
    password: "test123",
  })

  await user.create({
    username: "user_0_points",
    email: "user0@test.com",
    password: "test123",
  })

  // Criar usuários de teste para filtros por período
  await user.create({
    username: "user_jan_2025",
    email: "userjan2025@test.com",
    password: "test123",
  })

  await user.create({
    username: "user_feb_2025",
    email: "userfeb2025@test.com",
    password: "test123",
  })

  await user.create({
    username: "user_2024_2025",
    email: "user20242025@test.com",
    password: "test123",
  })

  // Atualizar pontos dos usuários
  const user100 = await user.findOneByUsername("user_100_points")

  await orchestrator.activateUser(user100.id)
  sessionObject = await orchestrator.createSession(user100.id)

  const user50 = await user.findOneByUsername("user_50_points")
  const user200 = await user.findOneByUsername("user_200_points")
  const userJan2025 = await user.findOneByUsername("user_jan_2025")
  const userFeb2025 = await user.findOneByUsername("user_feb_2025")
  const user20242025 = await user.findOneByUsername("user_2024_2025")

  await user.updateUserPoints(user100.id, {
    points: 100,
    forests: [],
    readingProgress: null,
    lastInsight: null,
    lastInsightReference: null,
    lastSyncAt: new Date().toISOString(),
  })

  await user.updateUserPoints(user50.id, {
    points: 50,
    forests: [],
    readingProgress: null,
    lastInsight: null,
    lastInsightReference: null,
    lastSyncAt: new Date().toISOString(),
  })

  await user.updateUserPoints(user200.id, {
    points: 200,
    forests: [],
    readingProgress: null,
    lastInsight: null,
    lastInsightReference: null,
    lastSyncAt: new Date().toISOString(),
  })

  // Usuário com 2 plantas em janeiro de 2025 (30 pontos)
  await user.updateUserPoints(userJan2025.id, {
    points: 30,
    forests: [
      {
        id: "solo_1",
        createdAt: "2025-01-01T10:00:00.000Z",
        plants: [
          {
            label: "Planta 1",
            createdAt: "2025-01-15T10:15:00.000Z",
            row: 0,
            col: 0,
          },
          {
            label: "Planta 2",
            createdAt: "2025-01-22T14:30:00.000Z",
            row: 0,
            col: 1,
          },
        ],
      },
    ],
    readingProgress: null,
    lastInsight: null,
    lastInsightReference: null,
    lastSyncAt: new Date().toISOString(),
  })

  // Usuário com 1 planta em fevereiro de 2025 (15 pontos)
  await user.updateUserPoints(userFeb2025.id, {
    points: 15,
    forests: [
      {
        id: "solo_1",
        createdAt: "2025-02-01T10:00:00.000Z",
        plants: [
          {
            label: "Planta 1",
            createdAt: "2025-02-10T09:45:00.000Z",
            row: 0,
            col: 0,
          },
        ],
      },
    ],
    readingProgress: null,
    lastInsight: null,
    lastInsightReference: null,
    lastSyncAt: new Date().toISOString(),
  })

  // Usuário com plantas em 2024 e 2025 (45 pontos)
  await user.updateUserPoints(user20242025.id, {
    points: 45,
    forests: [
      {
        id: "solo_1",
        createdAt: "2024-12-01T10:00:00.000Z",
        plants: [
          {
            label: "Planta 2024",
            createdAt: "2024-12-15T10:15:00.000Z",
            row: 0,
            col: 0,
          },
          {
            label: "Planta 2025",
            createdAt: "2025-01-10T14:30:00.000Z",
            row: 0,
            col: 1,
          },
          {
            label: "Planta 2025-2",
            createdAt: "2025-03-05T09:45:00.000Z",
            row: 1,
            col: 0,
          },
        ],
      },
    ],
    readingProgress: null,
    lastInsight: null,
    lastInsightReference: null,
    lastSyncAt: new Date().toISOString(),
  })
})

describe("GET /api/v1/ranking", () => {
  describe("Anonymous user", () => {
    test("Should return 401 when user is not authenticated", async () => {
      const response = await fetch("http://localhost:3000/api/v1/ranking")
      const responseBody = await response.json()

      expect(response.status).toBe(401)
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não autenticado.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      })
    })
  })

  describe("Authenticated user", () => {
    test("Should return ranking ordered by points", async () => {
      const response = await fetch("http://localhost:3000/api/v1/ranking", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      })

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            username: "user_200_points",
            points: 200,
          }),
          expect.objectContaining({
            username: "user_100_points",
            points: 100,
          }),
          expect.objectContaining({
            username: "user_50_points",
            points: 50,
          }),
        ]),
        pagination: {
          limit: 10,
          offset: 0,
          total: expect.any(Number), // Total pode variar dependendo dos usuários com pontos > 0
          hasNext: false,
          hasPrev: false,
        },
      })

      // Verificar que o total é pelo menos 3 (os usuários básicos)
      expect(responseBody.pagination.total).toBeGreaterThanOrEqual(3)

      expect(responseBody.users[0]).toEqual({
        id: expect.any(String),
        username: "user_200_points",
        points: 200,
        forests: [],
        reading_progress: null,
        last_insight: null,
        last_insight_reference: null,
        last_sync_at: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })

      // Verificar que email não está presente
      expect(responseBody.users[0]).not.toHaveProperty("email")

      // Verificar se está ordenado por pontos (maior para menor)
      expect(responseBody.users[0].points).toBeGreaterThanOrEqual(
        responseBody.users[1].points,
      )
      expect(responseBody.users[1].points).toBeGreaterThanOrEqual(
        responseBody.users[2].points,
      )
    })

    test("Should support pagination with limit and offset", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?limit=2&offset=1",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody.users).toHaveLength(2)
      expect(responseBody.pagination).toEqual({
        limit: 2,
        offset: 1,
        total: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrev: true,
      })

      // Verificar que o total é pelo menos 3
      expect(responseBody.pagination.total).toBeGreaterThanOrEqual(3)

      // O segundo usuário na lista completa deve ser o primeiro nesta página
      expect(responseBody.users[0].username).toBe("user_100_points")
      expect(responseBody.users[0].points).toBe(100)
    })

    test("Should validate limit parameter", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?limit=150",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O limite deve ser um número entre 1 e 100.",
        action: "Envie um valor válido para o parâmetro 'limit'.",
        status_code: 400,
      })
    })

    test("Should validate offset parameter", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?offset=-1",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O offset deve ser um número maior ou igual a 0.",
        action: "Envie um valor válido para o parâmetro 'offset'.",
        status_code: 400,
      })
    })

    test("Should filter ranking by year", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=year&year=2025",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      // Deve retornar apenas usuários com plantas em 2025
      expect(responseBody.users).toHaveLength(3)
      expect(responseBody.filters).toEqual({
        period: "year",
        year: 2025,
        month: null,
      })

      // user_jan_2025 deve ter 30 pontos (2 plantas)
      const userJan = responseBody.users.find(
        (u) => u.username === "user_jan_2025",
      )
      expect(userJan.points).toBe(30)

      // user_feb_2025 deve ter 15 pontos (1 planta)
      const userFeb = responseBody.users.find(
        (u) => u.username === "user_feb_2025",
      )
      expect(userFeb.points).toBe(15)

      // user_2024_2025 deve ter 30 pontos (2 plantas em 2025)
      const user20242025 = responseBody.users.find(
        (u) => u.username === "user_2024_2025",
      )
      expect(user20242025.points).toBe(30)

      // Ordenação por pontos deve estar correta
      expect(responseBody.users[0].points).toBeGreaterThanOrEqual(
        responseBody.users[1].points,
      )
    })

    test("Should filter ranking by month and year", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=month&year=2025&month=1",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      // Deve retornar apenas usuários com plantas em janeiro de 2025
      console.log(responseBody)
      expect(responseBody.users).toHaveLength(2)
      expect(responseBody.filters).toEqual({
        period: "month",
        year: 2025,
        month: 1,
      })

      // user_jan_2025 deve ter 30 pontos (2 plantas em janeiro)
      const userJan = responseBody.users.find(
        (u) => u.username === "user_jan_2025",
      )
      expect(userJan.points).toBe(30)

      // user_2024_2025 deve ter 15 pontos (1 planta em janeiro)
      const user20242025 = responseBody.users.find(
        (u) => u.username === "user_2024_2025",
      )
      expect(user20242025.points).toBe(15)
    })

    test("Should return empty ranking for period with no data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=month&year=2023&month=1",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody.users).toHaveLength(0)
      expect(responseBody.pagination.total).toBe(0)
      expect(responseBody.filters).toEqual({
        period: "month",
        year: 2023,
        month: 1,
      })
    })

    test("Should validate year parameter for year period", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=year",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O ano deve ser um número válido quando período é 'year'.",
        action: "Envie um valor válido para o parâmetro 'year'.",
        status_code: 400,
      })
    })

    test("Should validate year and month parameters for month period", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=month&year=2025",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "O mês deve ser um número entre 1 e 12 quando período é 'month'.",
        action: "Envie um valor válido para o parâmetro 'month'.",
        status_code: 400,
      })
    })

    test("Should validate month range", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=month&year=2025&month=13",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "O mês deve ser um número entre 1 e 12 quando período é 'month'.",
        action: "Envie um valor válido para o parâmetro 'month'.",
        status_code: 400,
      })
    })

    test("Should support pagination with period filters", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/ranking?period=year&year=2025&limit=2&offset=1",
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody.users).toHaveLength(2)
      expect(responseBody.pagination).toEqual({
        limit: 2,
        offset: 1,
        total: 3,
        hasNext: false,
        hasPrev: true,
      })
      expect(responseBody.filters).toEqual({
        period: "year",
        year: 2025,
        month: null,
      })
    })
  })
})
