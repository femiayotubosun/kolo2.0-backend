import Mail from '@ioc:Adonis/Addons/Mail'
import EmailOptionsInterface from 'App/InfrastructureProviders/Internal/TypeChecking/EmailOptionsInterface'
import businessConfig from 'Config/businessConfig'
import {
  FAILURE_MESSAGE_PREFIX,
  FAILURE_REASON_PREFIX,
} from 'App/Common/Helpers/Messages/SystemMessages'

/*
|--------------------------------------------------------------------------
| An internal abstraction on the AdonisJS Mailer Class and functions.
| This provides a reusable Mail Client Interface which can be
| easily ported if system is decomposed
|--------------------------------------------------------------------------
|
*/
class MailClient {
  private static emailSenderName = businessConfig.email.senderName
  private static emailSenderAddress = businessConfig.email.senderAddress

  /**
   * @description Simple Email Sending with an in-memory queue
   * @static
   * @param {EmailOptionsInterface} emailOptions The email options and customizable data
   * @returns {*}  {Promise<void>}
   * @memberof MailClient
   */
  public static async sendMail(emailOptions: EmailOptionsInterface): Promise<void> {
    const {
      senderName = this.emailSenderName,
      senderEmail = this.emailSenderAddress,
      recipientName,
      recipientEmail,
      emailSubject,
      emailTemplate,
      sendLater = true,
      emailPayload,
    } = emailOptions

    if (!sendLater) {
      await Mail.send((message) => {
        message.from(senderEmail, senderName)
        message.to(recipientEmail, recipientName)
        message.subject(emailSubject)
        message.htmlView(emailTemplate, emailPayload)
      })
    } else {
      await Mail.sendLater((delayedMessage) => {
        delayedMessage.from(senderEmail, senderName)
        delayedMessage.to(recipientEmail, recipientName)
        delayedMessage.subject(emailSubject)
        delayedMessage.htmlView(emailTemplate, emailPayload)
      })
    }

    Mail.monitorQueue((error, result) => {
      if (error) {
        console.log(FAILURE_MESSAGE_PREFIX, 'Unable to send Email')
        console.log(FAILURE_REASON_PREFIX, { error })
      }

      console.log('Delivery Status =>', 'Email Sent')
      console.log('SMTP Response => ', result!.response)
    })
  }
}

export default MailClient
