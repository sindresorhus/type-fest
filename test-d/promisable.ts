import {expectType} from 'tsd';
import {Promisable} from '../index';

declare const promisable: Promisable<string>;
expectType<PromiseLike<string> | string>(promisable);
