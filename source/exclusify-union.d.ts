import type {SimplifyObject} from './internal/index.d.ts';
import type {If} from './if.d.ts';
import type {IfNotAnyOrNever, MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';

/**
Ensure mutual exclusivity in object unions by adding other members’ keys as `?: never`.

Use-cases:
- You want each union member to be exclusive, preventing overlapping object shapes.
- You want to safely access any property defined across the union without additional type guards.
- You want to destructure an object union, like a function's return value, and still narrow it afterwards.

@example
```
import type {ExclusifyUnion} from 'type-fest';

type FileConfig = {
	filePath: string;
};

type InlineConfig = {
	content: string;
};

declare function loadConfig1(options: FileConfig | InlineConfig): void;

// Someone could mistakenly provide both `filePath` and `content`.
loadConfig1({filePath: './config.json', content: '{ "name": "app" }'}); // No errors

// Use `ExclusifyUnion` to prevent that mistake.
type Config = ExclusifyUnion<FileConfig | InlineConfig>;
//=> {
// 	filePath: string;
// 	content?: never;
// } | {
// 	content: string;
// 	filePath?: never;
// }

declare function loadConfig2(options: Config): void;

// @ts-expect-error
loadConfig2({filePath: './config.json', content: '{ "name": "app" }'});
// Error: Argument of type '{ filePath: string; content: string; }' is not assignable to parameter of type '{ filePath: string; content?: never; } | { content: string; filePath?: never; }'.

loadConfig2({filePath: './config.json'}); // Ok

loadConfig2({content: '{ "name": "app" }'}); // Ok
```

@example
```
import type {ExclusifyUnion} from 'type-fest';

type CardPayment = {
	amount: number;
	cardNumber: string;
};

type PaypalPayment = {
	amount: number;
	paypalId: string;
};

function processPayment1(payment: CardPayment | PaypalPayment) {
	// @ts-expect-error
	const details = payment.cardNumber ?? payment.paypalId; // Cannot access `cardNumber` or `paypalId` directly
}

type Payment = ExclusifyUnion<CardPayment | PaypalPayment>;
//=> {
// 	amount: number;
// 	cardNumber: string;
// 	paypalId?: never;
// } | {
// 	amount: number;
// 	paypalId: string;
// 	cardNumber?: never;
// }

function processPayment2(payment: Payment) {
	const details = payment.cardNumber ?? payment.paypalId; // Ok
	//=> string
}
```

@example
```
import type {ExclusifyUnion} from 'type-fest';

type Success = {
	data: string;
};

type Failure = {
	error: Error;
};

declare function fetchData1(): Success | Failure;

// @ts-expect-error
const {data: data1, error: error1} = fetchData1(); // Cannot destructure `data` or `error` directly

declare function fetchData2(): ExclusifyUnion<Success | Failure>;

const {data, error} = fetchData2(); // Ok

if (error) {
	console.error(error.message);
} else {
	const result = data; // Narrowed by checking `error`
	//=> string
}
```

@example
```
import type {ExclusifyUnion} from 'type-fest';

type A = ExclusifyUnion<{a: string} | {b: number}>;
//=> {a: string; b?: never} | {b: number; a?: never}

type B = ExclusifyUnion<{a: string} | {b: number} | {c: boolean}>;
//=> {
// 	a: string;
// 	b?: never;
// 	c?: never;
// } | {
// 	b: number;
// 	a?: never;
// 	c?: never;
// } | {
// 	c: boolean;
// 	a?: never;
// 	b?: never;
// }

type C = ExclusifyUnion<{a: string; b: number} | {b: string; c: number}>;
//=> {
// 	a: string;
// 	b: number;
// 	c?: never;
// } | {
// 	b: string;
// 	c: number;
// 	a?: never;
// }

type D = ExclusifyUnion<{a?: 1; readonly b: 2} | {d: 4}>;
//=> {a?: 1; readonly b: 2; d?: never} | {d: 4; a?: never; b?: never}
```

@category Object
@category Union
*/
export type ExclusifyUnion<Union> = IfNotAnyOrNever<Union, {
	ifNot: If<IsUnknown<Union>, Union,
		Extract<Union, NonRecursiveType | MapsSetsOrArrays> extends infer SkippedMembers
			? SkippedMembers | _ExclusifyUnion<Exclude<Union, SkippedMembers>>
			: never
	>;
}>;

type _ExclusifyUnion<Union, UnionCopy = Union> = Union extends unknown // For distributing `Union`
	? SimplifyObject<
		Union & Partial<
			Record<
				// A string index signature contributes `string | number` to `KeysOfUnion`, and adding those as `never` keys would collide with the other members' own named string keys and leave the union with nothing assignable to it, so the keys are read with the index signatures taken off.
				Exclude<KeysOfUnion<OmitIndexSignature<UnionCopy>>, keyof OmitIndexSignature<Union>>,
				never
			>
		>
	>
	: never; // Should never happen

export {};
