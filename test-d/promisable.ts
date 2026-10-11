import {expectTypeOf} from 'nz';
import type {Promisable} from '../index.d.ts';

declare const promisable: Promisable<string>;
expectTypeOf(promisable).toBe<PromiseLike<string> | string>();
