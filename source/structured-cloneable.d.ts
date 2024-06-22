import type {TypedArray} from './typed-array';

type StructuredCloneablePrimitive =
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| Boolean
	| Number
	| String;

type StructuredCloneableData =
	| ArrayBuffer
	| DataView
	| Date
	| Error
	| RegExp
	| TypedArray;

type StructuredCloneableCollection =
	| readonly StructuredCloneable[]
	| {readonly [k: string]: StructuredCloneable; readonly [k: number]: StructuredCloneable}
	| ReadonlyMap<StructuredCloneable, StructuredCloneable>
	| ReadonlySet<StructuredCloneable>;

/**
Matches a value that can be losslessly cloned using `structuredClone`.

Can be used to type values that you expect to pass to `structuredClone`.

Note:
- Custom error types will be cloned as the base `Error` type
- This type doesn't include the web-specific cloneable types (e.g. `Blob` and `DOMRect`)

@see `StructuredCloneableWeb` for a version that includes the web-specific types

@example
```
import type {StructuredCloneable} from 'type-fest';

class CustomClass {}

// @ts-expect-error
const error: StructuredCloneable = {
    custom: new CustomClass(),
};

structuredClone(error);
//=> {custom: {}}

const good: StructuredCloneable = {
    num: 3,
    date: new Date(),
    map: new Map<string, number>(),
}
good.map.set("key", 1)

structuredClone(good);
//=> {num: 3, date: Date(2022-10-17 22:22:35.920), map: Map {"key" -> 1}}
```

@category Structured clone
 */
export type StructuredCloneable = StructuredCloneablePrimitive | StructuredCloneableData | StructuredCloneableCollection;
