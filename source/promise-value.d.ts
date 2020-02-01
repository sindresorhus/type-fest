/**
Returns the type that is wrapped inside a `Promise` type.
If the type is not a `Promise`, the type itself is returned.

@example
import {PromiseValue} from './promise-value';
import {asyncFunction} from 'api';

let data: PromiseValue<ReturnType<typeof asyncFunction>>;

async function setValue(): void {
  data = await asyncFunction();
}

setValue();

// Here's an example of using this with non-Promise types.
function getNumber(): number {
 return 2;
}

const number: PromiseValue<ReturnType<typeof getNumber>> = getNumber();
 */
export type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value> ? Value : Otherwise;
