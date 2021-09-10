/**
 * Get keys from target
 */
type GetQueryKeys<String extends string, Keys = ''> = String extends `${infer Key}=${any}`
  ? String extends `${string}&${infer NextString}`
    ? GetQueryKeys<NextString, Keys | Key>
    : Keys | Key
  : Keys;

/**
 * If has query string, get it
 */
type GetQueryString<String extends string> = String extends `${string}?${infer QueryString}` ? GetQueryKeys<QueryString> : never;

/**
 * Get value according to key
 */
type GetValue<Parameters_, URL extends string> = {
  [Key in keyof Parameters_ & string]: URL extends `${any}${'?' | '&'}${Key}=${infer NextString}`
    ? NextString extends `${infer Value}&${any}`
      ? Value
      : NextString
    : Parameters_[Key]
};

/**
 * Generate object based on key
 */
type QueryParameters<String extends string> = Record<GetQueryString<String>, unknown>;

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
 * 
 * @category Template Literals
 */
export type Url2Json<String extends string> = Omit<GetValue<QueryParameters<String>, String>, ''>;
