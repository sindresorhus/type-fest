import {expectTypeOf} from 'nz';
import type {Exact, Opaque} from '../index.d.ts';

{ // Spec - string type
	type Type = string;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept string
		const input = '';
		function_(input);
	}

	{ // It should reject number
		const input = 1;
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject object
		const input = {};
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - bigint type
	type Type = bigint;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept bigint
		const input = 9_007_199_254_740_991n;
		function_(input);
	}

	{ // It should reject number
		const input = 1;
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject unknown
		const input = {} as unknown;
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - array
	type Type = Array<{code: string; name?: string}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept array with required property only
		const input = [{code: ''}];
		function_(input);
	}

	{ // It should reject readonly array
		const input = [{code: ''}] as ReadonlyArray<{code: string}>;
		// @ts-expect-error
		function_(input);
	}

	{ // It should accept array with optional property
		const input = [{code: '', name: ''}];
		function_(input);
	}

	{ // It should reject array with excess property
		const input = [{code: '', name: '', excessProperty: ''}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - readonly array
	type Type = ReadonlyArray<{code: string; name?: string}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept array with required property only
		const input = [{code: ''}];
		function_(input);
	}

	{ // It should accept readonly array
		const input = [{code: ''}] as ReadonlyArray<{code: string}>;
		function_(input);
	}

	{ // It should accept array with optional property
		const input = [{code: '', name: ''}];
		function_(input);
	}

	{ // It should reject array with excess property
		const input = [{code: '', name: '', excessProperty: ''}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - object
	type Type = {code: string; name?: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept object with required property only
		const input = {code: ''};
		function_(input);
	}

	{ // It should accept object with optional property
		const input = {code: '', name: ''};
		function_(input);
	}

	{ // It should reject object with excess property
		const input = {code: '', name: '', excessProperty: ''};
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - object with optional outer object @see https://github.com/sindresorhus/type-fest/pull/546#issuecomment-1385620838
	type Type = {
		outer?: {
			inner: {
				field: string;
			};
		};
	};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;
	function_({
		outer: {
			inner: {
				field: 'foo',
			},
		},
	});
}

{ // Spec - union - only object
	type Type = {code: string} | {name: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept type a
		const input = {code: ''};
		function_(input);
	}

	{ // It should accept type b
		const input = {name: ''};
		function_(input);
	}

	{ // It should reject intersection
		const input = {name: '', code: ''};
		// @ts-expect-error
		function_(input);
	}

	// It should accept a union of both types
	function_({} as {code: ''} | {name: ''});

	// It should reject a union with an excess property on one member
	// @ts-expect-error
	function_({} as {code: ''} | {name: ''; id: 1});

	const nested = <T extends Exact<{a?: Type}, T>>(arguments_: T) => arguments_;

	// It should accept a nested union of both types
	nested({} as {a?: {code: ''} | {name: ''}});

	// It should reject a nested intersection
	// @ts-expect-error
	nested({} as {a?: {code: ''; name: ''}});
}

{ // Spec - union - mixture object/primitive
	type Type = string | {code: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept type a
		const input = {code: ''};
		function_(input);
	}

	{ // It should accept type b
		const input = '';
		function_(input);
	}

	{ // It should reject intersection
		const input = {name: '', code: ''};
		// @ts-expect-error
		function_(input);
	}

	// It should accept a union of both types
	function_(primitiveOrObjectInput);

	// It should reject a union with an excess property on the object member
	// @ts-expect-error
	function_(primitiveOrExcessObjectInput);
}

declare const primitiveOrObjectInput: 'a' | {code: string};
declare const primitiveOrExcessObjectInput: 'a' | {code: string; name: string};
declare const arrayOrObjectInput: ['q'] | {a: 'x'};
declare const arrayOrExcessObjectInput: ['q'] | {a: 'x'; b: 'y'};

{ // Spec - union - mixture object/array
	type Type = string[] | {a: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	// It should accept a union of both types
	function_(arrayOrObjectInput);

	// It should reject a union with an excess property on the object member
	// @ts-expect-error
	function_(arrayOrExcessObjectInput);
}

{ // Spec - jsonschema2ts generated request type with additionalProperties: true
	type Type = {
		body: {
			[k: string]: unknown;
			code: string;
			name?: string;
		};
	};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept input with required property only
		const input = {body: {code: ''}};
		function_(input);
	}

	{ // It should accept input with optional property
		const input = {body: {code: '', name: ''}};
		function_(input);
	}

	{ // It should allow input with excess property
		const input = {body: {code: '', name: '', excessProperty: 1}};
		function_(input);
	}
}

{ // Spec - check index signature type
	type Type = {
		body: {
			[k: string]: string;
			code: string;
			name?: string;
		};
	};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should allow input with an excess property
		const input = {body: {code: '', name: '', excessProperty: 1}};
		// Expects error because the excess property is not string
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - index signature with object values
	const function_ = <T extends Exact<{a: Record<string, {b: string}>}, T>>(arguments_: T) => arguments_;

	// It should accept literal keys
	function_({} as {a: {x: {b: 'x'}; y: {b: 'y'}}});

	// It should accept an index signature
	function_({} as {a: Record<string, {b: 'x'}>});

	// It should reject an excess property in one of the values
	// @ts-expect-error
	function_({} as {a: {x: {b: 'x'}; y: {b: 'y'; c: 'y'}}});

	const numberFunction = <T extends Exact<Record<number, {b: string}>, T>>(arguments_: T) => arguments_;
	numberFunction({} as {0: {b: 'x'}});
	// @ts-expect-error
	numberFunction({} as {0: {b: 'x'; c: 'x'}});

	const templateFunction = <T extends Exact<Record<`data-${string}`, {b: string}>, T>>(arguments_: T) => arguments_;
	templateFunction({} as {'data-x': {b: 'x'}});
	// @ts-expect-error
	templateFunction({} as {'data-x': {b: 'x'; c: 'x'}});
	// @ts-expect-error
	templateFunction({} as {x: {b: 'x'}});

	const unionFunction = <T extends Exact<Record<string, string | {b: string}>, T>>(arguments_: T) => arguments_;
	unionFunction({} as {x: 'x'; y: {b: 'y'}});
	// @ts-expect-error
	unionFunction({} as {x: 'x'; y: {b: 'y'; c: 'y'}});

	// It should check the values of each member of a union input
	function_({} as {a: {x: {b: 'x'}} | {y: {b: 'y'}}});
	// @ts-expect-error
	function_({} as {a: {x: {b: 'x'}} | {y: {b: 'y'; c: 'y'}}});
	function_({} as {a: Record<string, {b: 'x'}> | {y: {b: 'y'}}});
	// @ts-expect-error
	function_({} as {a: Record<string, {b: 'x'}> | {y: {b: 'y'; c: 'y'}}});

	// It should reject an excess property in an index signature of the input
	// @ts-expect-error
	function_({} as {a: Record<string, {b: 'x'; c: 'x'}>});
	function_({} as {a: Record<`data-${string}`, {b: 'x'}>});
	// @ts-expect-error
	function_({} as {a: Record<`data-${string}`, {b: 'x'; c: 'x'}>});

	const declaredFunction = <T extends Exact<{id: {b: string}; [key: string]: {b: string}}, T>>(arguments_: T) => arguments_;
	declaredFunction({} as {id: {b: 'x'}; x: {b: 'x'}});
	// @ts-expect-error
	declaredFunction({} as {id: {b: 'x'; c: 'x'}; x: {b: 'x'}});
	// @ts-expect-error
	declaredFunction({} as {id: {b: 'x'}; x: {b: 'x'; c: 'x'}});
}

{ // Spec - index signature with a recursive value and a generic input value
	type Json = string | number | boolean | Json[] | {[key: string]: Json};
	type Row = {[key: string]: Json};

	// Type-checking this must not be excessively slow.
	const save = <Input extends Row>(row: Exact<Row, Input> & Input) => row;

	function _create<Kind extends 'a' | 'b'>(kind: Kind, details: {a: number}) {
		save({kind, details, status: 'created'});
	}
}

{ // Spec - index signature with values of different shapes and a generic input value
	type Json = string | number | boolean | null | Json[] | {[key: string]: Json};
	type Row = {[key: string]: Json};

	const save = <Input extends Row>(row: Exact<Row, Input> & Input) => row;

	// Type-checking this must not be excessively slow.
	function _createWithUnion<Kind extends 'a' | 'b'>(kind: Kind, payload: {a: number[]} | {b: {c: string}} | {d: string[]}) {
		save({kind, payload});
	}

	// Each value is checked with its own key, so the generic value does not affect the check of another value.
	function _createWithRecord<Kind extends 'a' | 'b'>(kind: Kind, payload: {r: Record<string, string>}) {
		save({kind, payload});
	}

	const exactRecord = <Input extends Exact<Record<string, {b: string}>, Input>>(input: Input) => input;

	function _createWithExcess<Kind extends 'a' | 'b'>(kind: Kind) {
		exactRecord({x: {b: kind}, y: {b: 'y'}});
		// @ts-expect-error
		exactRecord({x: {b: kind}, y: {b: 'y', c: 'y'}});
	}

	// It should accept a generic input that is passed on
	function _forward<Input extends Row>(row: Exact<Row, Input> & Input) {
		save(row);
	}

	// A generic value in a union input with an index signature member can make the check of the other values fail (known limitation)
	function _unionWithIndexSignature<Kind extends 'a' | 'b'>(kind: Kind, payload: {r: Record<string, string>}, record: Record<string, string>, flag: boolean) {
		// @ts-expect-error
		save(flag ? {kind, payload} : record);
	}
}

{ // Spec - number keys for a string index signature
	const function_ = <T extends Exact<Record<string, {b: string}>, T>>(arguments_: T) => arguments_;
	function_({} as {0: {b: 'x'}});
	function_({} as {[id: number]: {b: 'x'}});
	// @ts-expect-error
	function_({} as {0: {b: 'x'; c: 'x'}});
	// @ts-expect-error
	function_({} as {[id: number]: {b: 'x'; c: 'x'}});

	// It should still reject a number key that no index signature matches
	const templateFunction = <T extends Exact<Record<`data-${string}`, {b: string}>, T>>(arguments_: T) => arguments_;
	// @ts-expect-error
	templateFunction({} as {0: {b: 'x'}});
	const declaredFunction = <T extends Exact<{a: {b: string}}, T>>(arguments_: T) => arguments_;
	// @ts-expect-error
	declaredFunction({} as {a: {b: 'x'}; 0: {b: 'x'}});
}

{ // Spec - generic property values
	const function_ = <T extends Exact<{status: string; details: {a: number}}, T>>(arguments_: T) => arguments_;

	function _primitive<Status extends string>(status: Status) {
		function_({status, details: {a: 1}});
	}

	// A generic object value is rejected, because it can have extra properties (known limitation)
	function _object<Details extends {a: number}>(details: Details) {
		// @ts-expect-error
		function_({status: 'ready', details});
	}
}

{ // Spec - intersection of an index signature and an object
	const function_ = <T extends Exact<Record<string, {a: number}>, T>>(arguments_: T) => arguments_;

	// An excess property in the object is not detected (known limitation)
	function_({} as Record<string, {a: 1}> & {b: {a: 1; extra: true}});
}

{ // Spec - number keys for a number index signature
	const function_ = <T extends Exact<Record<number, {b: string}>, T>>(arguments_: T) => arguments_;
	function_({} as {'0': {b: 'x'}; '1.5': {b: 'y'}});
	// @ts-expect-error
	function_({} as {'0': {b: 'x'; c: 'x'}});
	// @ts-expect-error
	function_({} as {x: {b: 'x'}});

	const mixedFunction = <T extends Exact<{id: number; [key: string]: number}, T>>(arguments_: T) => arguments_;
	mixedFunction({id: 1, 0: 2, x: 3});
	// @ts-expect-error
	mixedFunction({id: 1, x: 'x'});
}

{ // Spec - index signature values
	const function_ = <T extends Exact<Record<string, {b: string}>, T>>(arguments_: T) => arguments_;

	function_({});
	function_({x: {b: 'x'}} as const);
	function_({} as {readonly x: {readonly b: 'x'}});
	function_({} as Record<string, {b: string}>);
	function_({} as {x?: {b: 'x'}});
	// @ts-expect-error
	function_({} as {x?: {b: 'x'; c: 'x'}});
	function_({} as {x: {b: 'x'}} | {x: {b: 'y'}});
	// @ts-expect-error
	function_({} as {x: {b: 'x'}} | {x: {b: 'y'; c: 'y'}});
	function_({} as {x: {b: 'x'}} & {y: {b: 'y'}});
	// @ts-expect-error
	function_({} as {x: {b: 'x'}} & {y: {b: 'y'; c: 'y'}});

	// Special values
	function_({} as {x: any});
	function_({} as {x: never});
	// @ts-expect-error
	function_({} as {x: unknown});
	// @ts-expect-error
	function_({x: 'x'});

	// A symbol key is not matched by a `string` index signature
	const symbolKey = Symbol('key');
	// @ts-expect-error
	function_({[symbolKey]: {b: 'x'}});

	// It should accept a generic key
	function _genericKey<Key extends string>(key: Key) {
		function_({[key]: {b: 'x'}});
	}

	// It should accept a generic input that is passed on
	function _forward<Input extends Exact<Record<string, {b: string}>, Input>>(input: Input) {
		function_(input);
	}

	const unknownFunction = <T extends Exact<Record<string, unknown>, T>>(arguments_: T) => arguments_;
	unknownFunction({x: {y: {z: 1}}, y: [1, 'a'], z: () => 1});

	const nullableFunction = <T extends Exact<Record<string, {b: string} | null | undefined>, T>>(arguments_: T) => arguments_;
	nullableFunction({x: null, y: undefined, z: {b: 'z'}});
	// @ts-expect-error
	nullableFunction({x: null, z: {b: 'z', c: 'z'}});

	const optionalFunction = <T extends Exact<Record<string, {b: string; c?: number}>, T>>(arguments_: T) => arguments_;
	optionalFunction({x: {b: 'x'}, y: {b: 'y', c: 1}});
	// @ts-expect-error
	optionalFunction({x: {b: 'x', d: 1}});

	const readonlyFunction = <T extends Exact<{readonly [key: string]: {b: string}}, T>>(arguments_: T) => arguments_;
	readonlyFunction({x: {b: 'x'}});
	// @ts-expect-error
	readonlyFunction({x: {b: 'x', c: 'x'}});

	const dateFunction = <T extends Exact<Record<string, Date>, T>>(arguments_: T) => arguments_;
	dateFunction({x: new Date()});

	const callbackFunction = <T extends Exact<Record<string, (value: string) => void>, T>>(arguments_: T) => arguments_;
	callbackFunction({x: (value: string) => value.trim(), y: (value: string) => value.length});
}

{ // Spec - nested index signature values
	const arrayFunction = <T extends Exact<Record<string, Array<{b: string}>>, T>>(arguments_: T) => arguments_;
	arrayFunction({x: [{b: 'x'}], y: []});
	// @ts-expect-error
	arrayFunction({x: [{b: 'x'}, {b: 'y', c: 'y'}]});

	const tupleFunction = <T extends Exact<Record<string, [{b: string}, number]>, T>>(arguments_: T) => arguments_;
	tupleFunction({x: [{b: 'x'}, 1]});
	// @ts-expect-error
	tupleFunction({x: [{b: 'x', c: 'x'}, 1]});

	const recordFunction = <T extends Exact<Record<string, Record<string, {b: string}>>, T>>(arguments_: T) => arguments_;
	recordFunction({x: {y: {b: 'y'}}, z: {}});
	// @ts-expect-error
	recordFunction({x: {y: {b: 'y'}, w: {b: 'w', c: 'w'}}});

	const arrayOfRecordsFunction = <T extends Exact<Array<Record<string, {b: string}>>, T>>(arguments_: T) => arguments_;
	arrayOfRecordsFunction([{x: {b: 'x'}}, {}]);
	// @ts-expect-error
	arrayOfRecordsFunction([{x: {b: 'x'}}, {y: {b: 'y', c: 'y'}}]);
}

{ // Spec - several index signatures
	const templateFunction = <T extends Exact<{[key: `data-${string}`]: string; [key: `aria-${string}`]: number}, T>>(arguments_: T) => arguments_;
	templateFunction({'data-x': 'x', 'aria-y': 1});
	// @ts-expect-error
	templateFunction({'data-x': 1});
	// @ts-expect-error
	templateFunction({role: 'x'});

	const stringAndNumberFunction = <T extends Exact<{[key: string]: number | {b: string}; [key: number]: number}, T>>(arguments_: T) => arguments_;
	stringAndNumberFunction({x: {b: 'x'}, 0: 1});
	// @ts-expect-error
	stringAndNumberFunction({x: {b: 'x', c: 'x'}});
	// @ts-expect-error
	stringAndNumberFunction({0: {b: 'x'}});

	const declaredOptionalFunction = <T extends Exact<{id?: {b: string}; [key: string]: {b: string} | undefined}, T>>(arguments_: T) => arguments_;
	declaredOptionalFunction({x: {b: 'x'}});
	declaredOptionalFunction({id: {b: 'x'}});
	// @ts-expect-error
	declaredOptionalFunction({id: {b: 'x', c: 'x'}});

	const unionFunction = <T extends Exact<Record<string, number> | {a: {b: string}}, T>>(arguments_: T) => arguments_;
	unionFunction({a: {b: 'x'}});
	unionFunction({x: 1});
	// @ts-expect-error
	unionFunction({a: {b: 'x', c: 'x'}});
}

{ // Spec - index signature with a recursive value and more generic input values
	type Json = string | number | boolean | null | Json[] | {[key: string]: Json};
	type Row = {[key: string]: Json};

	const save = <Input extends Row>(row: Exact<Row, Input> & Input) => row;
	const saveWithConstraint = <Input extends Exact<Row, Input>>(row: Input) => row;

	type Wide = {a: number[]} | {b: {c: string}} | {d: string[]} | {e: {f: {g: number[]}}} | {h: boolean[]} | {i: {j: string}; k: number[]} | {l: null} | {m: Array<{n: string}>};

	// Type-checking these must not be excessively slow.
	function _constraint<Kind extends 'a' | 'b'>(kind: Kind, payload: {a: number[]} | {b: {c: string}} | {d: string[]}, other: {r: Record<string, string>}) {
		saveWithConstraint({kind, payload});
		saveWithConstraint({kind, other});
	}

	function _shapes<Kind extends 'a' | 'b'>(kind: Kind, kinds: Kind[], sameKey: {v: number[]} | {v: {c: string}} | {v: string[]}, mixed: number[] | string[] | {c: string}) {
		save({kind, sameKey, mixed, tags: [kind], kinds, nested: {deep: {kind, mixed}}});
	}

	function _wide<Kind extends string, Count extends number>(kind: Kind, count: Count, first: Wide, second: Wide) {
		save({kind, count, first, second, nested: {first, second, kind}, list: [first, second], text: 'text', number: 1, flag: false, empty: null});
	}

	const strings = <Input extends Exact<Record<string, string>, Input>>(input: Input) => input;
	function _primitive<Name extends string>(name: Name) {
		strings({name, other: 'x'});
	}
}

{ // Spec - union of array
	type Type = Array<{x: string}> & Array<{z: number}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
		}];
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject incorrect type
		const input = [{
			x: 1,
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			y: '',
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - union of readonly array + non readonly array
	type Type = ReadonlyArray<{x: string}> & Array<{z: number}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
		}];
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject incorrect type
		const input = [{
			x: 1,
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			y: '',
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - union of array with nested fields
	type Type = Array<{x: string}> & Array<{z: number; d: {e: string; f: boolean}}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: true,
			},
		}];
		function_(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: true,
				g: '', // Excess field
			},
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				// Missing f: boolean
			},
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: '', // Type mismatch
			},
		}];
		// @ts-expect-error
		function_(input);
	}
}

