import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('Create/Customer', 'CreateNewCustomerController').as('create-new-customer')
  Route.post('Process/CheckUsernameAvailability', 'CheckUsernameAvailabilityController').as(
    'check-username-availability'
  )
})
  .prefix('/Interface')
  .namespace('App/Project/Client/UserManagement/Controllers/Signup')
