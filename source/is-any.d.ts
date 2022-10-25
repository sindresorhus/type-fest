/**
Returns a boolean indicating if `T` is any.

This type is usefull when used inside other types.
 */
export type IsAny<Cond> = 0 extends 1 & Cond ? true : false;