// Spec - special test case for Opaque types
// @see https://github.com/sindresorhus/type-fest/issues/508
{
	type SpecialName = Opaque<string, 'special name'>;

	type OnlyAcceptName = {
		name: SpecialName;
	};

	const onlyAcceptNameImproved = <T extends Exact<OnlyAcceptName, T>>(arguments_: T) => arguments_;

	onlyAcceptNameImproved({
		// The error before the workaround:
		// Error: Type 'SpecialName' is not assignable to type 'never'
		name: 'name' as SpecialName,
	});
}

// Spec - special test case for Opaque type
// @see https://github.com/sindresorhus/type-fest/issues/508
{
	// Test for number Opaque type
	type SpecialName = Opaque<number, 'special name'>;

	type OnlyAcceptName = {
		name: SpecialName;
	};

	const function_ = <T extends Exact<OnlyAcceptName, T>>(arguments_: T) => arguments_;

	function_({
		// The error before the workaround:
		// Error: Type 'SpecialName' is not assignable to type 'never'
		name: 1 as SpecialName,
	});
}

// Spec - test the above for tagged types too.
{
	type TaggedNumber = Opaque<number, 'tag'>;

	const function_ = <T extends Exact<{a: TaggedNumber}, T>>(arguments_: T) => arguments_;

	function_({a: 1 as TaggedNumber});
	// @ts-expect-error
	function_({a: 1 as TaggedNumber, b: true});
}

