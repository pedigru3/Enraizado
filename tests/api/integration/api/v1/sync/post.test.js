import orchestrator from "tests/orchestrator.js"

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
})

afterAll(async () => {
  await orchestrator.clearDatabase()
})

describe("POST /api/v1/sync", () => {
  describe("Default user", () => {
    test("Can not creat if body is empty", async () => {
      const createdUser = await orchestrator.createUser()
      await orchestrator.activateUser(createdUser.id)
      const sessionObject = await orchestrator.createSession(createdUser.id)

      const response = await fetch("http://localhost:3000/api/v1/sync", {
        method: "POST",
        headers: { Cookie: `session_id=${sessionObject.token}` },
      })

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O corpo da requisição não pode estar vazio.",
        action: "Envie os dados dos pontos a serem atualizados.",
        status_code: 400,
      })
    })

    test("Cant create if required fields are missing", async () => {
      const createdUser = await orchestrator.createUser()
      await orchestrator.activateUser(createdUser.id)
      const sessionObject = await orchestrator.createSession(createdUser.id)

      const response = await fetch("http://localhost:3000/api/v1/sync", {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: 10,
        }),
      })

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Os seguintes campos são obrigatórios: forests, readingProgress, lastInsight, lastInsightReference, lastSyncAt",
        action: "Envie todos os campos obrigatórios na requisição.",
        status_code: 400,
      })
    })

    test("Can create points or update", async () => {
      const createdUser = await orchestrator.createUser()
      await orchestrator.activateUser(createdUser.id)
      const sessionObject = await orchestrator.createSession(createdUser.id)

      const response = await fetch("http://localhost:3000/api/v1/sync", {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: 10,
          forests: [],
          readingProgress: "test",
          lastInsight: "test",
          lastInsightReference: "test",
          lastSyncAt: new Date().toISOString(),
        }),
      })

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        sucess: true,
        message: "Points created or updated successfully",
      })
    })
  })
})
