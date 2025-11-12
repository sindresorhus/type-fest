import type {If} from './if.d.ts';
import type {IfNotAnyOrNever, MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Ensure mutual exclusivity in object unions by adding other members’ keys as `?: never`.

Use-cases:
- You want each union member to be exclusive, preventing overlapping object shapes.
- You want to safely access any property defined across the union without additional type guards.

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
//=> {filePath: string; content?: never} | {content: string; filePath?: never}

declare function loadConfig2(options: Config): void;

// @ts-expect-error
loadConfig2({filePath: './config.json', content: '{ "name": "app" }'});
//=> Error: Argument of type '{ filePath: string; content: string; }' is not assignable to parameter of type '{ filePath: string; content?: never; } | { content: string; filePath?: never; }'.

loadConfig2({filePath: './config.json'}); // Ok

loadConfig2({content: '{ "name": "app" }'}); // Ok
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQB4GMA2ArgM7ABmiAqgHbATUC+cZUEIcA5EqgLRkrEYHANwAoUdzQAxYPhQBhemWABzOAF4MogJDK5ABQCGMABYAuOIKjBqKsQzETkaAJLV8NhUtUat23PQwKNQwFlY2dqIO4gAmKASGUGhkhNS4MHTUcPgQhjGK1MoqAIwAFBBgGfTEFjJyBUVwAD5wbh7UXoWqAJQWAG4QwDGOAPQjcADKbCj0aAGE+DFwIMCChgDWwfiIcGCsfUNoAEYQpnAABnooRqbncIbUS+cBIcEw5wB0ojl5Dapl6CuN3MnA+IxeRQ+ACtiPQOAAaOAvIIhCwcdBwABE1EMIBQmIsmMMYDAmLgDA4DG6wjgYzgADkIHAUFBWFBiOI6ZRiGhzjgCCRyFRaPQ7jAmXsUH03ggTMZlqsYBsUF9JHA-mpNPyiKQKDRMgAeOqdRotNqeDUAPjEY3UlowQOMIPCthpyLeAH4LB1pVAmC10O7UZYYNZXcxZNcnV64D6WQxYvF8Ilkql0plsrl8t4VAAmcqVTI1dU53pwAZDUbjAACMGIPBQ2FQ6QbrOg3yzGvzgMjwLRYIhqmhsOoCKRgTeaIx2Nx+MJxNJ5Mp1NEtvtmDbUAsAEEoCpCHiQnAIGQEM5OBjHaYwqGIm6J8GXXYl3BVrHTvdiKQVDijnIEBKiSzkEUDHqearohGBhOjeYbPkGMAxnGUA0v6GDjq8j63uGV4mEhUosqhHBfB2vw5t2uH9uCObDnCVI0nSADy6ziD82ZdHmpSBg+oQXliOJ4gSWILmSFL0bS4zMUAA)

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
//=> {amount: number; cardNumber: string; paypalId?: never} | {amount: number; paypalId: string; cardNumber?: never}

function processPayment2(payment: Payment) {
	const details = payment.cardNumber ?? payment.paypalId; // Ok
	//=> string
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQB4GMA2ArgM7ABmiAqgHbATUC+cZUEIcA5EqgLRkrEYHANwAoUdzQBhAIZQAJgAUZiECmrwAvBlEBIGSAiENALjjVCIAEYooY3bjnyAcpZtQzgqMGoBzMQxiEshoysgy+GFqGnDa6HoGRqbmbrb2YCoZ+ACS8p4w3n4BQWTGuDB01HBgrLgCxFHqMACMABQZqk1msgqNMQA+cGFZfTAAlDq6APRTcAACMMQ8KNio5ctQrFB6uPSCcPIoMDLA+MSx1SrRMAB0jgqu1rZwAPwvl50aNx1ZucJwMzgsmo1Ag8BkuDqxHOAAN7i5UlAYXBoHAYT8IrlkfJgFAUOV8IhRAxxJIhlcmhccAQSOQqLR6AAeHpKCkDcnhSJsmAAPjEM00PIwiWMMDMFiedjg8Me7nyhX8H1+8he4pQADdbExBugRckJe5-hicnk4F4fIqZYjVeYNVrxKVqOVKtVavVRgAmdrcsyjCbxBx7eCHY6nc7aDrXO5OWXPN4fKPGv4A2YAeQA1noBULzX5iUA)

@example
```
import type {ExclusifyUnion} from 'type-fest';

type A = ExclusifyUnion<{a: string} | {b: number}>;
//=> {a: string; b?: never} | {a?: never; b: number}

type B = ExclusifyUnion<{a: string} | {b: number} | {c: boolean}>;
//=> {a: string; b?: never; c?: never} | {a?: never; b: number; c?: never} | {a?: never; b?: never; c: boolean}

type C = ExclusifyUnion<{a: string; b: number} | {b: string; c: number}>;
//=> {a: string; b: number; c?: never} | {a?: never; b: string; c: number}

type D = ExclusifyUnion<{a?: 1; readonly b: 2} | {d: 4}>;
//=> {a?: 1; readonly b: 2; d?: never} | {a?: never; b?: never; d: 4}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQB4GMA2ArgM7ABmiAqgHbATUC+cZUEIcA5EqgLRkrEYHANwAoUdzQBBOAF44OAiXJVa9ADzoAhgC44gqMGoBzJgB8MAIz3VCISyigMAfGID0b2c4y79MQybCcJYA-DYoAG6O5j5hcNSRjkHW8XYOTuKScABCcgp4RKQUNHTUmr4GRqZwFugptvbRNRi4epYQEPgoWoyuoh5ePnqVgcFxCVFQQbjjiU7N2rOTyTZpSXAz4ZMxi1vroXtTG20dXT0MmchoAMJ5ioUqJRraw-5VK6mN87UpI8bTqy+Lncnm8Lz8AX+wUB6WmSyatS08KOvzeo1an3SFwkVzgABE7gVlMU1GVdnAAIxBKDdAAm9HwiGhcAATDtaXoACzA-qg2J6KlwGlaenURnMllBWnInZIw7JZFSrkMIA)

@category Object
@category Union
*/
export type ExclusifyUnion<Union> = IfNotAnyOrNever<Union,
	If<IsUnknown<Union>, Union,
		Extract<Union, NonRecursiveType | MapsSetsOrArrays> extends infer SkippedMembers
			? SkippedMembers | _ExclusifyUnion<Exclude<Union, SkippedMembers>>
			: never
	>
>;

type _ExclusifyUnion<Union, UnionCopy = Union> = Union extends unknown // For distributing `Union`
	? Simplify<
		Union & Partial<
			Record<
				Exclude<KeysOfUnion<UnionCopy>, keyof Union>,
				never
			>
		>
	>
	: never; // Should never happen

export {};