// Spec - special test case for deep optional union
// https://github.com/sindresorhus/type-fest/issues/545
{
	type ParameterType = {
		outer?: {
			inner?: {
				union: 'foo' | 'bar';
			};
		};
	};

	const function_ = <InputT extends Exact<ParameterType, InputT>>(arguments_: InputT) => arguments_;

	// Test input with declared type
	type Input = {
		outer?: {
			inner?: {
				union: 'foo' | 'bar';
			};
		};
	};
	const variableWithDeclaredType: Input = {
		outer: {
			inner: {
				union: 'foo',
			},
		},
	};
	function_(variableWithDeclaredType);

	// Test input without declared type
	const variableWithoutDeclaredType = {
		outer: {
			inner: {
				union: 'foo' as const,
			},
		},
	};
	function_(variableWithoutDeclaredType);

	// Test input with plain object
	function_({
		outer: {
			inner: {
				union: 'foo',
			},
		},
	});
}

// Spec - special test case for Date type + union
// @see https://github.com/sindresorhus/type-fest/issues/896
{
	type A = {
		a: string;
		b?: Date | null;
	};

	const function_ = <T extends Exact<A, T>>(arguments_: T) => arguments_;

	function_({a: 'a'});
	function_({a: 'a', b: new Date()});
	function_({a: 'a', b: new Date() as Date | null});
	// @ts-expect-error
	function_({a: 'a', b: 1});
}

