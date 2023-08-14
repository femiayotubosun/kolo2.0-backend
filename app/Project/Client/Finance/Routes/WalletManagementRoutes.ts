import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('Fetch/UserWalletDetails', 'FetchWalletDetailsController').as(
    'fetch-user-wallet-details'
  )
  Route.patch('Update/UserWallet/Pin', 'UpdateWalletPinController').as('update-wallet-pin-details')
})
  .prefix('/Interface')
  .middleware('auth:api')
  .namespace('App/Project/Client/Finance/Controllers/WalletManagement')
