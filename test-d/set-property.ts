import {expectType} from 'tsd';
import type {SetProperty} from '../source/set-property';

declare function setProperty<
	Destination extends object,
	Path extends string,
	Value,
>(destination: Destination, path: Path, value: Value): SetProperty<Destination, Path, Value>;

// Should create property
const objectData = {id: 'test'};

const numberValue = 42;
type NumberValue = typeof numberValue;

expectType<{id: string; '': NumberValue}>(setProperty(objectData, '', numberValue));
expectType<{id: string; ' ': NumberValue}>(setProperty(objectData, ' ', numberValue));
expectType<{id: string; '  ': NumberValue}>(setProperty(objectData, '  ', numberValue));

expectType<{id: string; life: NumberValue}>(setProperty(objectData, 'life', numberValue));
expectType<{id: string; life: {0: NumberValue}}>(setProperty(objectData, 'life.0', numberValue));
expectType<{id: string; life: {0: NumberValue}}>(setProperty(objectData, 'life[0]', numberValue));
expectType<{id: string; life: {is: NumberValue}}>(setProperty(objectData, 'life.is', numberValue));
expectType<{id: string; life: {is: {42: NumberValue}}}>(setProperty(objectData, 'life.is.42', numberValue));
expectType<{id: string; life: {is: {42: NumberValue}}}>(setProperty(objectData, 'life.is[42]', numberValue));

expectType<{id: string; dot: {dot: {dot: NumberValue}}}>(setProperty(objectData, 'dot.dot.dot', numberValue));
expectType<{id: string; 'dot.dot': {'dot': NumberValue}}>(setProperty(objectData, 'dot\\.dot.dot', numberValue));
expectType<{id: string; dot: {'dot.dot': NumberValue}}>(setProperty(objectData, 'dot.dot\\.dot', numberValue));
expectType<{id: string; 'dot.dot.dot': NumberValue}>(setProperty(objectData, 'dot\\.dot\\.dot', numberValue));

expectType<{id: string; 0: NumberValue}>(setProperty(objectData, '0', numberValue));
expectType<{id: string; 1: NumberValue}>(setProperty(objectData, '1', numberValue));
expectType<{id: string; 0: NumberValue}>(setProperty(objectData, '[0]', numberValue));
expectType<{id: string; 1: NumberValue}>(setProperty(objectData, '[1]', numberValue));
expectType<{id: string; 0: {1: NumberValue}}>(setProperty(objectData, '0[1]', numberValue));
expectType<{id: string; 1: {0: NumberValue}}>(setProperty(objectData, '[1].0', numberValue));
expectType<{id: string; 0: {1: NumberValue}}>(setProperty(objectData, '[0][1]', numberValue));
expectType<{id: string; 1: {0: NumberValue}}>(setProperty(objectData, '[1][0]', numberValue));

// Const test1 = setProperty({}, '0', value);
// const test2 = setProperty({}, '1', value);
// const test3 = setProperty({}, '[0]', value);
// const test4 = setProperty({}, '[1]', value);
// const test5 = setProperty({0: 'zero', 1: 'one'}, '0', value);
// const test6 = setProperty({0: 'zero', 1: 'one'}, '1', value);
// const test7 = setProperty({0: 'zero', 1: 'one'}, '[0]', value); // {"0":42,"1":"one"}
// const test8 = setProperty({0: 'zero', 1: 'one'}, '[1]', value); // {"0":"zero","1":42}

// const test9 = setProperty([], '0', value); // Error: Cannot use string index
// const test10 = setProperty([], '1', value); // Error: Cannot use string index
// const test11 = setProperty([], '[0]', value); // [42]
// const test12 = setProperty([], '[1]', value); // [null,42]
// const test13 = setProperty(['zero', 'one'], '0', value); // Error: Cannot use string index
// const test14 = setProperty(['zero', 'one'], '1', value); // Error: Cannot use string index
// const test15 = setProperty(['zero', 'one'], '[0]', value); // [42,"one"]
// const test16 = setProperty(['zero', 'one'], '[1]', value); // ["zero",42]

// const test = setProperty({a: 'a', 1: {b: 'b'}}, '1.2\\.3.4', value);
// const test = setProperty({a: 'a', 1: {b: 'b', c: 'c'}}, '1.b.4.5', value);
