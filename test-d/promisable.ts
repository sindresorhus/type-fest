import {expectTypeOf} from 'expect-type';
import type {Promisable} from '../index';

declare const promisable: Promisable<string>;
expectTypeOf(promisable).toEqualTypeOf<PromiseLike<string> | string>();
