import {expectType} from 'tsd-check';
import {Partial} from '..';

declare const partial: Partial<{a: number; b: string}>;
expectType<{a?: number; b?: string}>(partial);
