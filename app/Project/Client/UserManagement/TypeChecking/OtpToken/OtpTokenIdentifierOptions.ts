type OtpTokenIdentifierOptions =
  | {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier'
      identifier: string
    }

export default OtpTokenIdentifierOptions
