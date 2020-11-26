import {expectType} from 'tsd';
import {Split} from '../ts41';

declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

type Item = 'foo' | 'bar' | 'baz' | 'waldo';
const items = 'foo,bar,baz,waldo';
const array = split(items, ',');

expectType<Item>(array[0]);
expectType<Item>(array[1]);
expectType<Item>(array[2]);
expectType<Item>(array[3]);
