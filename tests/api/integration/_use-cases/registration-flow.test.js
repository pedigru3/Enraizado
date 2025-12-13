import activation from "models/activation.js"
import orchestrator from "tests/orchestrator.js"
import user from "models/user.js"

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
  await orchestrator.deleteAllEmails()
})

describe("Use case: Registration flow (all successful)", () => {
  let createdUserBody
  let userActivationToken
  let userSession

  test("Create an account", async () => {
    const createdAdminUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "RegistrationFlow",
          email: "registration@flow.com",
          password: "abc123",
        }),
      },
    )
    expect(createdAdminUserResponse.status).toBe(201)
    createdUserBody = await createdAdminUserResponse.json()
  })

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail()
    const tokenMatch = lastEmail.text.match(/cadastro\/ativar\/([a-f0-9]+)/)
    expect(tokenMatch).toBeTruthy()
    userActivationToken = tokenMatch[1]

    const activationTokenObject =
      await activation.findValidToken(userActivationToken)
    expect(activationTokenObject.user_id).toBe(createdUserBody.id)
  })

  test("Failure to create session before activation", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "registration@flow.com",
        password: "abc123",
      }),
    })

    expect(response.status).toBe(403)
  })

  test("Activate account", async () => {
    const activationResponse = await fetch(
      `http://localhost:3000/api/v1/activations/${userActivationToken}`,
      { method: "PATCH" },
    )
    expect(activationResponse.status).toBe(200)
    const activationBody = await activationResponse.json()
    const activatedUser = await user.findOneById(activationBody.user_id)
    expect(activatedUser.features).toEqual([
      "create:session",
      "read:session",
      "update:user",
      "create:points",
      "read:points",
      "read:ranking",
    ])
  })

  test("Login as commum user", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "registration@flow.com",
        password: "abc123",
      }),
    })
    expect(response.status).toBe(201)
    const sessionBody = await response.json()
    userSession = sessionBody
  })

  test("Get user data", async () => {
    const response = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        Cookie: `session_id=${userSession.token}`,
      },
    })

    expect(response.status).toBe(200)
    const userBody = await response.json()

    expect(userBody).toEqual({
      id: createdUserBody.id,
      username: "RegistrationFlow",
      email: "registration@flow.com",
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
      created_at: createdUserBody.created_at,
      updated_at: expect.any(String),
    })
  })
})
