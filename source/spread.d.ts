import type {SimplifyObject} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {RequiredKeysOf} from './required-keys-of.d.ts';

// The spread syntax always produces a fresh object literal, so `readonly` is dropped, and an index signature survives only when both operands have it.
type SpreadObject<FirstType extends object, SecondType extends object> = {
	-readonly [Key in keyof OmitIndexSignature<FirstType>]: Key extends keyof OmitIndexSignature<SecondType>
		? FirstType[Key] | Required<OmitIndexSignature<SecondType>>[Key]
		: FirstType[Key];
} & Pick<
	{-readonly [Key in keyof OmitIndexSignature<SecondType>]: OmitIndexSignature<SecondType>[Key]},
RequiredKeysOf<OmitIndexSignature<SecondType>> | Exclude<keyof OmitIndexSignature<SecondType>, keyof OmitIndexSignature<FirstType>>
> & {
	[Key in keyof PickIndexSignature<FirstType> & keyof PickIndexSignature<SecondType>]: PickIndexSignature<FirstType>[Key] | PickIndexSignature<SecondType>[Key];
};

type TupleOrArray = readonly [...unknown[]];

type SpreadTupleOrArray<
	FirstType extends TupleOrArray,
	SecondType extends TupleOrArray,
> = Array<FirstType[number] | SecondType[number]>;

type Spreadable = object | TupleOrArray;

/**
Mimic the type inferred by TypeScript when merging two objects or two arrays/tuples using the spread syntax.

@example
```
import type {Spread} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
};

type Bar = {
	b?: number;
	c: boolean;
};

const foo = {a: 1, b: '2'};
const bar = {c: false};
const fooBar = {...foo, ...bar};

type FooBar = Spread<Foo, Bar>;
//=> {a: number; b?: string | number; c: boolean}

declare function baz(argument: FooBar): void;

baz(fooBar);
```

@example
```
import type {Spread} from 'type-fest';

const foo = [1, 2, 3];
const bar = ['4', '5', '6'];

const fooBar = [...foo, ...bar];
type FooBar = Spread<typeof foo, typeof bar>;
// FooBar = (string | number)[]

declare function baz(argument: FooBar): void;

baz(fooBar);
```

@category Object
*/
export type Spread<
	FirstType extends Spreadable,
	SecondType extends Spreadable,
> =
	// The spread syntax infers `any` when either operand is `any`, so this has to as well. Without the guard the mapped type walked `keyof any`, which is `string | number | symbol`, and the result kept the other operand's own keys only, so it accepted strictly less than the runtime does. `ObjectMerge`, the sound version of the same merge, answers `any` for the same input.
	IsAny<FirstType> extends true
		? any
		: IsAny<SecondType> extends true
			? any
			: FirstType extends TupleOrArray
				? SecondType extends TupleOrArray
					? SpreadTupleOrArray<FirstType, SecondType>
					: SecondType extends unknown // For distributing `SecondType`
						? SimplifyObject<SpreadObject<FirstType, SecondType>>
						: never
				: SecondType extends unknown // For distributing `SecondType`
					? SimplifyObject<SpreadObject<FirstType, SecondType>>
					: never;

export {};
