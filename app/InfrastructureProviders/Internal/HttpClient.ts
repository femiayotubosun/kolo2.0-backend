import axios from 'axios'
import RequestPayloadOptionsInterface from 'App/InfrastructureProviders/Internal/TypeChecking/RequestPayloadOptionsInterface'

/*
|--------------------------------------------------------------------------
| An internal abstraction on the HTTP Client package in use which is
| currently axios. This provides a consistent internal HTTP client interface
| to be used within the Application
|--------------------------------------------------------------------------
|
*/
class HttpClient {
  /**
   * @description The GET method for making authorized/unauthorized requests
   * @static
   * @param {RequestPayloadOptionsInterface} getRequestPayloadOptions
   * @returns {*}  {Promise<{ statusCode: number; apiResponse: any }>}
   * @memberof HttpClient
   */
  public static async get(
    getRequestPayloadOptions: RequestPayloadOptionsInterface
  ): Promise<{ statusCode: number; apiResponse: any }> {
    const { endpointUrl, headerOptions } = getRequestPayloadOptions
    const { status: statusCode, data: apiResponse } = await axios.get(endpointUrl, headerOptions)

    return { statusCode, apiResponse }
  }

  /**
   * @description The POST method for making authorized/unauthorized requests
   * @static
   * @param {RequestPayloadOptionsInterface} postRequestPayloadOptions
   * @returns {*}  {Promise<{ statusCode: number; apiResponse: any }>}
   * @memberof HttpClient
   */
  public static async post(
    postRequestPayloadOptions: RequestPayloadOptionsInterface
  ): Promise<{ statusCode: number; apiResponse: any }> {
    const { endpointUrl, dataPayload, headerOptions } = postRequestPayloadOptions
    const { status: statusCode, data: apiResponse } = await axios.post(
      endpointUrl,
      dataPayload,
      headerOptions
    )

    return { statusCode, apiResponse }
  }

  /**
   * @description The PUT method for making authorized/unauthorized requests
   * @static
   * @param {RequestPayloadOptionsInterface} putRequestPayloadOptions
   * @returns {*}  {Promise<{ statusCode: number; apiResponse: any }>}
   * @memberof HttpClient
   */
  public static async put(
    putRequestPayloadOptions: RequestPayloadOptionsInterface
  ): Promise<{ statusCode: number; apiResponse: any }> {
    const { endpointUrl, dataPayload, headerOptions } = putRequestPayloadOptions
    const { status: statusCode, data: apiResponse } = await axios.put(
      endpointUrl,
      dataPayload,
      headerOptions
    )

    return { statusCode, apiResponse }
  }

  /**
   * @description The PATCH method for making authorized/unauthorized requests
   * @static
   * @param {RequestPayloadOptionsInterface} patchRequestPayloadOptions
   * @returns {*}  {Promise<{ statusCode: number; apiResponse: any }>}
   * @memberof HttpClient
   */
  public static async patch(
    patchRequestPayloadOptions: RequestPayloadOptionsInterface
  ): Promise<{ statusCode: number; apiResponse: any }> {
    const { endpointUrl, dataPayload, headerOptions } = patchRequestPayloadOptions
    const { status: statusCode, data: apiResponse } = await axios.patch(
      endpointUrl,
      dataPayload,
      headerOptions
    )

    return { statusCode, apiResponse }
  }
}

export default HttpClient
