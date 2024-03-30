import {expectNever, expectError, expectAssignable} from 'tsd';
import type {SingleKey} from '../index';

const test = <T>(_: SingleKey<T>): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({key: 'value'});

expectError(test({}));
expectError(test({key: 'value', otherKey: 'other value'}));

declare const validObject: SingleKey<{key: string}>;
expectAssignable<{key: string}>(validObject);

declare const invalidObject: SingleKey<{key1: string; key2: number}>;
expectNever(invalidObject);
