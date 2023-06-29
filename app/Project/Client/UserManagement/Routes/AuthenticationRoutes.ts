import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post(
    'Process/AuthenticateUserWithPassword',
    'PasswordAuthentication/AuthenticateUserWithPasswordController'
  ).as('authenticate-user-with-password')

  Route.post(
    'Process/RequestSingleUseToken',
    'SingleUseOtpAuthentication/RequestSingleUseAuthenticationTokenController'
  )

  Route.post(
    'Process/AuthenticationWithSingleUseToken',
    'SingleUseOtpAuthentication/AuthenticateUserWithSingleUseTokenController'
  )
})
  .prefix('/Interface')
  .namespace('App/Project/Client/UserManagement/Controllers/Authentication')
