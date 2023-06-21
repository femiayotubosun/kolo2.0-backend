import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import {
  ERROR,
  SUCCESS,
  UNAUTHORIZED_OPERATION,
  WELCOME_TO_API,
} from 'App/Common/Helpers/Messages/SystemMessages'

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

Route.any('/Unauthorized', async ({ response }) => {
  const statusCode = HttpStatusCodeEnum.UNAUTHORIZED

  response.status(statusCode).send({
    status_code: statusCode,
    status: ERROR,
    message: UNAUTHORIZED_OPERATION,
  })
}).prefix('/Interface')

import './Client/ClientRoutes'
