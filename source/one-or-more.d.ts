/* eslint-disable @typescript-eslint/array-type */
/**
Either matches an array containing only `Value`, or `Value` itself, not in an array.

@example
import {OneOrMore} from 'type-fest';

type ID = number;
type OneOrMoreIDs = OneOrMore<ID>;

const multipleIDs: OneOrMoreIDs = [1234, 2468];
const oneID: OneOrMoreIDs = 1234;
*/
export type OneOrMore<Value> = Value | ReadonlyArray<Value>;
/* eslint-enable @typescript-eslint/array-type */
