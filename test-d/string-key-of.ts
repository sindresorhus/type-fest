import {expectType} from 'tsd';
import type {StringKeyOf} from '../index';

declare const foo: StringKeyOf<{
	1: number;
	stringKey: string;
}>;

expectType<'1' | 'stringKey'>(foo);
