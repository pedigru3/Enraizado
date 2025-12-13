const availableFeatures = new Set([
  // USER
  "create:user",
  "read:user",
  "read:user:self",
  "update:user",

  // MIGRATION
  "read:migration",
  "create:migration",

  // ACTIVATION_TOKEN
  "read:activation_token",

  // RECOVERY_TOKEN
  "read:recovery_token",

  // EMAIL_CONFIRMATION_TOKEN
  "read:email_confirmation_token",

  // SESSION
  "create:session",
  "read:session",

  // CONTENT
  "read:content",
  "update:content",
  "create:content",
  "delete:content",

  // BANNED
  "nuked",

  // POINTS
  "create:points",
  "read:points",
  "read:ranking",

  // ADVERTISEMENT
  "read:ad:list",
])

export default Object.freeze(availableFeatures)
