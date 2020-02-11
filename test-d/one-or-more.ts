import {expectType} from 'tsd';
import {OneOrMore} from '..';

type ID = number;
type OneOrMoreIDs = OneOrMore<ID>;

expectType<OneOrMoreIDs>([1234, 2468]);
expectType<OneOrMoreIDs>(1234);
