import orchestrator from "tests/orchestrator.js"
import user from "models/user.js"

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
})

describe("DELETE /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("Can't delete a user account", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/someUser",
        {
          method: "DELETE",
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

  describe("Authenticated user", () => {
    test("Can't delete another user's account", async () => {
      const user1 = await orchestrator.createUser({
        username: "user1",
      })
      await orchestrator.activateUser(user1.id)

      const user2 = await orchestrator.createUser({
        username: "user2",
      })
      await orchestrator.activateUser(user2.id)

      const sessionObject = await orchestrator.createSession(user1.id)

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user2.username}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(403)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        action: 'Verifique se este usuário possui a feature "update:user".',
        message: "Você não possui permissão para executar esta ação.",
        name: "ForbiddenError",
        status_code: 403,
      })

      // Verificar que o user2 ainda existe
      const user2AfterAttempt = await user.findOneByUsername(user2.username)
      expect(user2AfterAttempt).toBeDefined()
    })

    test("Successfully deleting own account", async () => {
      const createdUser = await orchestrator.createUser()
      await orchestrator.activateUser(createdUser.id)
      const sessionObject = await orchestrator.createSession(createdUser.id)

      // Verificar que o usuário existe antes da exclusão
      const userBeforeDelete = await user.findOneByUsername(
        createdUser.username,
      )
      expect(userBeforeDelete).toBeDefined()

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        success: true,
        message: "Conta excluída com sucesso",
      })
    })

    test("Trying to delete account without proper features", async () => {
      // Criar usuário sem features de delete:user
      const userWithoutFeature = await orchestrator.createUser({
        username: "noDeleteFeature",
      })

      // Ativar com features básicas, sem delete:user
      await orchestrator.activateUser(userWithoutFeature.id)
      await orchestrator.setUserFeatures(userWithoutFeature.id, [
        "read:activation_token",
      ])

      const sessionObject = await orchestrator.createSession(
        userWithoutFeature.id,
      )

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userWithoutFeature.username}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      )

      expect(response.status).toBe(403)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        action: 'Verifique se este usuário possui a feature "update:user".',
        message: "Você não possui permissão para executar esta ação.",
        name: "ForbiddenError",
        status_code: 403,
      })
    })
  })
})
