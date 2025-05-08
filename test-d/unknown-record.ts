import {expectAssignable, expectType} from 'tsd';
import type {UnknownRecord} from '../index.d.ts';

declare let foo: UnknownRecord;

expectAssignable<UnknownRecord>(foo);
expectAssignable<UnknownRecord>(foo = {});
expectAssignable<UnknownRecord>(foo = {bar: 'baz'});
expectAssignable<UnknownRecord>(foo = {bar: {baz: 'hello'}});

// @ts-expect-error
foo = [];
// @ts-expect-error
foo = 42;
// @ts-expect-error
foo = null;

expectType<unknown>(foo['bar']);
