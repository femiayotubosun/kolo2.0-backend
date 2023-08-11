type UserProfileIdentifierOptions =
  | {
      identifierType: 'id' | 'userId'
      identifier: number
    }
  | {
      identifierType: 'identifier' | 'customerCode' | 'referralCode' | 'username'
      identifier: string
    }

export default UserProfileIdentifierOptions
