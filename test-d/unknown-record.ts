import {expectAssignable, expectError, expectType} from 'tsd';
import type {UnknownRecord} from '../index';

declare let foo: UnknownRecord;

expectAssignable<UnknownRecord>(foo);
expectAssignable<UnknownRecord>(foo = {});
expectAssignable<UnknownRecord>(foo = {bar: 'baz'});
expectAssignable<UnknownRecord>(foo = {bar: {baz: 'hello'}});

expectError(foo = []);
expectError(foo = 42);
expectError(foo = null);

expectType<unknown>(foo.bar);
// eslint-disable-next-line @typescript-eslint/dot-notation
expectType<unknown>(foo['bar']);
