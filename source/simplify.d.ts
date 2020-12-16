/**
Flatten the type output for ease of reference.
*/
export type Simplify<T> = {[KeyType in keyof T]: T[KeyType]};
