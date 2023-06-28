type OtpTokenIdentifierOptions =
  | {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier' | 'token'
      identifier: string
    }

export default OtpTokenIdentifierOptions
