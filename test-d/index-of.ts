import {expectAssignable, expectNotAssignable} from 'tsd';
import type {IndexOf} from '../index';

type FruitIndices = IndexOf<['apple', 'banana', 'plum']>;

expectAssignable<FruitIndices>([0, 1, 2]);

expectNotAssignable<FruitIndices>(['0', '1', '2']);
expectNotAssignable<FruitIndices>(['potato', {}, 123]);
expectNotAssignable<FruitIndices>(['a', 'b']);
expectNotAssignable<FruitIndices>(['a', 'b', 'c', 'd']);

declare const fruitIndices: FruitIndices;

type FruitIndex = FruitIndices[number];

expectAssignable<FruitIndex>(fruitIndices[0]);
expectAssignable<FruitIndex>(fruitIndices[1]);
expectAssignable<FruitIndex>(fruitIndices[2]);

expectNotAssignable<FruitIndex>(3);
expectNotAssignable<FruitIndex>(-1);
expectNotAssignable<FruitIndex>(-2);
