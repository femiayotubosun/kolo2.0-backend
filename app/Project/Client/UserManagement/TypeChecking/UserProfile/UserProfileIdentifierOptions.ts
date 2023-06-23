type UserProfileIdentifierOptions =
  | {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier' | 'customerCode' | 'referralCode' | 'username'
      identifier: string
    }

export default UserProfileIdentifierOptions
