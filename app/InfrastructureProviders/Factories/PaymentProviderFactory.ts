import PaystackPaymentDriver from 'App/InfrastructureProviders/External/PaystackPaymentDriver'
import { SERVICE_PROVIDER_DOES_NOT_EXIST } from 'App/Common/Helpers/Messages/SystemMessages'

export default class PaymentProviderFactory {
  protected currentProvider: string

  constructor(currentProvider: string) {
    this.currentProvider = currentProvider
  }

  /*
  |--------------------------------------------------------------------------
  | Instantiate the Current Provider
  |--------------------------------------------------------------------------
  |
  */
  public build(): PaystackPaymentDriver | string {
    if (this.currentProvider === 'paystack') {
      return new PaystackPaymentDriver()
    }

    return SERVICE_PROVIDER_DOES_NOT_EXIST
  }
}
