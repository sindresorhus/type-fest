import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {Destructurable} from '../index.d.ts';

type Success = {
	type: 'success';
	value: number;
};

type Failure = {
	type: 'failure';
	error: Error;
};

type Result = Destructurable<Success | Failure>;

declare const result: Result;

// The union can be destructured directly, so every key is accessible.
const {type, value, error} = result;
expectType<'success' | 'failure'>(type);
expectAssignable<number | undefined>(value);
expectAssignable<Error | undefined>(error);

// Narrowing on the discriminant still works, keeping the original members intact.
if (result.type === 'success') {
	expectType<number>(result.value);
	expectType<undefined>(result.error);
} else {
	expectType<Error>(result.error);
	expectType<undefined>(result.value);
}

// Each original member is still assignable to the result.
expectAssignable<Result>({type: 'success', value: 1});
expectAssignable<Result>({type: 'failure', error: new Error('failed')});

// Members cannot be mixed together.
expectNotAssignable<Result>({type: 'success', value: 1, error: new Error('failed')});

// A single, non-union object is passed through unchanged and stays destructurable.
type Single = Destructurable<{a: number; b: string}>;
declare const single: Single;
const {a, b} = single;
expectType<number>(a);
expectType<string>(b);
expectType<{a: number; b: string}>(single);

// Three members: each gains the keys of the others as optional.
type A = {tag: 'a'; a: number};
type B = {tag: 'b'; b: string};
type C = {tag: 'c'; c: boolean};
type Three = Destructurable<A | B | C>;
declare const three: Three;
const {a: threeA, b: threeB, c: threeC} = three;
expectAssignable<number | undefined>(threeA);
expectAssignable<string | undefined>(threeB);
expectAssignable<boolean | undefined>(threeC);
