type CachePayloadOptionsType = {
  /**
   * The Cache Identifier
   */
  cacheKey: string

  /**
   * The Data to be saved in the Cache
   */
  cacheData: any

  /**
   * The shelf life of the Cached Data, defaults to 1 hour
   */
  cacheDuration?: number
}

export default CachePayloadOptionsType
