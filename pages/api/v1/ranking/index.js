import { createRouter } from "next-connect"
import controller from "infra/controller"
import user from "models/user.js"
import authorization from "models/authorization.js"

const router = createRouter()

router.use(controller.injectAnnonymousOrUser)
router.get(controller.canRequest("read:ranking"), getHandler)

export default router.handler(controller.errorHandlers)

async function getHandler(request, response) {
  const { limit = 10, offset = 0, period, year, month } = request.query

  // Se não há parâmetros de período, usar ranking geral
  const usePeriodFilter = period && (period === 'year' || period === 'month')

  const rankingData = usePeriodFilter
    ? await user.findAllByPointsWithPeriod({
        limit: limit,
        offset: offset,
        period,
        year,
        month,
      })
    : await user.findAllByPoints({
        limit: limit,
        offset: offset,
      })

  const secureRanking = authorization.filterOutput(
    request.context.user,
    "read:ranking",
    rankingData,
  )

  response.status(200).json(secureRanking)
}
