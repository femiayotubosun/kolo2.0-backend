import Cache, { PutManyResult } from '@ioc:Adonis/Addons/Cache'
import cacheConfig from 'Config/cache'
import {
  CACHE_DATA_EXISTS,
  CACHE_DATA_DOES_NOT_EXIST,
  CACHE_DATA_WAS_REMOVED,
  CACHE_DATA_WAS_NOT_REMOVED,
  CACHE_DATA_WAS_NOT_SAVED,
  CACHE_DATA_WAS_SAVED,
  CACHE_WAS_NOT_EMPTIED,
  CACHE_WAS_EMPTIED,
  NULL_OBJECT,
} from 'App/Common/Helpers/Messages/SystemMessages'
import CachePayloadOptionsType from 'App/InfrastructureProviders/Internal/TypeChecking/CachePayloadOptionsType'

class CacheClient {
  /**
   * @description Cache Data Validity in Seconds
   * @author FATE
   * @static
   * @memberof CacheClient
   */
  public static cacheShelfLife = cacheConfig.ttl

  /**
   * @description Check if the data exists in the cache using its key
   * @author FATE
   * @static
   * @param {string} cacheKey The identifier of the cache record
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async checkIfDataExists(cacheKey: string): Promise<string> {
    const dataExists = await Cache.has(cacheKey)

    if (!dataExists) {
      return CACHE_DATA_DOES_NOT_EXIST
    }

    return CACHE_DATA_EXISTS
  }

  /**
   * @description Save a single dataset to the Cache
   * @author FATE
   * @static
   * @param {CachePayloadOptionsType} cachePayload { cacheKey | cacheData | cacheDuration }
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async saveToCache(cachePayload: CachePayloadOptionsType): Promise<string> {
    const { cacheKey, cacheData, cacheDuration = CacheClient.cacheShelfLife } = cachePayload
    const saveOutcome = await Cache.set(cacheKey, cacheData, cacheDuration)

    if (!saveOutcome) {
      return CACHE_DATA_WAS_NOT_SAVED
    }

    return CACHE_DATA_WAS_SAVED
  }

  /**
   * @description Save multiple independent records to the Cache
   * @author FATE
   * @static
   * @param {Record<string, any>} multiCachePayload
   * @returns {*}
   * @memberof CacheClient
   */
  public static async saveMultipleRecordsToCache(
    multiCachePayload: Record<string, any>
  ): Promise<PutManyResult> {
    return Cache.putMany(multiCachePayload, CacheClient.cacheShelfLife)
  }

  /**
   * @description Retrieve a single dataset from the Cache
   * @author FATE
   * @static
   * @param {string} cacheKey The identifier of the cache record
   * @returns {*}
   * @memberof CacheClient
   */
  public static async fetchData(cacheKey: string): Promise<any> {
    const fetchDataOutcome = await Cache.get<string>(cacheKey)

    if (fetchDataOutcome === NULL_OBJECT) {
      return CACHE_DATA_DOES_NOT_EXIST
    }

    return fetchDataOutcome
  }

  /**
   * @description Remove a single dataset from the Cache
   * @author FATE
   * @static
   * @param {string} cacheKey The identifier of the cache record
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async removeSingleRecord(cacheKey: string): Promise<string> {
    const deleteOutcome = await Cache.forget(cacheKey)
    if (!deleteOutcome) {
      return CACHE_DATA_WAS_NOT_REMOVED
    }

    return CACHE_DATA_WAS_REMOVED
  }

  /**
   * @description Fetch multiple records from the Cache
   * @author FATE
   * @static
   * @param {string[]} cacheKeys Array of keys to identify records to be retrieved
   * @returns {*}  {Promise<Record<string, any>>}
   * @memberof CacheClient
   */
  public static async fetchMultipleRecords(cacheKeys: string[]): Promise<Record<string, any>> {
    console.log('cacheKeys => ', cacheKeys)
    return Cache.many(cacheKeys)
  }

  /**
   * @description Cheery-pick the records to remove from the Cache
   * @author FATE
   * @static
   * @param {string[]} cacheKeyPayload Array of Cache Identifiers
   * @returns {*}  {Promise<PutManyResult>}
   * @memberof CacheClient
   */
  public static async removeMultipleRecords(cacheKeyPayload: string[]): Promise<PutManyResult> {
    return Cache.forgetMultiple(cacheKeyPayload)
  }

  /**
   * @description Fetch data if available, retrieve and save to key if unavailable
   * @author FATE
   * @static
   * @param {Record<string, any>} cacheRetrievalOptions { cacheKey - record key | retrievedData - callback function }
   * @returns {*}  {Promise<any>}
   * @memberof CacheClient
   */
  public static async fetchOrSave(cacheRetrievalOptions: Record<string, any>): Promise<any> {
    const { cacheKey, retrievedData } = cacheRetrievalOptions
    return Cache.remember(cacheKey, null, async () => await retrievedData)
  }

  /**
   * @description Empty the Cache
   * @author FATE
   * @static
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async emptyCache(): Promise<string> {
    const emptyCacheOutcome = await Cache.flush()
    if (!emptyCacheOutcome) {
      return CACHE_WAS_NOT_EMPTIED
    }

    return CACHE_WAS_EMPTIED
  }
}

export default CacheClient
