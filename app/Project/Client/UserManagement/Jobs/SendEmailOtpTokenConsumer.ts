import type { JobHandlerContract, Job } from '@ioc:Setten/Queue'
import SendEmailOtpTokenConsumerOptions from 'App/Project/Client/UserManagement/TypeChecking/Jobs/SendEmailOtpTokenConsumerOptions'
import EmailOptionsInterface from 'App/InfrastructureProviders/Internal/TypeChecking/EmailOptionsInterface'
import {
  ACCOUNT_ACTIVATION_REQUIRED_SUBJECT,
  EMAIL_OTP_ACCOUNT_ACTIVATION_EMAIL_TEMPLATE,
} from 'App/Common/Helpers/Messages/SystemMessages'
import MailClient from 'App/InfrastructureProviders/Internal/MailClient'

export default class SendEmailOtpTokenConsumer implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  public async handle(sendEmailOtpTokenConsumerOptions: SendEmailOtpTokenConsumerOptions) {
    const { token, email, fullName, firstName } = sendEmailOtpTokenConsumerOptions

    const sendOtpToEmailProviderOptions: EmailOptionsInterface = {
      recipientName: fullName,
      recipientEmail: email,
      emailSubject: ACCOUNT_ACTIVATION_REQUIRED_SUBJECT,
      emailTemplate: EMAIL_OTP_ACCOUNT_ACTIVATION_EMAIL_TEMPLATE,
      emailPayload: {
        token,
        recipientFirstName: firstName,
      },
    }

    await MailClient.sendMail(sendOtpToEmailProviderOptions)
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
