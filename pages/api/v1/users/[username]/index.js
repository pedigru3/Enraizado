import { createRouter } from "next-connect"
import controller from "infra/controller"
const router = createRouter()
import user from "models/user.js"
import authorization from "models/authorization.js"

router.use(controller.injectAnnonymousOrUser)
router.get(controller.canRequest("read:user"), getHandler)
router.patch(controller.canRequest("update:user"), patchHandler)

export default router.handler(controller.errorHandlers)

async function getHandler(request, response) {
  const { username } = await request.query
  const userFound = await user.findOneByUsername(username)

  const secureUserFound = authorization.filterOutput(
    request.context.user,
    "read:user",
    userFound,
  )
  response.status(200).json(secureUserFound)
}

async function patchHandler(request, response) {
  const { username } = await request.query
  const userInputNewValues = request.body
  const updatedUser = await user.update(username, userInputNewValues)

  const secureUpdatedUser = authorization.filterOutput(
    request.context.user,
    "update:user",
    updatedUser,
  )
  response.status(200).json(secureUpdatedUser)
}
