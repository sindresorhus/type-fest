import type {IsEqual} from './is-equal.d.ts';
import type {Jsonify} from './jsonify.d.ts'; // For `@link`
import type {JsonPrimitive} from './json-value.d.ts';

/**
Matches an object that can be losslessly converted to JSON.

Use it instead of `Jsonifiable` when a primitive is not allowed, for example for log fields, a request body, or a config file.

It matches the value you pass to `JSON.stringify`, not the JSON it produces. An object with a `toJSON` method, like `Date`, matches even when `toJSON` returns a primitive.

Note: An `interface` is not assignable. See {@link Jsonifiable} for how to fix it. A class instance is not assignable either, unless it has a `toJSON` method.

@example
```
import type {JsonifiableObject} from 'type-fest';

function log(message: string, fields: JsonifiableObject) {
	console.log(JSON.stringify({message, fields}));
}

log('User signed in', {userId: 1, date: new Date()});

// @ts-expect-error
log('User signed in', 1);

// @ts-expect-error
log('User signed in', [1]);
```

@category JSON
*/
export type JsonifiableObject = {[Key in string]: Jsonifiable | undefined} | {toJSON: (...arguments_: any[]) => Jsonifiable};

/**
Matches an array that can be losslessly converted to JSON.

Use it instead of `Jsonifiable` when the value must be an array.

`undefined` is not allowed as an element, because `JSON.stringify([undefined])` is `[null]`.

@example
```
import type {JsonifiableArray} from 'type-fest';

function saveRows(rows: JsonifiableArray) {
	console.log(JSON.stringify(rows));
}

saveRows([{id: 1, date: new Date()}, [1, 'a']]);

// @ts-expect-error
saveRows({id: 1});

// @ts-expect-error
saveRows([1, undefined]);
```

@category JSON
*/
export type JsonifiableArray = readonly Jsonifiable[];

/**
Matches a value that can be losslessly converted to JSON.

Can be used to type values that you expect to pass to `JSON.stringify`. Use `JsonifiableObject` or `JsonifiableArray` when a primitive is not allowed.

`undefined` is allowed in object fields (for example, `{a?: number}`) as a special case even though `JSON.stringify({a: undefined})` is `{}` because it makes this class more widely useful and checking for undefined-but-present values is likely an anti-pattern.

Note: An `interface` is not assignable to `Jsonifiable`, because TypeScript does not give an interface an implicit index signature (more properties can be merged into an interface later). This also applies to a nested interface. To fix it, do one of these:
- Use a `type` alias instead.
- Make the interface extend `JsonObject`. This only works if it has no `toJSON` values, like `Date`. Optional properties then need `exactOptionalPropertyTypes`.
- Make the interface extend `Record<string, Jsonifiable | undefined>`. This allows `toJSON` values and does not need `exactOptionalPropertyTypes`.
- Use `SimplifyDeep` to transform it: `value as SimplifyDeep<SomeInterface>`. `Simplify` is not enough for a nested interface.

For a generic function that must accept any JSON-able value, use {@link JsonifiableValue} as the parameter type.

@example
```
import type {Jsonifiable} from 'type-fest';

// @ts-expect-error
const error: Jsonifiable = {
	map: new Map([['a', 1]]),
};

console.log(JSON.stringify(error)); // {"map": {}}

const good: Jsonifiable = {
	number: 3,
	date: new Date('2025-12-25'),
	missing: undefined,
};

console.log(JSON.stringify(good)); // {"number": 3, "date": "2025-12-25T00:00:00.000Z"}
```

@category JSON
*/
export type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;

/**
Matches a value of type `Value` that can be losslessly converted to JSON, including an `interface`.

{@link Jsonifiable} is a union that a value must be assignable to. An `interface` is not assignable, because it has no implicit index signature. `JsonifiableValue` takes the concrete type `Value`, keeps it, and checks its properties, so an interface works. It accepts everything `Jsonifiable` accepts, apart from a callable type without `toJSON`, and it also accepts interfaces and data-only class instances.

Use it as a parameter type, not as a constraint: `Value extends JsonifiableValue<Value>` is circular.

@example
```
import type {JsonifiableValue} from 'type-fest';

interface User {
	name: string;
	createdAt: Date;
}

function save<Value>(value: JsonifiableValue<Value>) {
	return JSON.stringify(value);
}

const user: User = {name: 'Alice', createdAt: new Date()};
save(user);

// @ts-expect-error
save({name: 'Alice', tags: new Set()});
```

Unlike {@link Jsonify}, which models the `JSON.parse` result, this type models the `JSON.stringify` input. `Jsonify` rejects `Date` and required `string | undefined` properties; this type accepts them, like `Jsonifiable`.

Note: `undefined` is allowed only in object properties, and symbol keys are ignored. `any` and `{}` pass; `object` does not, because it can be a `Map`. A union member assignable to a valid member passes, even with non-JSON properties. Private fields are not checked (`private` fields are serialized, `#private` fields are not). A `toJSON` return must be assignable to `Jsonifiable`; an array with a non-JSON-able return is checked by its elements. The check recurses, so very deep types can hit the compiler's stack limit.

@category JSON
*/
export type JsonifiableValue<Value> = Value & JsonifiableValueCheck<Value>;

// `JSON.stringify` drops object properties that are `undefined`, so `Jsonifiable` allows them. Array elements are not properties, so they stay strict.
type JsonifiableValueObjectProperty<Value> = Value extends undefined ? undefined : JsonifiableValueCheck<Value>;

// `JSON.stringify` ignores symbol keys, so they are removed instead of checked.
type JsonifiableValueObject<ObjectType extends object> = {
	[Key in keyof ObjectType as Key extends symbol ? never : Key]: JsonifiableValueObjectProperty<ObjectType[Key]>;
};

type JsonifiableValueCheck<Value> =
	Value extends JsonPrimitive
		? Value
		// `JSON.stringify` calls `toJSON` on functions and arrays too, so this comes before both. An array whose `toJSON` result is not JSON-able falls through to the array branch, which checks only its elements, the same as `Jsonifiable`.
		: Value extends {toJSON(...arguments_: any[]): Jsonifiable}
			? Value
			: Value extends Function
				? never
				: Value extends ReadonlyArray<infer Element>
					? ReadonlyArray<JsonifiableValueCheck<Element>>
					: Value extends object
						? keyof Value extends never
							// `object` has no keys, so the mapped copy would be `{}`, which every object matches. Reject the wide type, but keep `{}` and an empty interface.
							? IsEqual<Value, object> extends true
								? never
								: {}
							: JsonifiableValueObject<Value>
						: never;

export {};
