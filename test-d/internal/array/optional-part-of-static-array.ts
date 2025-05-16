import {expectType} from 'tsd';
import type {OptionalPartOfStaticArray} from '../../../source/internal/array.js';

expectType<OptionalPartOfStaticArray<[1, 2, 3, 4?]>>(null! as [4?]);
expectType<OptionalPartOfStaticArray<readonly [1, 2, 3, 4?]>>(null! as [4?]);
expectType<OptionalPartOfStaticArray<[1, 2, 3, 4?, 5?]>>(null! as [4?, 5?]);
expectType<OptionalPartOfStaticArray<[1, 2, 3, 4?, 5?, 6?]>>(null! as [4?, 5?, 6?]);
expectType<OptionalPartOfStaticArray<[]>>(null! as []);
