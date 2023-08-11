import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { ERROR, SUCCESS, WELCOME_TO_API } from 'App/Common/Helpers/Messages/SystemMessages'

Route.get('/', async ({ response }) => {
  const statusCode = HttpStatusCodeEnum.OK

  return response.status(statusCode).send({
    status_code: statusCode,
    status: SUCCESS,
    message: WELCOME_TO_API,
  })
})

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.any('/Unauthenticated', async ({ response }) => {
  const statusCode = HttpStatusCodeEnum.UNAUTHENTICATED

  response.status(statusCode).send({
    status_code: statusCode,
    status: ERROR,
    message: 'Invalid Authentication Credentials',
  })
}).prefix('/Interface')

import './Client/ClientRoutes'
