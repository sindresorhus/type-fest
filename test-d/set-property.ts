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

// Property does not exists
expectType<{foo: Value}>(setProperty({}, 'foo', value));
expectType<{foo: {bar: Value}}>(setProperty({foo: 'foo'}, 'foo.bar', value));
expectType<{foo: string; bar: Value}>(setProperty({foo: 'foo'}, 'bar', value));
expectType<{foo: {bar: Value}; biz: string}>(setProperty({foo: 'foo', biz: 'biz'}, 'foo.bar', value));
expectType<{foo: string; bar: {baz: string; biz: Value}}>(setProperty({foo: 'foo', bar: {baz: 'baz'}}, 'bar.biz', value));

expectType<{0: Value}>(setProperty({}, '0', value));
expectType<{0: Value}>(setProperty({}, '[0]', value));
expectType<{foo: {0: Value}}>(setProperty({foo: 'foo'}, 'foo.0', value));
expectType<{foo: {0: Value; bar: string}}>(setProperty({foo: {bar: 'bar'}}, 'foo[0]', value));

// Property exists
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

// Element does not exists
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

// Element possibly exists
declare const stringArray: string[];

expectType<Array<string | Value>>(setProperty(stringArray, '[0]', value));
expectType<Array<string | Value[]>>(setProperty(stringArray, '[0][0]', value));
expectType<Array<string | Value | null>>(setProperty(stringArray, '[1]', value));
expectType<Array<string | Value[] | null>>(setProperty(stringArray, '[1][0]', value));
expectType<Array<string | Array<Value | null>>>(setProperty(stringArray, '[0][1]', value));
expectType<Array<string | Array<Value | null> | null>>(setProperty(stringArray, '[1][1]', value));

expectType<Array<string | {foo: Value}>>(setProperty(stringArray, '[0].foo', value));
expectType<Array<string | {foo: Value} | null>>(setProperty(stringArray, '[1].foo', value));
expectType<Array<string | Array<{foo: Value}>>>(setProperty(stringArray, '[0][0].foo', value));
expectType<Array<string | Array<{foo: Value} | null>>>(setProperty(stringArray, '[0][1].foo', value));
expectType<Array<string | Array<{1: Value} | null>>>(setProperty(stringArray, '[0][1].1', value));

expectType<{foo: Array<string | Value>}>(setProperty({foo: stringArray}, 'foo[0]', value));
expectType<{foo: Array<string | Value[]>}>(setProperty({foo: stringArray}, 'foo[0][0]', value));
expectType<{foo: Array<string | Value | null>}>(setProperty({foo: stringArray}, 'foo[1]', value));
expectType<{foo: Array<string | Value[] | null>}>(setProperty({foo: stringArray}, 'foo[1][0]', value));

// Should work on readonly array
declare const readonlyStringArray: readonly string[];

expectType<ReadonlyArray<string | Value>>(setProperty(readonlyStringArray, '[0]', value));
expectType<ReadonlyArray<string | {foo: Value}>>(setProperty(readonlyStringArray, '[0].foo', value));
expectType<{foo: ReadonlyArray<string | Value>}>(setProperty({foo: readonlyStringArray}, 'foo[0]', value));

// Should work on empty tuple
declare const emptyTuple: [];

expectType<[Value]>(setProperty(emptyTuple, '[0]', value));
expectType<[null, Value]>(setProperty(emptyTuple, '[1]', value));
expectType<[null, null, Value]>(setProperty(emptyTuple, '[2]', value));

expectType<[Value[]]>(setProperty(emptyTuple, '[0][0]', value));
expectType<[Array<number | null>]>(setProperty(emptyTuple, '[0][1]', value));
expectType<[Array<number | null>]>(setProperty(emptyTuple, '[0][2]', value));

expectType<[null, Value[]]>(setProperty(emptyTuple, '[1][0]', value));
expectType<[null, Array<number | null>]>(setProperty(emptyTuple, '[1][1]', value));
expectType<[null, Array<number | null>]>(setProperty(emptyTuple, '[1][2]', value));

expectType<[null, null, Value[]]>(setProperty(emptyTuple, '[2][0]', value));
expectType<[null, null, Array<number | null>]>(setProperty(emptyTuple, '[2][1]', value));
expectType<[null, null, Array<number | null>]>(setProperty(emptyTuple, '[2][2]', value));

// Should work on not empty tuple
declare const stringTuple: ['zero', 'one'];

expectType<[Value, 'one']>(setProperty(stringTuple, '[0]', value));
expectType<['zero', Value]>(setProperty(stringTuple, '[1]', value));
expectType<['zero', 'one', Value]>(setProperty(stringTuple, '[2]', value));
expectType<['zero', 'one', null, Value]>(setProperty(stringTuple, '[3]', value));
expectType<['zero', 'one', null, null, Value]>(setProperty(stringTuple, '[4]', value));

// Should work on not empty readonly tuple
declare const readonlyStringTuple: readonly ['zero', 'one'];

expectType<readonly [Value, 'one']>(setProperty(readonlyStringTuple, '[0]', value));
expectType<readonly ['zero', Value]>(setProperty(readonlyStringTuple, '[1]', value));
expectType<readonly ['zero', 'one', Value]>(setProperty(readonlyStringTuple, '[2]', value));
expectType<readonly ['zero', 'one', null, Value]>(setProperty(readonlyStringTuple, '[3]', value));
expectType<readonly ['zero', 'one', null, null, Value]>(setProperty(readonlyStringTuple, '[4]', value));

// Test escaped path
expectType<{foo: string; dot: {dot: {dot: number}}}>(setProperty({foo: 'foo'}, 'dot.dot.dot', value));
expectType<{foo: string; 'dot.dot': {'dot': number}}>(setProperty({foo: 'foo'}, 'dot\\.dot.dot', value));
expectType<{foo: string; dot: {'dot.dot': number}}>(setProperty({foo: 'foo'}, 'dot.dot\\.dot', value));
expectType<{foo: string; 'dot.dot.dot': number}>(setProperty({foo: 'foo'}, 'dot\\.dot\\.dot', value));
