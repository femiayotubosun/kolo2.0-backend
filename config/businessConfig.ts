import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'

const businessConfig = {
  otpToken: {
    expirationTimeFrame: Env.get('OTP_TOKEN_EXPIRES_IN_X_MINUTES'),

    tokenLength: Env.get('OTP_TOKEN_LENGTH'),
  },

  userProfile: {
    customerCodePrefix: Env.get('CUSTOMER_CODE_PREFIX'),

    customerCodeLength: Env.get('CUSTOMER_CODE_LENGTH'),

    referralCodeLength: Env.get('REFERRAL_CODE_LENGTH'),
  },

  currentDateTime: () => DateTime.now(),
}

export default businessConfig
