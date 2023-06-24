interface RequestPayloadOptionsInterface {
  /**
   * The Request Endpoint
   */
  endpointUrl: string

  /**
   * The Data Packet to be sent
   */
  dataPayload?: object

  /**
   * The Additional Headers Data [Optional]
   */
  headerOptions?: {
    headers: {}
  }
}

export default RequestPayloadOptionsInterface
