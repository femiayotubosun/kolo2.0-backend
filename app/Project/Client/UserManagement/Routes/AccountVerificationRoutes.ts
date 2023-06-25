import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('Process/EmailVerification', 'VerifyEmailController').as('verify-email')
  Route.get('Process/RequestEmailVerificationToken', 'RequestEmailVerificationTokenController').as(
    'request-email-verification-token'
  )
})
  .prefix('/Interface')
  .middleware('auth:api')
  .namespace('App/Project/Client/UserManagement/Controllers/AccountVerification')
