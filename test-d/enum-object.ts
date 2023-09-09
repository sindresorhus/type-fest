import {expectType, expectError} from 'tsd';
import type {EnumObject} from '../index';

// Object
const foo: EnumObject<'id' | 'value'> = {id: 'id', value: 'value'};
expectType<EnumObject<'id' | 'value'>>(foo);

// Type example
type User = {
	userId: number;
	userName: string;
};
const result: EnumObject<keyof User> = {
	userId: 'userId',
	userName: 'userName',
};
expectType<EnumObject<keyof User>>(result);

expectError<EnumObject<'id' | 'value'>>({
	id: 'id',
	value: 'id',
});
