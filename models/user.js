import database from "infra/database"
import { ValidationError, NotFoundError } from "infra/errors.js"
import password from "models/password.js"
import { validateUsername } from "infra/validator.js"

async function create(userInputValues) {
  validateUsername(userInputValues.username)
  await validateUniqueEmail(userInputValues.email)
  await validateUniqueUsername(userInputValues.username)
  await hashPasswordInObject(userInputValues)
  injectDefaultFeatureInObject(userInputValues)

  const newUser = await runInsertQuery(userInputValues)
  return newUser

  async function hashPasswordInObject(userInputValues) {
    const hashedPassword = await password.hash(userInputValues.password)
    userInputValues.password = hashedPassword
  }

  async function runInsertQuery(userInputValues) {
    const { username, email, password, features } = userInputValues

    const results = await database.query({
      text: `
    INSERT INTO 
        users (username, email, password, features)
    VALUES 
        ($1, $2, $3, $4)
    RETURNING
        *
    ;`,
      values: [username, email, password, features],
    })

    return results.rows[0]
  }

  async function injectDefaultFeatureInObject(userInputValues) {
    userInputValues.features = ["read:activation_token"]
  }
}

async function findOneById(userId) {
  const userFound = await runSelectQuery(userId)
  return userFound

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users
      WHERE 
        id = $1
      LIMIT
        1
      ;`,

      values: [userId],
    })

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O ID informado não foi encontrado no sistema.",
        action: "Verifique se o ID está digitado corretamente.",
      })
    }

    return results.rows[0]
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username)
  return userFound

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users
      WHERE 
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,

      values: [username],
    })

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      })
    }

    return results.rows[0]
  }
}

async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email)
  return userFound

  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users
      WHERE 
        LOWER(email) = LOWER($1)
      LIMIT
        1
      ;`,

      values: [email],
    })

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O Email informado não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
      })
    }

    return results.rows[0]
  }
}

