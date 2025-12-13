import { createRouter } from "next-connect"
import controller from "infra/controller"
import user from "models/user.js"
import authorization from "@/models/authorization"
import { ValidationError } from "infra/errors.js"

const router = createRouter()

router.use(controller.injectAnnonymousOrUser)
router.post(controller.canRequest("create:points"), postHandler)

export default router.handler(controller.errorHandlers)

async function postHandler(request, response) {
  const userInputValues = request.body

  // Validar se o body foi enviado
  if (!userInputValues) {
    throw new ValidationError({
      message: "O corpo da requisição não pode estar vazio.",
      action: "Envie os dados dos pontos a serem atualizados.",
    })
  }

  const pointsUpdated = await user.updateUserPoints(
    request.context.user.id,
    userInputValues,
  )

  const securePointsUpdated = authorization.filterOutput(
    request.context.user,
    "create:points",
    pointsUpdated,
  )

  response.status(200).json(securePointsUpdated)
}
