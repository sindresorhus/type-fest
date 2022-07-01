import {expectAssignable} from 'tsd';
import {MergeDeep} from '../index';

type Foo1 = {foo: string};
type Bar1 = {foo: number};

expectAssignable<MergeDeep<Foo1, Bar1>>({foo: 42});

type Foo2 = {foo: string; life: string};
type Bar2 = {foo: number};

expectAssignable<MergeDeep<Foo2, Bar2>>({foo: 42, life: '42'});

type Foo3 = {foo: string};
type Bar3 = {foo: number; life: number};

expectAssignable<MergeDeep<Foo3, Bar3>>({foo: 42, life: 42});

type Foo4 = {foo: string; bar: undefined};
type Bar4 = {foo: number};

expectAssignable<MergeDeep<Foo4, Bar4>>({foo: 42});

type Foo5 = {foo: string};
type Bar5 = {foo: number; bar: undefined};

expectAssignable<MergeDeep<Foo5, Bar5>>({foo: 42});

type Foo6 = {foo: string; bar: {id: string}};
type Bar6 = {foo: number; bar: {id: number}};

expectAssignable<MergeDeep<Foo6, Bar6>>({foo: 42, bar: {id: 42}});

type Foo7 = {foo: string; bar: {id: string; label: string}};
type Bar7 = {foo: number; bar: {id: number}};

expectAssignable<MergeDeep<Foo7, Bar7>>({foo: 42, bar: {id: 42, label: 'life'}});

type Foo8 = {foo: string; bar: {id: string}};
type Bar8 = {foo: number; bar: {id: number; label: string}};

expectAssignable<MergeDeep<Foo8, Bar8>>({foo: 42, bar: {id: 42, label: 'life'}});

type Foo9 = {foo: string; bar: {id: string; label: string}};
type Bar9 = {foo: number; bar: {id: number; label: undefined}};

expectAssignable<MergeDeep<Foo9, Bar9>>({foo: 42, bar: {id: 42}});
expectAssignable<MergeDeep<Foo9, Bar9, {strict: false}>>({foo: 42, bar: {id: 42, label: undefined}});

type Foo10 = {foo: string; bar: {id: string; data: {x: number}}};
type Bar10 = {foo: number; bar: {id: number; data: {y: number}}};

expectAssignable<MergeDeep<Foo10, Bar10>>({foo: 42, bar: {id: 42, data: {x: 1, y: 2}}});

type Foo11 = {
	l0: string;
	a: string;
	b: {
		skipped: undefined;
		l1: string;
		x: string;
		y: {
			l2: string;
			u: string;
			v: string;
		};
	};
	q: Date;
};

type Bar11 = {
	new: number;
	a: number;
	b: {
		x: number;
		y: {
			u: number;
			v: number;
			skipped: undefined;
		};
	};
	q: {life: 42};
	skipped: undefined;
};

expectAssignable<MergeDeep<Foo11, Bar11>>({
	l0: 'string',
	a: 42,
	b: {
		l1: 'string',
		x: 42,
		y: {
			l2: 'string',
			u: 42,
			v: 42,
		},
	},
	q: {
		life: 42,
	},
	new: 42,
});

type Foo12 = {foo: false; bar: undefined; baz: boolean};
type Bar12 = {foo: number; bar: true; baz: undefined};

type FooBar12 = MergeDeep<Foo12, Bar12>;

expectAssignable<FooBar12>({foo: 42, bar: true});

type FooBar13 = MergeDeep<Foo12, Bar12, {strict: false}>;

expectAssignable<FooBar13>({foo: 42, bar: true, baz: undefined});

type Foo14 = {name: 'nyan'; level1: {plop: 42}};
type Bar14 = {level1: {level2: {level3: 42}}};

type FooBar14 = MergeDeep<Foo14, Bar14>;

expectAssignable<FooBar14>({name: 'nyan', level1: {plop: 42, level2: {level3: 42}}});

type Foo15 = {level1: {level2: {level3: 42}}};
type Bar15 = {name: 'nyan'; level1: {plop: 42}};

type FooBar15 = MergeDeep<Foo15, Bar15>;

expectAssignable<FooBar15>({name: 'nyan', level1: {plop: 42, level2: {level3: 42}}});

// Array

type Foo16 = {'a': [number, {'b': number}, {'d': number}]};
type Bar16 = {'a': [string, {'c': number}, {'e': number; d: string}]};

type FooBar16 = MergeDeep<Foo16, Bar16>;

expectAssignable<FooBar16>({a: ['42', {b: 2, c: 3}, {d: '4', e: 5}]});

type Foo17 = [number, {'b': number}, {'d': number}];
type Bar17 = [string, {'c': number}, {'e': number; d: string}];

type FooBar17 = MergeDeep<Foo17, Bar17>;

expectAssignable<FooBar17>(['42', {b: 2, c: 3}, {d: '4', e: 5}]);

type Foo18 = {'a': [number, {'b': number}, {'d': {life: string}}]};
type Bar18 = {'a': [string, {'c': number}, {'d': {life: number}}]};

type FooBar18 = MergeDeep<Foo18, Bar18>;

expectAssignable<FooBar18>({a: ['42', {b: 2, c: 3}, {d: {life: 42}}]});
