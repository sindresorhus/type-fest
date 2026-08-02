import {expectNever, expectAssignable} from 'tsd';
import type {SingleKeyObject} from '../index.d.ts';

const test = <T>(_: SingleKeyObject<T>): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({key: 'value'});

// @ts-expect-error
test({});
// @ts-expect-error
test({key: 'value', otherKey: 'other value'});

declare const validObject: SingleKeyObject<{key: string}>;
expectAssignable<{key: string}>(validObject);

declare const invalidObject: SingleKeyObject<{key1: string; key2: number}>;
expectNever(invalidObject);