// Spec - special test case for Date type
// @see https://github.com/sindresorhus/type-fest/issues/909
{
	type UserType = {
		id: string;
		name: string;
		createdAt: Date;
		email?: string;
	};

	const function_ = <T extends Exact<UserType, T>>(arguments_: T) => arguments_;

	function_({
		id: 'asd',
		name: 'John',
		createdAt: new Date(),
	});

	const withExcessSurname = {
		id: 'asd',
		name: 'John',
		createdAt: new Date(),
		surname: 'Doe',
	};

	// Expects error due to surname is an excess field
	// @ts-expect-error
	function_(withExcessSurname);
}

// Spec - recursive type with union
// @see https://github.com/sindresorhus/type-fest/issues/948
{
	type A = {
		a: Expected;
	};
	type B = {
		b: string;
	};
	type Expected = A | B;

	const function_ = <T extends Exact<Expected, T>>(arguments_: T) => arguments_;

	function_({} as Expected);
}

// Spec - nested object under an optional or nullable property, where the input type is not equal to the parameter type
// @see https://github.com/sindresorhus/type-fest/issues/483
{
	type SmallType = {one: string; two?: string};
	type IntermediateType = {intermediate?: SmallType};
	type FinalType = {final?: IntermediateType};

	class SmallClass implements Exact<SmallType, SmallClass> {
		one = '';
	}

	class IntermediateClass implements Exact<IntermediateType, IntermediateClass> {
		intermediate?: SmallClass;
	}

	class FinalClass implements Exact<FinalType, FinalClass> {
		final?: IntermediateClass;
	}

	class SmallClassWithExcess {
		one = '';
		excess = '';
	}

	class FinalClassWithExcess implements Exact<FinalType, FinalClassWithExcess> {
		// @ts-expect-error
		final?: {intermediate?: SmallClassWithExcess};
	}

	const optional = <T extends Exact<{a?: {b: {c: string}}}, T>>(arguments_: T) => arguments_;
	optional({} as {a?: {b: {c: 'x'}}});
	optional({} as {} | {a: {b: {c: 'x'}}});
	optional({} as {a?: {b: {c: 'x'}}} | {a: {b: {c: 'y'}}});
	optional({} as {a?: any});
	optional({} as {a?: never});
	// @ts-expect-error
	optional({} as {a?: {b: {c: 'x'; d: 'x'}}});
	// @ts-expect-error
	optional({} as {} | {a: {b: {c: 'x'; d: 'x'}}});
	// @ts-expect-error
	optional({} as {a?: {b: {c: 'x'}}} | {a: {b: {c: 'y'; d: 'x'}}});
	// @ts-expect-error
	optional({} as {a?: {b: {c: 1}}});
	// @ts-expect-error
	optional({} as {a?: {b: {}}});

	const nullable = <T extends Exact<{a: {b: {c: string}} | null}, T>>(arguments_: T) => arguments_;
	nullable({} as {a: {b: {c: 'x'}} | null});
	// @ts-expect-error
	nullable({} as {a: {b: {c: 'x'; d: 'x'}} | null});

	const optionalNullable = <T extends Exact<{a?: {b: {c: string}} | null}, T>>(arguments_: T) => arguments_;
	optionalNullable({} as {a?: {b: {c: 'x'}} | null});
	// @ts-expect-error
	optionalNullable({} as {a?: {b: {c: 'x'; d: 'x'}} | null});

	const tuple = <T extends Exact<{a?: [{b: string}]}, T>>(arguments_: T) => arguments_;
	tuple({} as {a?: [{b: 'x'}]});
	// @ts-expect-error
	tuple({} as {a?: [{b: 'x'; c: 'x'}]});

	const array = <T extends Exact<{a?: Array<{b: {c: string}}>}, T>>(arguments_: T) => arguments_;
	array({} as {a?: Array<{b: {c: 'x'}}>});
	// @ts-expect-error
	array({} as {a?: Array<{b: {c: 'x'; d: 'x'}}>});
}

