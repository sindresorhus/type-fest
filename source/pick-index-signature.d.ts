/**
Pick only index signatures from the given object type, leaving out all explicitly defined properties.

This is the counterpart of `OmitIndexSignature`.

@example
```
import type {PickIndexSignature} from 'type-fest';

declare const symbolKey: unique symbol;

type Example = {
	// These index signatures will remain.
	[x: string]: unknown;
	[x: number]: unknown;
	[x: symbol]: unknown;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;

	// These explicitly defined keys will be removed.
	['kebab-case-key']: string;
	[symbolKey]: string;
	foo: 'bar';
	qux?: 'baz';
};

type ExampleIndexSignature = PickIndexSignature<Example>;
// {
// 	[x: string]: unknown;
// 	[x: number]: unknown;
// 	[x: symbol]: unknown;
// 	[x: `head-${string}`]: string;
// 	[x: `${string}-tail`]: string;
// 	[x: `head-${string}-tail`]: string;
// 	[x: `${bigint}`]: string;
// 	[x: `embedded-${number}`]: string;
// }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gBWAYwNYCSAdgCYoAeAysAOZECGMArlCgL5wBmUEIcA5ElQBaTigDOMfgG4AULLI4ANvVZwcEIpLjjEIAEYQlAaRSIAXHCZFgARyZpdBo3NlC0AUXL1wStAF4MWQBIAHpQuAAVAAsJNGBSCh1aBmZWcTgAd2AlJThWEHoEgDoQgG1yS0koBJoAXUtrPCIITKI5YIrLIiYDFCgGqyJm1vbyyp09QyVBppa2jq64AANY+hJhABJ0atq2ZcHdohpFieXto5o2YRgipQOqmBrj08tVlHWtnae9m7uHnQ-F7jN7bfS0BIwfaHIEnEErFB9EhkDbbHp9KDQx7POEhcJRWLiNAUMBKXDAGBKRBwMicBIoEhwPBmDLZXJwfRoAoQABuDNKnX4zP09H0whw9CJwmZiH4MJxiyc01MiHltQ6nAgEEs-BFUBkIXs5AA-DqRQAvA1sVzuOBeHyklDEMhUFKMFgBODYfDOijUOju1gAHntvhQAD45Pj0LJ8Z0JpdZsN5mM40t0ZyBo1k6MoxF41UpkYkyMFrH80t3p8LrCsYCFeW4AWVjWcddbjkAZc803K2tUd8239O2rgWmzmCIUQoV3YT3m8tEZzkQyvhn+nXu422EA)

@see {@link OmitIndexSignature}
@category Object
*/
export type PickIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
		? KeyType
		: never]: ObjectType[KeyType];
};

export {};
