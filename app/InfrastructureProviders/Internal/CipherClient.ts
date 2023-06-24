import Encryption from '@ioc:Adonis/Core/Encryption'
import base64 from 'base-64'
import utf8 from 'utf8'
import businessConfig from 'Config/businessConfig'
import Hash from '@ioc:Adonis/Core/Hash'

/*
|--------------------------------------------------------------------------
| An internal abstraction on the AdonisJS Encryption Class and functions.
| This provides a reusable Encryption Interface which can be
| easily ported if system is decomposed
|--------------------------------------------------------------------------
|
*/

/*
|--------------------------------------------------------------------------------
| Encryption Child using Custom Encryption Key
|--------------------------------------------------------------------------------
|
*/
const Encryptor = Encryption.child({
  secret: businessConfig.customEncryptionKey,
})

class CipherClient {
  /*
  |--------------------------------------------------------------------------------
  | Encrypt the Data
  |--------------------------------------------------------------------------------
  |
  */
  public static encryptData: Function = (plainData: any) => Encryptor.encrypt(plainData)

  /*
  |--------------------------------------------------------------------------------
  | Encrypt the Data with provided custom encryption string
  |--------------------------------------------------------------------------------
  |
  */
  public static encryptDataWithCustomKey: Function = (plainData: any, encryptionKey: string) => {
    const objectEncryptor = Encryption.child({ secret: encryptionKey })
    return objectEncryptor.encrypt(plainData)
  }

  /*
  |--------------------------------------------------------------------------------
  | Decrypt the Encrypted Data
  |--------------------------------------------------------------------------------
  |
  */
  public static decryptData: Function = (encryptedData: any) => Encryptor.decrypt(encryptedData)

  /*
  |--------------------------------------------------------------------------------
  | Encode the Data as Base64
  |--------------------------------------------------------------------------------
  |
  */
  public static encodeBase64: Function = (plainData: any): string => {
    const encodedBytes = utf8.encode(plainData)
    return base64.encode(encodedBytes)
  }

  /*
  |--------------------------------------------------------------------------------
  | Decode the Data back to its Plain form
  |--------------------------------------------------------------------------------
  |
  */
  public static decodeBase64: Function = (encodedData: any): string => {
    const decodedBytes = base64.decode(encodedData)
    return utf8.decode(decodedBytes)
  }

  /*
  |--------------------------------------------------------------------------------
  | Generate a Hash Key
  |--------------------------------------------------------------------------------
  |
  */
  public static async generateHashKey(plainData: string): Promise<string> {
    return await Hash.make(plainData)
  }

  /*
  |--------------------------------------------------------------------------------
  | Verify if the provider data is the same as the Hashed version
  |--------------------------------------------------------------------------------
  |
  */
  public static async verifyHashKey(encryptedData: any, plainData: string): Promise<boolean> {
    return await Hash.verify(encryptedData, plainData)
  }
}

export default CipherClient
