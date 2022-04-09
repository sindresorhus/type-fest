import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {Jsonify, JsonValue} from '..';

interface A {
	a: number;
}

class B {
	a!: number;
}

interface V {
	a?: number;
}

interface X {
	a: Date;
}

interface Y {
	a?: Date;
}

interface Z {
	a: number | undefined;
}

interface W {
	a?: () => any;
}

declare const a: Jsonify<A>;
declare const b: Jsonify<B>;

declare const v: V; // Not assignable to JsonValue because it is defined as interface

declare const x: X; // Not assignable to JsonValue because it contains Date value
declare const y: Y; // Not assignable to JsonValue because it contains Date value

declare const z: Z; // Not assignable to JsonValue because undefined is not valid Json value
declare const w: W; // Not assignable to JsonValue because a function is not valid Json value

expectAssignable<JsonValue>(null);
expectAssignable<JsonValue>(false);
expectAssignable<JsonValue>(0);
expectAssignable<JsonValue>('');
expectAssignable<JsonValue>([]);
expectAssignable<JsonValue>({});
expectAssignable<JsonValue>([0]);
expectAssignable<JsonValue>({a: 0});
expectAssignable<JsonValue>(a);
expectAssignable<JsonValue>(b);
expectAssignable<JsonValue>({a: {b: true, c: {}}, d: [{}, 2, 'hi']});
expectAssignable<JsonValue>([{}, {a: 'hi'}, null, 3]);

expectNotAssignable<JsonValue>(new Date());
expectNotAssignable<JsonValue>([new Date()]);
expectNotAssignable<JsonValue>({a: new Date()});
expectNotAssignable<JsonValue>(v);
expectNotAssignable<JsonValue>(x);
expectNotAssignable<JsonValue>(y);
expectNotAssignable<JsonValue>(z);
expectNotAssignable<JsonValue>(w);
expectNotAssignable<JsonValue>(undefined);
expectNotAssignable<JsonValue>(5 as number | undefined);

interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1],
};

expectNotAssignable<JsonValue>(point);
expectAssignable<Jsonify<Geometry>>(point);

// The following const values are examples of values `v` that are not JSON, but are *jsonable* using
// `v.toJSON()` or `JSON.parse(JSON.stringify(v))`
declare const dateToJSON: Jsonify<Date>;
expectAssignable<string>(dateToJSON);
expectAssignable<JsonValue>(dateToJSON);

// The following commented `= JSON.parse(JSON.stringify(x))` is an example of how `parsedStringifiedX` could be created.
// * Note that this would be an unsafe assignment because `JSON.parse()` returns type `any`.
//   But by inspection `JSON.stringify(x)` will use `x.a.toJSON()`. So the `JSON.parse()` result can be
//   assigned to `Jsonify<X>` if the `@typescript-eslint/no-unsafe-assignment` ESLint rule is ignored
//   or an `as Jsonify<X>` is added.
// * This test is not about how `parsedStringifiedX` is created, but about its type, so the `const` value is declared.
declare const parsedStringifiedX: Jsonify<X>; // = JSON.parse(JSON.stringify(x));
expectAssignable<JsonValue>(parsedStringifiedX);
expectAssignable<string>(parsedStringifiedX.a);

class NonJsonWithToJSON {
	public fixture: Map<string, number> = new Map([['a', 1], ['b', 2]]);

	public toJSON(): {fixture: Array<[string, number]>} {
		return {
			fixture: [...this.fixture.entries()],
		};
	}
}
const nonJsonWithToJSON = new NonJsonWithToJSON();
expectNotAssignable<JsonValue>(nonJsonWithToJSON);
expectAssignable<JsonValue>(nonJsonWithToJSON.toJSON());
expectAssignable<Jsonify<NonJsonWithToJSON>>(nonJsonWithToJSON.toJSON());

class NonJsonWithInvalidToJSON {
	public fixture: Map<string, number> = new Map([['a', 1], ['b', 2]]);

	// This is intentionally invalid `.toJSON()`.
	// It is invalid because the result is not assignable to `JsonValue`.
	public toJSON(): {fixture: Map<string, number>} {
		return {
			fixture: this.fixture,
		};
	}
}

const nonJsonWithInvalidToJSON = new NonJsonWithInvalidToJSON();
expectNotAssignable<JsonValue>(nonJsonWithInvalidToJSON);
expectNotAssignable<JsonValue>(nonJsonWithInvalidToJSON.toJSON());

// Special cases of Array with `undefined` member
// `[undefined]` is not JSON because it contains non JSON value `undefined`
// However `JSON.parse(JSON.stringify())` transforms array members of `undefined` to `null`
expectNotAssignable<JsonValue>([undefined]);
declare const parsedStringifiedArrayWithUndefined1: Jsonify<undefined[]>; // = JSON.parse(JSON.stringify([undefined]));
expectType<null[]>(parsedStringifiedArrayWithUndefined1);
expectAssignable<JsonValue>(parsedStringifiedArrayWithUndefined1);
expectNotAssignable<JsonValue>([undefined, 1]);
declare const parsedStringifiedArrayWithUndefined2: Jsonify<[undefined, number]>;
expectType<Array<number | null>>(parsedStringifiedArrayWithUndefined2);
expectAssignable<JsonValue>(parsedStringifiedArrayWithUndefined2);

// Test that optional type members are not discarded wholesale.
interface OptionalPrimitive {
	a?: string;
}

interface OptionalTypeUnion {
	a?: string | (() => any);
}

interface OptionalFunction {
	a?: () => any;
}

interface NonOptionalTypeUnion {
	a: string | undefined;
}

declare const jsonifiedOptionalPrimitive: Jsonify<OptionalPrimitive>;
declare const jsonifiedOptionalTypeUnion: Jsonify<OptionalTypeUnion>;
declare const jsonifiedOptionalFunction: Jsonify<OptionalFunction>;
declare const jsonifiedNonOptionalTypeUnion: Jsonify<NonOptionalTypeUnion>;

expectType<{a?: string}>(jsonifiedOptionalPrimitive);
expectType<{a?: never}>(jsonifiedOptionalTypeUnion);
expectType<{a?: never}>(jsonifiedOptionalFunction);
expectType<{a: never}>(jsonifiedNonOptionalTypeUnion);
