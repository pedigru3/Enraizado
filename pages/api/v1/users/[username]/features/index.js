import { createRouter } from "next-connect"
import controller from "infra/controller"
import user from "models/user.js"
import authorization from "models/authorization.js"

const router = createRouter()

router.use(controller.injectAnnonymousOrUser)
router.patch(controller.canRequest("update:user"), patchHandler)

export default router.handler(controller.errorHandlers)

async function patchHandler(request, response) {
  const { username } = request.query
  const { features } = request.body

  const userFound = await user.findOneByUsername(username)
  await user.setFeatures(userFound.id, features)
  const updatedUser = await user.findOneByUsername(username)

  const secureUpdatedUser = authorization.filterOutput(
    request.context.user,
    "update:user",
    updatedUser,
  )

  response.status(200).json(secureUpdatedUser)
}
