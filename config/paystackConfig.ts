import Env from '@ioc:Adonis/Core/Env'

const paystackConfig = {
  identifier: 'paystack',

  secretKey: Env.get('PAYSTACK_SECRET_KEY'),

  initializeTransactionEndpoint: 'https://api.paystack.co/transaction/initialize/',

  verifyTransactionEndpoint: 'https://api.paystack.co/transaction/verify/',

  chargeAuthorizationEndpoint: '',
}

export default paystackConfig
