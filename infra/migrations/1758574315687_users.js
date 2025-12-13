exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    //Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Points system to sync with app in sharedPreferences
    points: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    forests: {
      type: "jsonb", // Array de florestas em JSON
      default: "[]", // Array vazio por padrão
    },
    reading_progress: {
      type: "text", // Progresso de leitura bíblica
    },
    last_insight: {
      type: "text", // Último insight do Gemini
    },
    last_insight_reference: {
      type: "varchar(100)", // Referência bíblica
    },
    last_sync_at: {
      type: "timestamptz", // Quando foi a última sync
    },

    //why timestamp with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz
    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  })
}

exports.down = false
