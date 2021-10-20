/**
 * Creates a ReadonlyArray<Element> of length Length (aka a tuple)
 * @private
 * @see FixedLengthArray which is safer because it tests if `Length` is a specific finite number
 */
type BuildTupleHelper<Element, Length extends number, Rest extends Element[]> =
	Rest['length'] extends Length ?
		readonly [...Rest] : // Terminate with readonly array (aka tuple)
		BuildTupleHelper<Element, Length, [Element, ...Rest]>;

/**
Create a type that represents an array of the given type and length.

Please participate in [this issue](https://github.com/microsoft/TypeScript/issues/26223) if you want to have a similiar type built into TypeScript.

Use-cases:
- Declaring fixed-length tuples or arrays with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating an array of coordinates with a static length, for example, length of 3 for a 3D vector.

@example
```
import {FixedLengthArray} from 'type-fest';

type FencingTeam = FixedLengthArray<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```

@category Utilities
*/
export type FixedLengthArray<Element, Length extends number> =
	number extends Length ?
		// Because `Length extends number` and `number extends Length`, then Length is not a specific finite number
		Element[] : // It's not fixed length
		BuildTupleHelper<Element, Length, []>; // Otherwise it is fixed length tuple
