import {expectAssignable, expectNotAssignable} from 'tsd';
import type {RequireOneOrNone, Simplify} from '../index';

type OneAtMost = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>>;

expectAssignable<OneAtMost>({});
expectAssignable<OneAtMost>({foo: true});
expectAssignable<OneAtMost>({bar: true});
expectAssignable<OneAtMost>({baz: true});

expectNotAssignable<OneAtMost>({foo: true, bar: true});
expectNotAssignable<OneAtMost>({foo: true, baz: true});
expectNotAssignable<OneAtMost>({bar: true, baz: true});
expectNotAssignable<OneAtMost>({foo: true, bar: true, baz: true});

// 'foo' always required
type OneOrTwo = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>, 'bar' | 'baz'>;

expectAssignable<OneOrTwo>({foo: true});
expectAssignable<OneOrTwo>({foo: true, bar: true});
expectAssignable<OneOrTwo>({foo: true, baz: true});

expectNotAssignable<OneOrTwo>({});
expectNotAssignable<OneOrTwo>({bar: true});
expectNotAssignable<OneOrTwo>({baz: true});
expectNotAssignable<OneOrTwo>({foo: true, bar: true, baz: true});

function narrowingTest(foo: Simplify<RequireOneOrNone<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.a);

		return foo.b;
	}

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return '';
}

function narrowingTest2(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.c);

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.c);

		return foo.b;
	}

	if (typeof foo.c === 'string') {
		expectAssignable<string>(foo.c);
		expectNotAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.c;
	}

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);
	expectNotAssignable<string>(foo.c);

	return '';
}

function narrowingTest3(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.c);

		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectAssignable<string>(foo.c);

		expectAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.a);

		return foo.b;
	}

	expectAssignable<string>(foo.c);

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return '';
}
