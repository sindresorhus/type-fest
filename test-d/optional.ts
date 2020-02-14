import {expectType, expectError} from 'tsd';
import {Optional} from '..';

expectType<Optional<number>>(2);
expectType<Optional<number>>(undefined);
expectError<Optional<null>>(null);
expectError<Optional<string>>(2);
