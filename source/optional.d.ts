/**
Makes a type optional. Allows a type to be `undefined`, but not `null`.

@example
import {Optional} from 'type-fest';

type Value = number;
type OptionalValue = Optional<Value>;
const values: [Value, OptionalValue] = [2, undefined];
*/
export type Optional<Value> = Value extends null ? never : (Value | undefined);
