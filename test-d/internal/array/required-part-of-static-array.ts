import {expectType} from 'tsd';
import type {RequiredPartOfStaticArray} from '../../../source/internal/array.d.ts';

expectType<RequiredPartOfStaticArray<[1, 2, 3, 4?]>>(null! as [1, 2, 3]);
expectType<RequiredPartOfStaticArray<readonly [1, 2, 3, 4?]>>(null! as [1, 2, 3]);
expectType<RequiredPartOfStaticArray<[1, 2, 3, 4?, 5?]>>(null! as [1, 2, 3]);
expectType<RequiredPartOfStaticArray<[]>>(null! as []);
