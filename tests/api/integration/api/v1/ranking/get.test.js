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

  // Atualizar pontos dos usuários
  const user100 = await user.findOneByUsername("user_100_points")

  await orchestrator.activateUser(user100.id)
  sessionObject = await orchestrator.createSession(user100.id)

  const user50 = await user.findOneByUsername("user_50_points")
  const user200 = await user.findOneByUsername("user_200_points")

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
          total: 3,
          hasNext: false,
          hasPrev: false,
        },
      })

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
        total: 3,
        hasNext: false,
        hasPrev: true,
      })

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
  })
})