{ // Spec - tuple
	type Type = [string, number];
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept an exact tuple
		const input: [string, number] = ['', 1];
		function_(input);
	}

	{ // It should reject a longer tuple
		const input: [string, number, number] = ['', 1, 2];
		// @ts-expect-error
		function_(input);
	}
}

declare const unionInput: {name: string} | {name: string; id: number};

{ // Spec - the union is on the input side, and it should reject an input whose union has a member with an excess property
	type Type = {name: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;
	// @ts-expect-error
	function_(unionInput);
}

{ // Spec - readonly tuple
	type Type = readonly [string, number];
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept a readonly tuple of the same length
		const input = ['', 1] as const;
		function_(input);
	}

	{ // It should reject a longer readonly tuple
		const input = ['', 1, 2] as const;
		// @ts-expect-error
		function_(input);
	}
}

// Numeric properties and their string spellings are the same declared property, not excess keys.
expectTypeOf<{'0': 'value'}>().toBeAssignableTo<Exact<{0: string}, {'0': 'value'}>>();
expectTypeOf<{0: 'value'}>().toBeAssignableTo<Exact<{'0': string}, {0: 'value'}>>();
expectTypeOf<{'0'?: 'value'}>().toBeAssignableTo<Exact<{readonly 0?: string}, {'0'?: 'value'}>>();
expectTypeOf<{readonly 0: 'value'}>().toBeAssignableTo<Exact<{'0': string}, {readonly 0: 'value'}>>();
expectTypeOf<{'0': 'value'; extra: true}>().not.toBeAssignableTo<Exact<{0: string}, {'0': 'value'; extra: true}>>();
expectTypeOf<{'0': 5}>().not.toBeAssignableTo<Exact<{0: string}, {'0': 5}>>();
expectTypeOf<{'0': 'value'}>().not.toBeAssignableTo<Exact<{0: never}, {'0': 'value'}>>();
expectTypeOf<{'0': 'value'}>().toBeAssignableTo<Exact<{0: unknown}, {'0': 'value'}>>();
expectTypeOf<{'0': 'value'}>().toBeAssignableTo<Exact<{0: any}, {'0': 'value'}>>();
expectTypeOf<{'1.5': 'value'}>().toBeAssignableTo<Exact<{1.5: string}, {'1.5': 'value'}>>();
expectTypeOf<{[-1]: 'value'}>().toBeAssignableTo<Exact<{'-1': string}, {[-1]: 'value'}>>();

