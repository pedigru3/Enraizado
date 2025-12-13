import orchestrator from "tests/orchestrator.js"

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
})

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact same case", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
        email: "mesmo.case@curso.dev",
        password: "abc123",
      })

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
        {
          method: "GET",
        },
      )

      const response2Body = await response2.json()

      expect(response2.status).toBe(401)

      expect(response2Body).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não autenticado.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      })
    })
    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
        email: "diferente.case@curso.dev",
        password: "abc123",
      })

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
        {
          method: "GET",
        },
      )

      expect(response2.status).toBe(401)
      const response2Body = await response2.json()

      expect(response2Body).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não autenticado.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      })
    })

    test("With noneexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
        {
          method: "GET",
        },
      )

      expect(response.status).toBe(401)
      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não autenticado.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      })
    })
  })
})
