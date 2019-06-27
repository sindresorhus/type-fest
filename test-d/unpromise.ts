import {expectType, expectError} from 'tsd';
import {Unpromise} from '..';

type Str = Unpromise<Promise<string>>;

declare const str: Str;
expectType<string>(str);

const test = (_: Str): void => {};
test('123');
expectError(test(123));