// Spellings that are not numeric aliases remain excess, including with a number index signature.
expectTypeOf<{'01': 'value'}>().not.toBeAssignableTo<Exact<{1: string}, {'01': 'value'}>>();
expectTypeOf<{'1.0': 'value'}>().not.toBeAssignableTo<Exact<{1: string}, {'1.0': 'value'}>>();
expectTypeOf<{1: 'value'}>().not.toBeAssignableTo<Exact<{'01': string}, {1: 'value'}>>();
expectTypeOf<{'01': 'value'}>().not.toBeAssignableTo<Exact<Record<number, string>, {'01': 'value'}>>();

// Nested values and input unions still enforce their own excess-property checks.
type AliasedInputUnion = {0: 'first'} | {'0': 'second'};
expectTypeOf<AliasedInputUnion>().toBeAssignableTo<Exact<{0: string}, AliasedInputUnion>>();
expectTypeOf<{'0': {name: 'value'}}>().toBeAssignableTo<Exact<{0: {name: string}}, {'0': {name: 'value'}}>>();
expectTypeOf<{'0': {name: 'value'; extra: true}}>().not.toBeAssignableTo<Exact<{0: {name: string}}, {'0': {name: 'value'; extra: true}}>>();

// String enum keys have the same runtime name as their string values.
enum ExactField {
	Name = 'name',
}
expectTypeOf<{name: 'value'}>().toBeAssignableTo<Exact<{[ExactField.Name]: string}, {name: 'value'}>>();
expectTypeOf<{[ExactField.Name]: 'value'}>().toBeAssignableTo<Exact<{name: string}, {[ExactField.Name]: 'value'}>>();

declare const exactSymbol: unique symbol;
expectTypeOf<{[exactSymbol]: 'value'}>().toBeAssignableTo<Exact<{[exactSymbol]: string}, {[exactSymbol]: 'value'}>>();

const acceptNumericProperty = <Input extends Exact<{0: string}, Input>>(input: Input) => input;
expectTypeOf(acceptNumericProperty({'0': 'value'} as const)).toBe<{readonly '0': 'value'}>();
// @ts-expect-error
acceptNumericProperty({'0': 'value', extra: true});

// A variadic tuple still requires its fixed positions in the declared order.
const acceptVariadicPrefix = <Input extends Exact<[number, ...string[]], Input>>(input: Input) => input;
// @ts-expect-error A required prefix cannot be omitted.
acceptVariadicPrefix([]);
// @ts-expect-error The first entry must be a number.
acceptVariadicPrefix(['a', 1]);

const acceptVariadicRecords = <Input extends Exact<[header: {id: number}, ...rows: Array<{name: string}>], Input>>(input: Input) => input;
// @ts-expect-error Headers and rows cannot exchange positions.
acceptVariadicRecords([{name: 'a'}, {id: 1}]);

expectTypeOf(acceptVariadicPrefix([1, 'a'] as [1, 'a'])).toBe<[1, 'a']>();
acceptVariadicPrefix([1]);
const readonlyVariadicPrefixInput = [1, 'a'] as const;
// @ts-expect-error Readonly inputs cannot satisfy a mutable tuple.
acceptVariadicPrefix(readonlyVariadicPrefixInput);
acceptVariadicRecords([{id: 1}]);
acceptVariadicRecords([{id: 1}, {name: 'a'}, {name: 'b'}]);
// @ts-expect-error The fixed position is checked recursively.
acceptVariadicRecords([{id: 1, extra: true}]);
// @ts-expect-error The rest positions are checked recursively too.
acceptVariadicRecords([{id: 1}, {name: 'a', extra: true}]);

