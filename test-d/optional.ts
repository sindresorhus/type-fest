import {expectType} from 'tsd';
import {Optional} from '..';

expectType<Optional<number>>(2);
expectType<Optional<number>>(undefined);
