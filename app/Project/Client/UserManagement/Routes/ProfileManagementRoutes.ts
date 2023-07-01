import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('Process/Fetch/UserProfileDetails', 'FetchUserProfileDetailsController').as(
    'fetch-user-profile-details'
  )
})
  .prefix('/Interface')
  .middleware('auth:api')
  .namespace('App/Project/Client/UserManagement/Controllers/ProfileManagement')
