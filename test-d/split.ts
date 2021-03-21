import {expectType} from 'tsd';
import {Split} from '../ts41';

declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

const items = 'foo,bar,baz,waldo';
const array = split(items, ',');

expectType<'foo'>(array[0]);
expectType<'bar'>(array[1]);
expectType<'baz'>(array[2]);
expectType<'waldo'>(array[3]);
