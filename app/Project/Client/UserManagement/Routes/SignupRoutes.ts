import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('Create/Customer', 'CreateNewCustomerController').as('create-new-customer')
})
  .prefix('/Interface')
  .namespace('App/Project/Client/UserManagement/Controllers/Signup')
