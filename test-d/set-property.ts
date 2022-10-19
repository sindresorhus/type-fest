import {expectType} from 'tsd';
import type {SetProperty} from '../source/set-property';

// Test helper
declare function setProperty<
	Destination extends object,
	Path extends string,
	Value,
>(destination: Destination, path: Path, value: Value): SetProperty<Destination, Path, typeof value>;

type Value = number;
declare const value: Value;

// Property does not exist
expectType<{foo: Value}>(setProperty({}, 'foo', value));
expectType<{foo: {bar: Value}}>(setProperty({foo: 'foo'}, 'foo.bar', value));
expectType<{foo: string; bar: Value}>(setProperty({foo: 'foo'}, 'bar', value));
expectType<{foo: {bar: Value}; biz: string}>(setProperty({foo: 'foo', biz: 'biz'}, 'foo.bar', value));
expectType<{foo: string; bar: {baz: string; biz: Value}}>(setProperty({foo: 'foo', bar: {baz: 'baz'}}, 'bar.biz', value));

expectType<{0: Value}>(setProperty({}, '0', value));
expectType<{0: Value}>(setProperty({}, '[0]', value));
expectType<{foo: {0: Value}}>(setProperty({foo: 'foo'}, 'foo.0', value));
expectType<{foo: {0: Value; bar: string}}>(setProperty({foo: {bar: 'bar'}}, 'foo[0]', value));

// Property exist
expectType<{foo: Value}>(setProperty({foo: 'foo'}, 'foo', value));
expectType<{foo: {bar: Value}}>(setProperty({foo: {bar: 'bar'}}, 'foo.bar', value));
expectType<{foo: string; bar: Value}>(setProperty({foo: 'foo', bar: 'bar'}, 'bar', value));
expectType<{foo: string; bar: {baz: Value}}>(setProperty({foo: 'foo', bar: {baz: 'baz'}}, 'bar.baz', value));
expectType<{foo: string; bar: {baz: string; biz: Value}}>(setProperty({foo: 'foo', bar: {baz: 'baz', biz: 'biz'}}, 'bar.biz', value));

expectType<{0: Value}>(setProperty({0: 'zero'}, '0', value));
expectType<{0: Value}>(setProperty({0: 'zero'}, '[0]', value));
expectType<{foo: {0: Value}}>(setProperty({foo: {0: 'zero'}}, 'foo.0', value));
expectType<{foo: {0: Value; bar: string}}>(setProperty({foo: {0: 'zero', bar: 'bar'}}, 'foo[0]', value));

// Cannot use string index on array/tuple
expectType<never>(setProperty([], '0', value));

// Element does not exist
declare const emptyArray: never[];

expectType<Value[]>(setProperty(emptyArray, '[0]', value));
expectType<Value[][]>(setProperty(emptyArray, '[0][0]', value));
expectType<Array<Value | null>>(setProperty(emptyArray, '[1]', value));
expectType<Array<Value[] | null>>(setProperty(emptyArray, '[1][0]', value));
expectType<Array<Array<Value | null>>>(setProperty(emptyArray, '[0][1]', value));
expectType<Array<Array<Value | null> | null>>(setProperty(emptyArray, '[1][1]', value));

expectType<Array<{foo: Value}>>(setProperty(emptyArray, '[0].foo', value));
expectType<Array<{foo: Value} | null>>(setProperty(emptyArray, '[1].foo', value));
expectType<Array<Array<{foo: Value}>>>(setProperty(emptyArray, '[0][0].foo', value));
expectType<Array<Array<{foo: Value} | null>>>(setProperty(emptyArray, '[0][1].foo', value));
expectType<Array<Array<{1: Value} | null>>>(setProperty(emptyArray, '[0][1].1', value));

expectType<{foo: Value[]}>(setProperty({foo: emptyArray}, 'foo[0]', value));
expectType<{foo: Value[][]}>(setProperty({foo: emptyArray}, 'foo[0][0]', value));
expectType<{foo: Array<Value | null>}>(setProperty({foo: emptyArray}, 'foo[1]', value));
expectType<{foo: Array<Value[] | null>}>(setProperty({foo: emptyArray}, 'foo[1][0]', value));

expectType<{foo: Value[]}>(setProperty({foo: 'foo'}, 'foo[0]', value));
expectType<{foo: Value[][]}>(setProperty({foo: 'foo'}, 'foo[0][0]', value));
expectType<{foo: Array<Value | null>}>(setProperty({foo: 'foo'}, 'foo[1]', value));
expectType<{foo: Array<Value[] | null>}>(setProperty({foo: 'foo'}, 'foo[1][0]', value));

// Element exist
declare const stringArray: string[];

expectType<Array<string | Value>>(setProperty(stringArray, '[0]', value));
expectType<Array<string | Value[]>>(setProperty(stringArray, '[0][0]', value));
expectType<Array<string | Value | null>>(setProperty(stringArray, '[1]', value));
expectType<Array<string | Value[] | null>>(setProperty(stringArray, '[1][0]', value));
expectType<Array<string | Array<Value | null>>>(setProperty(stringArray, '[0][1]', value));
expectType<Array<string | Array<Value | null> | null>>(setProperty(stringArray, '[1][1]', value));

expectType<Array<string | {foo: number}>>(setProperty(stringArray, '[0].foo', value));
expectType<Array<string | {foo: number} | null>>(setProperty(stringArray, '[1].foo', value));
expectType<Array<string | Array<{foo: number}>>>(setProperty(stringArray, '[0][0].foo', value));
expectType<Array<string | Array<{foo: number} | null>>>(setProperty(stringArray, '[0][1].foo', value));
expectType<Array<string | Array<{1: number} | null>>>(setProperty(stringArray, '[0][1].1', value));

expectType<{foo: Array<string | number>}>(setProperty({foo: stringArray}, 'foo[0]', value));
expectType<{foo: Array<string | number[]>}>(setProperty({foo: stringArray}, 'foo[0][0]', value));
expectType<{foo: Array<string | number | null>}>(setProperty({foo: stringArray}, 'foo[1]', value));
expectType<{foo: Array<string | number[] | null>}>(setProperty({foo: stringArray}, 'foo[1][0]', value));
