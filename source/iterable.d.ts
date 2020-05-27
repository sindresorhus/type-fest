/**
 * Get the element type of an AsyncIterable
 */
export type AsyncIterableElement<I> = I extends AsyncIterable<infer T> ? T : never

/**
 * Get the element type of an Iterable
 */
export type IterableElement<I> = I extends Iterable<infer T> ? T : never
