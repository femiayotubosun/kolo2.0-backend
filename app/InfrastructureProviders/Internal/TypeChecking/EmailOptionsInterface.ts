interface EmailOptionsInterface {
  senderEmail?: string

  senderName?: string

  recipientEmail: string

  recipientName: string

  emailSubject: string

  emailTemplate: string

  sendLater?: boolean

  emailPayload?: object
}

export default EmailOptionsInterface
