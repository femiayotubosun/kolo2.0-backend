import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------------
|
*/
Route.group(() => {
  Route.post('Process/ChangePassword', 'ChangePasswordController').as('change-password')
})
  .prefix('/Interface')
  .middleware('auth:api')
  .namespace('App/Project/Client/UserManagement/Controllers/PasswordManagement/ChangePassword')

/*
|--------------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------------
|
*/
Route.group(() => {
  Route.post('Process/RequestResetPasswordToken', 'RequestResetPasswordTokenController').as(
    'request-reset-password-token'
  )
  Route.post('Process/ValidateResetPasswordToken', 'ValidateResetPasswordTokenController').as(
    'validate-reset-password-token'
  )
  Route.post('Process/ResetPassword', 'ResetPasswordController')
    .as('reset-password')
    .middleware('auth:api')
})
  .prefix('/Interface')
  .namespace('App/Project/Client/UserManagement/Controllers/PasswordManagement/ResetPassword')
