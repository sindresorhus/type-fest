import {expectType} from 'tsd';
import {Promisable} from '..';

declare const promisable: Promisable<string>;
expectType<PromiseLike<string> | string>(promisable);