async function update(username, userInputNewValues) {
  const currentUser = await findOneByUsername(username)

  if ("email" in userInputNewValues) {
    await validateUniqueEmail(userInputNewValues.email)
  }

  if ("username" in userInputNewValues) {
    const isUsernameUnchanged =
      username.toLowerCase() === userInputNewValues.username.toLowerCase()

    if (!isUsernameUnchanged) {
      validateUsername(userInputNewValues.username)
      await validateUniqueUsername(userInputNewValues.username)
    }
  }

  if ("password" in userInputNewValues) {
    await hashPasswordInObject(userInputNewValues)
  }

  const userWithNewValues = { ...currentUser, ...userInputNewValues }

  const updatedUser = await runUpdateQuery(userWithNewValues)
  return updatedUser

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
     UPDATE
      users
    SET 
    username = $2,
    email = $3,
    password = $4,
    updated_at = timezone('utc', now())
     WHERE
      id = $1
    RETURNING
      *
      `,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    })

    return results.rows[0]
  }
}

async function setFeatures(userId, features) {
  await database.query({
    text: `
    UPDATE
      users
    SET
      features = $2
    WHERE
      id = $1
    ;`,
    values: [userId, features],
  })
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
    SELECT 
      email
    FROM
      users
    WHERE
      LOWER(email) = LOWER($1)
    ;`,
    values: [email],
  })

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    })
  }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
    SELECT 
      username
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
    ;`,
    values: [username],
  })

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar esta operação.",
    })
  }
}

async function updateUserPoints(userId, inputValues) {
  // Validar se inputValues é um objeto válido
  if (!inputValues || typeof inputValues !== "object") {
    throw new ValidationError({
      message: "Os dados de entrada devem ser um objeto válido.",
      action: "Envie os dados dos pontos a serem atualizados.",
    })
  }

  // Validar campos obrigatórios
  const requiredFields = [
    "points",
    "forests",
    "readingProgress",
    "lastInsight",
    "lastInsightReference",
    "lastSyncAt",
  ]

  const missingFields = requiredFields.filter(
    (field) => !(field in inputValues),
  )

  if (missingFields.length > 0) {
    throw new ValidationError({
      message: `Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`,
      action: "Envie todos os campos obrigatórios na requisição.",
    })
  }

  // Buscar o usuário para garantir que existe
  await findOneById(userId)

  // Preparar os valores para atualização
  const updateFields = []
  const values = [userId]
  let paramIndex = 2

  // Adicionar campos condicionalmente baseado no que foi enviado
  if (inputValues.points !== undefined) {
    updateFields.push(`points = $${paramIndex}`)
    values.push(inputValues.points)
    paramIndex++
  }

  if (inputValues.forests !== undefined) {
    updateFields.push(`forests = $${paramIndex}`)
    values.push(JSON.stringify(inputValues.forests))
    paramIndex++
  }

  if (inputValues.readingProgress !== undefined) {
    updateFields.push(`reading_progress = $${paramIndex}`)
    values.push(inputValues.readingProgress)
    paramIndex++
  }

  if (inputValues.lastInsight !== undefined) {
    updateFields.push(`last_insight = $${paramIndex}`)
    values.push(inputValues.lastInsight)
    paramIndex++
  }

  if (inputValues.lastInsightReference !== undefined) {
    updateFields.push(`last_insight_reference = $${paramIndex}`)
    values.push(inputValues.lastInsightReference)
    paramIndex++
  }

  if (inputValues.lastSyncAt !== undefined) {
    updateFields.push(`last_sync_at = $${paramIndex}`)
    values.push(inputValues.lastSyncAt)
    paramIndex++
  }

  // Sempre atualizar updated_at
  updateFields.push(`updated_at = timezone('utc', now())`)

  // Executar a query de atualização
  const results = await database.query({
    text: `
    UPDATE
      users
    SET
      ${updateFields.join(", ")}
    WHERE
      id = $1
    RETURNING
      *
    ;`,
    values,
  })

  return results.rows[0]
}

async function hashPasswordInObject(userInputNewValues) {
  const passwordHashed = await password.hash(userInputNewValues.password)
  userInputNewValues.password = passwordHashed
}

async function findAllByPoints({ limit = 10, offset = 0 } = {}) {
  // Validar parâmetros de paginação
  const parsedLimit = parseInt(limit, 10)
  const parsedOffset = parseInt(offset, 10)

  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new ValidationError({
      message: "O limite deve ser um número entre 1 e 100.",
      action: "Envie um valor válido para o parâmetro 'limit'.",
    })
  }

  if (isNaN(parsedOffset) || parsedOffset < 0) {
    throw new ValidationError({
      message: "O offset deve ser um número maior ou igual a 0.",
      action: "Envie um valor válido para o parâmetro 'offset'.",
    })
  }

  const results = await database.query({
    text: `
      SELECT
        id,
        username,
        email,
        points,
        forests,
        reading_progress,
        last_insight,
        last_insight_reference,
        last_sync_at,
        created_at,
        updated_at
      FROM
        users
      ORDER BY
        points DESC,
        created_at ASC
      LIMIT $1
      OFFSET $2
    ;`,
    values: [parsedLimit, parsedOffset],
  })

  // Contar total de usuários para paginação
  const countResults = await database.query({
    text: `
      SELECT
        COUNT(*) as total
      FROM
        users
      WHERE
        points > 0
    ;`,
  })

  const totalUsers = parseInt(countResults.rows[0].total, 10)

  return {
    users: results.rows,
    pagination: {
      limit: parsedLimit,
      offset: parsedOffset,
      total: totalUsers,
      hasNext: parsedOffset + parsedLimit < totalUsers,
      hasPrev: parsedOffset > 0,
    },
  }
}

const user = {
  create,
  findOneById,
  findOneByUsername,
  findOneByEmail,
  update,
  setFeatures,
  updateUserPoints,
  findAllByPoints,
}

export default user
