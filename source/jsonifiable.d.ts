import type {JsonPrimitive} from './json-value.d.ts';

type JsonifiableObject = {[Key in string]?: Jsonifiable} | {toJSON: () => Jsonifiable};
type JsonifiableArray = readonly Jsonifiable[];

/**
Matches a value that can be losslessly converted to JSON.

Can be used to type values that you expect to pass to `JSON.stringify`.

`undefined` is allowed in object fields (for example, `{a?: number}`) as a special case even though `JSON.stringify({a: undefined})` is `{}` because it makes this class more widely useful and checking for undefined-but-present values is likely an anti-pattern.

@example
```
import type {Jsonifiable} from 'type-fest';

// @ts-expect-error
const error: Jsonifiable = {
    map: new Map([['a', 1]]),
};

JSON.stringify(error);
//=> {"map": {}}

const good: Jsonifiable = {
    number: 3,
    date: new Date(),
    missing: undefined,
}

JSON.stringify(good);
//=> {"number": 3, "date": "2022-10-17T22:22:35.920Z"}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gKQM4QHbABmwAhgEYA2KAvnIVBCHAORKoC0hK2MzA3ACgBAemFwAAjGzsUAD1QBjGDKgMoAhfh5wUq6AC44OfEVKU0AXgwC4tuCBJhDeFAHc4AWUcAKANq-mEmYAGjgARgBdCIBKYIFqQQFMAGUAeQA5ADoeKGA8AHMiRG9dNWjBUQsAPgwAIgcwWsN0amohTTxtfIgIABNDYwJicio4K3QbOzwAVxAyXUMAZji7OF6SGBRnNzgAEQ2Ub1jJ2xBgbGw8-MNpvF6UYhdeuLaktKycq6Lvbr7ykWE1TqMzmuiacGWcFq6024NqACYAAzw+HsMKItEAdgAKij9HjFgBWTIATiRAC1atQgA)

@category JSON
*/
export type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;

export {};
