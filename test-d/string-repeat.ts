import {expectType} from 'tsd';
import type {StringRepeat} from '../index';

declare const unknown: unknown;

expectType<StringRepeat<'', 0>>('');
expectType<StringRepeat<'', -1>>(unknown as never);
expectType<StringRepeat<string, 0>>('');
expectType<StringRepeat<string, -1>>(unknown as never);
expectType<StringRepeat<'', number>>('');
expectType<StringRepeat<string, number>>(unknown as string);
expectType<StringRepeat<'0', number>>(unknown as string);
expectType<StringRepeat<'0', -1>>(unknown as never);
expectType<StringRepeat<'0', 0>>('');
expectType<StringRepeat<'0', 1>>('0');
expectType<StringRepeat<'0', 5>>('00000');
expectType<StringRepeat<'012345-', 0>>('');
expectType<StringRepeat<'012345-', 1>>('012345-');
expectType<StringRepeat<'012345-', 5>>('012345-012345-012345-012345-012345-');
