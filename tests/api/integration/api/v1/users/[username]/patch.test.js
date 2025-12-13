import orchestrator from "tests/orchestrator.js"
import { version as uuidVersion } from "uuid"
import user from "models/user.js"
import password from "models/password.js"

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
})

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/changeUsername",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "changeUsername2",
          }),
        },
      )

      expect(response2.status).toBe(401)

      const responseBody = await response2.json()

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não autenticado.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      })
    })
  })
  describe("Authenticated user", () => {
    test("With nonexistent username", async () => {
      const authenticatedUser = await orchestrator.createUser({
        username: "authenticatedUser",
      })

      const sessionObject = await orchestrator.createSession(
        authenticatedUser.id,
      )

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/changeUsername",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            username: "changeUsername2",
          }),
        },
      )

      expect(response2.status).toBe(403)

      const responseBody = await response2.json()

      expect(responseBody).toEqual({
        action: 'Verifique se este usuário possui a feature "update:user".',
        message: "Você não possui permissão para executar esta ação.",
        name: "ForbiddenError",
        status_code: 403,
      })
    })

    test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "user1",
      })

      const authenticatedUser2 = await orchestrator.createUser({
        username: "user2",
      })

      await orchestrator.activateUser(authenticatedUser2.id)
      const sessionObject = await orchestrator.createSession(
        authenticatedUser2.id,
      )

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          username: "user1",
        }),
      })

      const responseBody = await response.json()
      console.log(responseBody)

      expect(response.status).toBe(400)

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      })
    })

    test("With duplicated 'email'", async () => {
      await orchestrator.createUser({
        email: "duplicatedEmail1@curso.dev",
      })

      const createdUser2 = await orchestrator.createUser({
        email: "duplicatedEmail2@curso.dev",
      })

      await orchestrator.activateUser(createdUser2.id)
      const sessionObject = await orchestrator.createSession(createdUser2.id)

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            email: "duplicatedEmail1@curso.dev",
          }),
        },
      )

      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      })
    })

    test("With unique 'username'", async () => {
      const createdUser = await orchestrator.createUser()
      await orchestrator.activateUser(createdUser.id)
      const sessionObject = await orchestrator.createSession(createdUser.id)

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            username: "uniqueUser",
          }),
        },
      )

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser",
        email: createdUser.email,
        features: [
          "create:session",
          "read:session",
          "update:user",
          "create:points",
          "read:points",
          "read:ranking",
        ],
        forests: [],
        last_insight: null,
        last_insight_reference: null,
        last_sync_at: null,
        points: 0,
        reading_progress: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()

      expect(responseBody.updated_at > responseBody.created_at).toBe(true)
    })

    test("With unique 'email'", async () => {
      const userCreated = await orchestrator.createUser()
      await orchestrator.activateUser(userCreated.id)
      const sessionObject = await orchestrator.createSession(userCreated.id)

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userCreated.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            email: "uniqueEmail@curso.dev",
          }),
        },
      )

      expect(response.status).toBe(200)
      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: userCreated.username,
        email: "uniqueEmail@curso.dev",
        features: [
          "create:session",
          "read:session",
          "update:user",
          "create:points",
          "read:points",
          "read:ranking",
        ],
        forests: [],
        last_insight: null,
        last_insight_reference: null,
        last_sync_at: null,
        points: 0,
        reading_progress: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()

      expect(responseBody.updated_at > responseBody.created_at).toBe(true)
    })

    test("With new 'password'", async () => {
      const userCreated = await orchestrator.createUser({
        password: "abc1234",
      })

      await orchestrator.activateUser(userCreated.id)
      const sessionObject = await orchestrator.createSession(userCreated.id)

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userCreated.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            password: "newPassword",
          }),
        },
      )

      expect(response.status).toBe(200)
      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: userCreated.username,
        email: userCreated.email,
        features: [
          "create:session",
          "read:session",
          "update:user",
          "create:points",
          "read:points",
          "read:ranking",
        ],
        forests: [],
        last_insight: null,
        last_insight_reference: null,
        last_sync_at: null,
        points: 0,
        reading_progress: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()

      expect(responseBody.updated_at > responseBody.created_at).toBe(true)

      const userInDatabase = await user.findOneByUsername(userCreated.username)
      const correctPasswordMatch = await password.compare(
        "newPassword",
        userInDatabase.password,
      )

      expect(correctPasswordMatch).toBe(true)

      const incorrectPasswordMatch = await password.compare(
        "abc1234",
        userInDatabase.password,
      )

      expect(incorrectPasswordMatch).toBe(false)
    })
  })
})