const acceptVariadicSuffix = <Input extends Exact<[...string[], number], Input>>(input: Input) => input;
acceptVariadicSuffix([1]);
acceptVariadicSuffix(['a', 'b', 1]);
// @ts-expect-error The last entry must be a number.
acceptVariadicSuffix([1, 'a']);
// @ts-expect-error The required suffix cannot be omitted.
acceptVariadicSuffix([]);

const acceptVariadicMiddle = <Input extends Exact<[number, ...string[], boolean], Input>>(input: Input) => input;
acceptVariadicMiddle([1, true]);
acceptVariadicMiddle([1, 'a', true]);
// @ts-expect-error The fixed positions must retain their types and order.
acceptVariadicMiddle([true, 'a', 1]);
// @ts-expect-error Both fixed positions are required.
acceptVariadicMiddle([1]);

const acceptReadonlyVariadic = <Input extends Exact<readonly [{id: number}, ...Array<{name: string}>], Input>>(input: Input) => input;
acceptReadonlyVariadic([{id: 1}, {name: 'a'}] as const);
acceptReadonlyVariadic([{id: 1}]);
// @ts-expect-error The readonly prefix still has to be a header.
acceptReadonlyVariadic([{name: 'a'}, {id: 1}] as const);
// @ts-expect-error Readonly rows still reject excess properties.
acceptReadonlyVariadic([{id: 1}, {name: 'a', extra: true}] as const);

const acceptOptionalVariadic = <Input extends Exact<[header?: {id: number}, ...rows: Array<{name: string}>], Input>>(input: Input) => input;
acceptOptionalVariadic([]);
acceptOptionalVariadic([{id: 1}]);
acceptOptionalVariadic([{id: 1}, {name: 'a'}]);
// @ts-expect-error An optional fixed position retains its recursive checks.
acceptOptionalVariadic([{id: 1, extra: true}]);
// @ts-expect-error The rest element keeps its recursive checks after an optional position.
acceptOptionalVariadic([{id: 1}, {name: 'a', extra: true}]);

// A tuple consisting only of a rest element remains an ordinary array.
const acceptRestOnly = <Input extends Exact<[...Array<{name: string}>], Input>>(input: Input) => input;
acceptRestOnly([]);
acceptRestOnly([{name: 'a'}, {name: 'b'}]);
// @ts-expect-error
acceptRestOnly([{name: 'a', extra: true}]);

// Each alternative keeps its own fixed positions and recursive row checks.
type VariadicAlternatives = [kind: 'text', ...rows: Array<{text: string}>] | [kind: 'count', ...rows: Array<{count: number}>];
const acceptVariadicUnion = <Input extends Exact<VariadicAlternatives, Input>>(input: Input) => input;
acceptVariadicUnion(['text', {text: 'a'}]);
acceptVariadicUnion(['count', {count: 1}]);
declare const validVariadicUnion: ['text', {text: 'a'}] | ['count', {count: 1}];
acceptVariadicUnion(validVariadicUnion);
// @ts-expect-error A row cannot come from a different alternative.
acceptVariadicUnion(['text', {count: 1}]);
// @ts-expect-error An input union with an excess field is rejected.
acceptVariadicUnion({} as ['text', {text: 'a'}] | ['count', {count: 1; extra: true}]);

// Element sentinel types do not change the required tuple shape.
expectTypeOf<Exact<[unknown, ...any[]], [1, 'a']>>().toBe<[unknown, ...any[]]>();
expectTypeOf<Exact<[any, ...unknown[]], [1, 'a']>>().toBe<[any, ...unknown[]]>();
expectTypeOf<Exact<[never, ...string[]], [never]>>().toBe<[never, ...string[]]>();
expectTypeOf<Exact<[number, ...string[]], unknown>>().toBe<[number, ...string[]]>();
expectTypeOf<Exact<[number, ...string[]], never>>().toBe<[number, ...string[]]>();

// Excess keys from either input alternative are forbidden, including explicit undefined values.
type ExactHiddenFields = Exact<{readonly id: string}, {id: 'first'; count: number} | {id: 'second'; message: string}>;
({id: 'ready'}) satisfies ExactHiddenFields;
expectTypeOf<{id: string; count: undefined}>().not.toBeAssignableTo<ExactHiddenFields>();
expectTypeOf<{id: string; message: undefined}>().not.toBeAssignableTo<ExactHiddenFields>();
declare const exactHiddenFields: ExactHiddenFields;
expectTypeOf(exactHiddenFields.id).toBe<string>();
// @ts-expect-error Removing excess fields does not remove the parameter's readonly modifier.
exactHiddenFields.id = 'ready';

// Primitive leaves retain their parameter types, including unions, brands, and sentinels.
type PrimitiveOptions = {readonly status: 'ready' | 'busy'; optional?: number | undefined; dynamic: any; opaque: unknown; impossible: never};
declare const primitiveOptions: Exact<PrimitiveOptions, {status: 'ready'; optional: undefined; dynamic: 1; opaque: {id: 1}; impossible: never}>;
expectTypeOf(primitiveOptions.status).toBe<'ready' | 'busy'>();
expectTypeOf(primitiveOptions.optional).toBe<number | undefined>();
expectTypeOf(primitiveOptions.dynamic).toBe<any>();
expectTypeOf(primitiveOptions.opaque).toBe<unknown>();
expectTypeOf(primitiveOptions.impossible).toBe<never>();
// @ts-expect-error Returning a primitive leaf does not remove its readonly modifier.
primitiveOptions.status = 'busy';

