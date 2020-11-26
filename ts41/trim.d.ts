/**
Removes spaces from the edges of a string.

@example
Trim<' foo '> => 'foo';
*/
export type Trim<V extends string> = TrimLeft<TrimRight<V>>;

/** Internal helper for `Trim`. Removes spaces from the left side. */
type TrimLeft<V extends string> = V extends ` ${infer R}` ? TrimLeft<R> : V;

/** Internal helper for `Trim`. Removes spaces from the right side. */
type TrimRight<V extends string> = V extends `${infer R} ` ? TrimRight<R> : V;
