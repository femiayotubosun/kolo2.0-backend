type UserRegistrationStepIdentifierOptions =
  | {
      identifierType: 'id' | 'userId'
      identifier: number
    }
  | {
      identifierType: 'identifier'
      identifier: string
    }

export default UserRegistrationStepIdentifierOptions