type PrimitiveChoice = {value: 'ready' | {readonly id: number}};
expectTypeOf<Exact<PrimitiveChoice, PrimitiveChoice>>().toBe<PrimitiveChoice>();
expectTypeOf<Exact<{value: any}, {value: never}>['value']>().toBe<any>();
expectTypeOf<Exact<{value: never}, {value: any}>['value']>().toBe<never>();

declare function exactStatus<Input extends Exact<{status: 'ready' | 'busy'; optional?: number | undefined}, Input>>(input: Input): Input;
expectTypeOf(exactStatus({status: 'ready', optional: undefined} as const)).toBe<{readonly status: 'ready'; readonly optional: undefined}>();
// @ts-expect-error Primitive leaves must still satisfy their declared literal values.
exactStatus({status: 'done'});
// @ts-expect-error Skipping a primitive leaf does not permit excess fields on its owner.
exactStatus({status: 'ready', extra: true});

declare function exactPrimitiveValue<const Value extends string>(value: Value): Exact<{readonly value: Value}, {value: Value}>;

expectTypeOf(exactPrimitiveValue('ready' as const).value).toBe<'ready'>();
expectTypeOf<Exact<{value: Opaque<string, 'Id'>}, {value: Opaque<'ready', 'Id'>}>['value']>().toBe<Opaque<string, 'Id'>>();

// Numeric aliases must read nested input values before checking their excess keys.
type NumericRecordParameter = {readonly 0?: {entry: {name: string}; rows: ReadonlyArray<{id: number}>}};
type NumericRecordInput = {readonly '0'?: {entry: {name: 'Ada'}; rows: readonly [{id: 1}]}};
expectTypeOf<NumericRecordInput>().toBeAssignableTo<Exact<NumericRecordParameter, NumericRecordInput>>();
type NumericRecordExcessInput = {'0'?: {entry: {name: 'Ada'; extra: true}; rows: [{id: 1}]}};
expectTypeOf<NumericRecordExcessInput>().not.toBeAssignableTo<Exact<NumericRecordParameter, NumericRecordExcessInput>>();
type NumericRowsExcessInput = {'0'?: {entry: {name: 'Ada'}; rows: [{id: 1; extra: true}]}};
expectTypeOf<NumericRowsExcessInput>().not.toBeAssignableTo<Exact<NumericRecordParameter, NumericRowsExcessInput>>();
type NumericMissingInput = {'0': {entry: {}; rows: []}};
expectTypeOf<NumericMissingInput>().not.toBeAssignableTo<Exact<NumericRecordParameter, NumericMissingInput>>();

type AliasedObjectUnion = {0: {name: 'Ada'}} | {'0': {name: 'Grace'}};
expectTypeOf<AliasedObjectUnion>().toBeAssignableTo<Exact<{0: {name: string}}, AliasedObjectUnion>>();
type AliasedExcessObjectUnion = {0: {name: 'Ada'}} | {'0': {name: 'Grace'; extra: true}};
expectTypeOf<AliasedExcessObjectUnion>().not.toBeAssignableTo<Exact<{0: {name: string}}, AliasedExcessObjectUnion>>();
type AliasedNullableInput = {0: {name: 'Ada'} | null};
expectTypeOf<AliasedNullableInput>().toBeAssignableTo<Exact<{'0': {name: string} | null}, AliasedNullableInput>>();
type AliasedNullableExcessInput = {0: {name: 'Ada'; extra: true} | null};
expectTypeOf<AliasedNullableExcessInput>().not.toBeAssignableTo<Exact<{'0': {name: string} | null}, AliasedNullableExcessInput>>();

// Symbol-keyed nested values follow the same recursive checks as string keys.
type SymbolRecordParameter = {readonly [exactSymbol]?: {name: string}};
expectTypeOf<{[exactSymbol]?: {name: 'Ada'}}>().toBeAssignableTo<Exact<SymbolRecordParameter, {[exactSymbol]?: {name: 'Ada'}}>>();
expectTypeOf<{[exactSymbol]?: {name: 'Ada'; extra: true}}>().not.toBeAssignableTo<Exact<SymbolRecordParameter, {[exactSymbol]?: {name: 'Ada'; extra: true}}>>();
expectTypeOf<{[exactSymbol]: {name: 'Ada'}}>().toBeAssignableTo<Exact<Record<symbol, {name: string}>, {[exactSymbol]: {name: 'Ada'}}>>();
expectTypeOf<{[exactSymbol]: {name: 'Ada'; extra: true}}>().not.toBeAssignableTo<Exact<Record<symbol, {name: string}>, {[exactSymbol]: {name: 'Ada'; extra: true}}>>();

// Reading a specific declared key must not fall back to its broader index signature.
type PreciseIndexedParameter = {[key: string]: unknown; entry: {name: string}};
expectTypeOf<{entry: {name: 'Ada'}; other: {extra: true}}>().toBeAssignableTo<Exact<PreciseIndexedParameter, {entry: {name: 'Ada'}; other: {extra: true}}>>();
expectTypeOf<{entry: {name: 'Ada'; extra: true}}>().not.toBeAssignableTo<Exact<PreciseIndexedParameter, {entry: {name: 'Ada'; extra: true}}>>();

// The alias works in both directions: the parameter may declare the string spelling and the input the numeric one.
type ReverseAliasParameter = {readonly '0'?: {name: string}};
expectTypeOf<{0?: {name: 'Ada'}}>().toBeAssignableTo<Exact<ReverseAliasParameter, {0?: {name: 'Ada'}}>>();
expectTypeOf<{0?: {name: 'Ada'; extra: true}}>().not.toBeAssignableTo<Exact<ReverseAliasParameter, {0?: {name: 'Ada'; extra: true}}>>();
