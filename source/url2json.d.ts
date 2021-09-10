/**
 * Get keys from target
 */
type GetQueryKeys<String extends string, Keys = ''> = String extends `${infer Key}=${any}`
  ? String extends `${string}&${infer NextString}`
    ? GetQueryKeys<NextString, Keys | Key>
    : Keys | Key
  : Keys

/**
 * If has query string, get it
 */
type GetQueryString<String extends string> = String extends `${string}?${infer QueryString}` ? GetQueryKeys<QueryString> : never

/**
 * Get value according to key
 */
type GetValue<Params, URL extends string> = {
  [Key in keyof Params & string]: URL extends `${any}${'?' | '&'}${Key}=${infer NextString}`
    ? NextString extends `${infer Value}&${any}`
      ? Value
      : NextString
    : Params[Key]
}

/**
 * Generate object based on key
 */
type QueryParams<String extends string> = Record<GetQueryString<String>, unknown>

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
export type Url2Json<String extends string> = Omit<GetValue<QueryParams<String>, String> ,''>
