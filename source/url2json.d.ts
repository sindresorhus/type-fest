/**
 * Get keys from target
 */
type GetQueryKeys<S extends string, D = ''> = S extends `${infer T}=${any}`
  ? S extends `${string}&${infer P}`
    ? GetQueryKeys<P, D | T>
    : D | T
  : D

/**
 * If has query string, get it
 */
type GetQueryString<S extends string> = S extends `${string}?${infer R}` ? GetQueryKeys<R> : never

/**
 * Get value according to key
 */
type GetValue<Params, URL extends string> = {
  [P in keyof Params & string]: URL extends `${any}${'?' | '&'}${P}=${infer R}`
    ? R extends `${infer K}&${any}`
      ? K
      : R
    : Params[P]
}

/**
 * Generate object based on key
 */
type QueryParams<S extends string> = Record<GetQueryString<S>, unknown>

/**
 * @example
 * ```
 *   declare const url = 'https://google.com?a=1&b=2'
 *   type UrlQuery = Url2Json<typeof url>
 * ```
 *   it will be
 *      {
 *        "a": 1,
 *        "b": 2
 *      }
 */
export type Url2Json<S extends string> = Omit<GetValue<QueryParams<S>, S> ,''>
