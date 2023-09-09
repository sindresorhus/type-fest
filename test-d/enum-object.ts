import {expectType, expectError} from 'tsd';
import type {EnumObject} from '../index';

declare const foo: EnumObject<'id' | 'value'>;
expectType<{ id: 'id', value: 'value'}>(foo);

// Verify example
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
	value: 'id'
})
