import {expectType} from 'tsd';
import type {KeyAsString} from '../source/key-as-string.d.ts';

declare const foo: KeyAsString<{
	1: number;
	stringKey: string;
}>;

expectType<'1' | 'stringKey'>(foo);
