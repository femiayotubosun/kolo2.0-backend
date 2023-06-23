type UserIdentifierOptions =
  | {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier' | 'email'
      identifier: string
    }

export default UserIdentifierOptions
