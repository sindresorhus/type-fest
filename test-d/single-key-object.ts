import {expectNever, expectError, expectAssignable} from 'tsd';
import type {SingleKeyObject} from '../index';

const test = <T>(_: SingleKeyObject<T>): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({key: 'value'});

expectError(test({}));
expectError(test({key: 'value', otherKey: 'other value'}));

declare const validObject: SingleKeyObject<{key: string}>;
expectAssignable<{key: string}>(validObject);

declare const invalidObject: SingleKeyObject<{key1: string; key2: number}>;
expectNever(invalidObject);
