type UserCardIdentifierOptions =
| {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier'
      identifier: string
    }

export default UserCardIdentifierOptions
