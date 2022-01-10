import {
	expectType,
	expectAssignable,
	expectNotAssignable,
} from 'tsd';
import {NonEmpty, MinimumN} from '../index';

const empty: [] = [];
const oneItem: [number] = [1];
const twoItems: [number, number] = [1, 2];
const threeItems: [number, number, number] = [1, 2, 3];
const fourItems: [number, number, number, number] = [1, 2, 3, 4];
const fiveItems: [number, number, number, number, number] = [1, 2, 3, 4, 5];
const sixItems: [number, number, number, number, number, number] = [1, 2, 3, 4, 5, 6];
const sevenItems: [number, number, number, number, number, number, number] = [1, 2, 3, 4, 5, 6, 7];
const eightItems: [number, number, number, number, number, number, number, number] = [1, 2, 3, 4, 5, 6, 7, 8];
const nineItems: [number, number, number, number, number, number, number, number, number] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

declare const zeroOrMoreItems: any[];
declare const oneOrMoreItems: [any, ...any[]];
declare const twoOrMoreItems: [any, any, ...any[]];
declare const threeOrMoreItems: [any, any, any, ...any[]];
declare const fourOrMoreItems: [any, any, any, any, ...any[]];
declare const fiveOrMoreItems: [any, any, any, any, any, ...any[]];
declare const sixOrMoreItems: [any, any, any, any, any, any, ...any[]];
declare const sevenOrMoreItems: [any, any, any, any, any, any, any, ...any[]];
declare const eightOrMoreItems: [any, any, any, any, any, any, any, any, ...any[]];
declare const nineOrMoreItems: [any, any, any, any, any, any, any, any, any, ...any[]];

// One or more tests
expectNotAssignable<NonEmpty<any>>(empty);
expectAssignable<NonEmpty<number>>(oneItem);
expectAssignable<NonEmpty<number>>(twoItems);
expectAssignable<NonEmpty<number>>(threeItems);
expectAssignable<NonEmpty<number>>(fourItems);
expectAssignable<NonEmpty<number>>(fiveItems);
expectAssignable<NonEmpty<number>>(sixItems);
expectAssignable<NonEmpty<number>>(sevenItems);
expectAssignable<NonEmpty<number>>(eightItems);
expectAssignable<NonEmpty<number>>(nineItems);

expectNotAssignable<NonEmpty<any>>(zeroOrMoreItems);
expectType<NonEmpty<any>>(oneOrMoreItems);
expectAssignable<NonEmpty<any>>(twoOrMoreItems);
expectAssignable<NonEmpty<any>>(threeOrMoreItems);
expectAssignable<NonEmpty<any>>(fourOrMoreItems);
expectAssignable<NonEmpty<any>>(fiveOrMoreItems);
expectAssignable<NonEmpty<any>>(sixOrMoreItems);
expectAssignable<NonEmpty<any>>(sevenOrMoreItems);
expectAssignable<NonEmpty<any>>(eightOrMoreItems);
expectAssignable<NonEmpty<any>>(nineOrMoreItems);

// MinimumN<any, 0> tests
expectAssignable<MinimumN<any, 0>>(empty);
expectAssignable<MinimumN<any, 0>>(oneItem);
expectAssignable<MinimumN<any, 0>>(twoItems);
expectAssignable<MinimumN<any, 0>>(threeItems);
expectAssignable<MinimumN<any, 0>>(fourItems);
expectAssignable<MinimumN<any, 0>>(fiveItems);
expectAssignable<MinimumN<any, 0>>(sixItems);
expectAssignable<MinimumN<any, 0>>(sevenItems);
expectAssignable<MinimumN<any, 0>>(eightItems);
expectAssignable<MinimumN<any, 0>>(nineItems);
expectType<MinimumN<any, 0>>(zeroOrMoreItems);
expectAssignable<MinimumN<any, 0>>(oneOrMoreItems);
expectAssignable<MinimumN<any, 0>>(twoOrMoreItems);
expectAssignable<MinimumN<any, 0>>(threeOrMoreItems);
expectAssignable<MinimumN<any, 0>>(fourOrMoreItems);
expectAssignable<MinimumN<any, 0>>(fiveOrMoreItems);
expectAssignable<MinimumN<any, 0>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 0>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 0>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 0>>(nineOrMoreItems);

// MinimumN<any, 1> tests
expectNotAssignable<MinimumN<any, 1>>(empty);
expectAssignable<MinimumN<any, 1>>(oneItem);
expectAssignable<MinimumN<any, 1>>(twoItems);
expectAssignable<MinimumN<any, 1>>(threeItems);
expectAssignable<MinimumN<any, 1>>(fourItems);
expectAssignable<MinimumN<any, 1>>(fiveItems);
expectAssignable<MinimumN<any, 1>>(sixItems);
expectAssignable<MinimumN<any, 1>>(sevenItems);
expectAssignable<MinimumN<any, 1>>(eightItems);
expectAssignable<MinimumN<any, 1>>(nineItems);
expectNotAssignable<MinimumN<any, 1>>(zeroOrMoreItems);
expectType<MinimumN<any, 1>>(oneOrMoreItems);
expectAssignable<MinimumN<any, 1>>(twoOrMoreItems);
expectAssignable<MinimumN<any, 1>>(threeOrMoreItems);
expectAssignable<MinimumN<any, 1>>(fourOrMoreItems);
expectAssignable<MinimumN<any, 1>>(fiveOrMoreItems);
expectAssignable<MinimumN<any, 1>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 1>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 1>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 1>>(nineOrMoreItems);

// MinimumN<any, 2> tests
expectNotAssignable<MinimumN<any, 2>>(empty);
expectNotAssignable<MinimumN<any, 2>>(oneItem);
expectAssignable<MinimumN<any, 2>>(twoItems);
expectAssignable<MinimumN<any, 2>>(threeItems);
expectAssignable<MinimumN<any, 2>>(fourItems);
expectAssignable<MinimumN<any, 2>>(fiveItems);
expectAssignable<MinimumN<any, 2>>(sixItems);
expectAssignable<MinimumN<any, 2>>(sevenItems);
expectAssignable<MinimumN<any, 2>>(eightItems);
expectAssignable<MinimumN<any, 2>>(nineItems);
expectNotAssignable<MinimumN<any, 2>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 2>>(oneOrMoreItems);
expectType<MinimumN<any, 2>>(twoOrMoreItems);
expectAssignable<MinimumN<any, 2>>(threeOrMoreItems);
expectAssignable<MinimumN<any, 2>>(fourOrMoreItems);
expectAssignable<MinimumN<any, 2>>(fiveOrMoreItems);
expectAssignable<MinimumN<any, 2>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 2>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 2>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 2>>(nineOrMoreItems);

// MinimumN<any, 3> tests
expectNotAssignable<MinimumN<any, 3>>(empty);
expectNotAssignable<MinimumN<any, 3>>(oneItem);
expectNotAssignable<MinimumN<any, 3>>(twoItems);
expectAssignable<MinimumN<any, 3>>(threeItems);
expectAssignable<MinimumN<any, 3>>(fourItems);
expectAssignable<MinimumN<any, 3>>(fiveItems);
expectAssignable<MinimumN<any, 3>>(sixItems);
expectAssignable<MinimumN<any, 3>>(sevenItems);
expectAssignable<MinimumN<any, 3>>(eightItems);
expectAssignable<MinimumN<any, 3>>(nineItems);
expectNotAssignable<MinimumN<any, 3>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 3>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 3>>(twoOrMoreItems);
expectType<MinimumN<any, 3>>(threeOrMoreItems);
expectAssignable<MinimumN<any, 3>>(fourOrMoreItems);
expectAssignable<MinimumN<any, 3>>(fiveOrMoreItems);
expectAssignable<MinimumN<any, 3>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 3>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 3>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 3>>(nineOrMoreItems);

// MinimumN<any, 4> tests
expectNotAssignable<MinimumN<any, 4>>(empty);
expectNotAssignable<MinimumN<any, 4>>(oneItem);
expectNotAssignable<MinimumN<any, 4>>(twoItems);
expectNotAssignable<MinimumN<any, 4>>(threeItems);
expectAssignable<MinimumN<any, 4>>(fourItems);
expectAssignable<MinimumN<any, 4>>(fiveItems);
expectAssignable<MinimumN<any, 4>>(sixItems);
expectAssignable<MinimumN<any, 4>>(sevenItems);
expectAssignable<MinimumN<any, 4>>(eightItems);
expectAssignable<MinimumN<any, 4>>(nineItems);
expectNotAssignable<MinimumN<any, 4>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 4>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 4>>(twoOrMoreItems);
expectNotAssignable<MinimumN<any, 4>>(threeOrMoreItems);
expectType<MinimumN<any, 4>>(fourOrMoreItems);
expectAssignable<MinimumN<any, 4>>(fiveOrMoreItems);
expectAssignable<MinimumN<any, 4>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 4>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 4>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 4>>(nineOrMoreItems);

// MinimumN<any, 5> tests
expectNotAssignable<MinimumN<any, 5>>(empty);
expectNotAssignable<MinimumN<any, 5>>(oneItem);
expectNotAssignable<MinimumN<any, 5>>(twoItems);
expectNotAssignable<MinimumN<any, 5>>(threeItems);
expectNotAssignable<MinimumN<any, 5>>(fourItems);
expectAssignable<MinimumN<any, 5>>(fiveItems);
expectAssignable<MinimumN<any, 5>>(sixItems);
expectAssignable<MinimumN<any, 5>>(sevenItems);
expectAssignable<MinimumN<any, 5>>(eightItems);
expectAssignable<MinimumN<any, 5>>(nineItems);
expectNotAssignable<MinimumN<any, 5>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 5>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 5>>(twoOrMoreItems);
expectNotAssignable<MinimumN<any, 5>>(threeOrMoreItems);
expectNotAssignable<MinimumN<any, 5>>(fourOrMoreItems);
expectType<MinimumN<any, 5>>(fiveOrMoreItems);
expectAssignable<MinimumN<any, 5>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 5>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 5>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 5>>(nineOrMoreItems);

// MinimumN<any, 6> tests
expectNotAssignable<MinimumN<any, 6>>(empty);
expectNotAssignable<MinimumN<any, 6>>(oneItem);
expectNotAssignable<MinimumN<any, 6>>(twoItems);
expectNotAssignable<MinimumN<any, 6>>(threeItems);
expectNotAssignable<MinimumN<any, 6>>(fourItems);
expectNotAssignable<MinimumN<any, 6>>(fiveItems);
expectAssignable<MinimumN<any, 6>>(sixItems);
expectAssignable<MinimumN<any, 6>>(sevenItems);
expectAssignable<MinimumN<any, 6>>(eightItems);
expectAssignable<MinimumN<any, 6>>(nineItems);
expectNotAssignable<MinimumN<any, 6>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 6>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 6>>(twoOrMoreItems);
expectNotAssignable<MinimumN<any, 6>>(threeOrMoreItems);
expectNotAssignable<MinimumN<any, 6>>(fourOrMoreItems);
expectNotAssignable<MinimumN<any, 6>>(fiveOrMoreItems);
expectType<MinimumN<any, 6>>(sixOrMoreItems);
expectAssignable<MinimumN<any, 6>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 6>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 6>>(nineOrMoreItems);

// MinimumN<any, 7> tests
expectNotAssignable<MinimumN<any, 7>>(empty);
expectNotAssignable<MinimumN<any, 7>>(oneItem);
expectNotAssignable<MinimumN<any, 7>>(twoItems);
expectNotAssignable<MinimumN<any, 7>>(threeItems);
expectNotAssignable<MinimumN<any, 7>>(fourItems);
expectNotAssignable<MinimumN<any, 7>>(fiveItems);
expectNotAssignable<MinimumN<any, 7>>(sixItems);
expectAssignable<MinimumN<any, 7>>(sevenItems);
expectAssignable<MinimumN<any, 7>>(eightItems);
expectAssignable<MinimumN<any, 7>>(nineItems);
expectNotAssignable<MinimumN<any, 7>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 7>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 7>>(twoOrMoreItems);
expectNotAssignable<MinimumN<any, 7>>(threeOrMoreItems);
expectNotAssignable<MinimumN<any, 7>>(fourOrMoreItems);
expectNotAssignable<MinimumN<any, 7>>(fiveOrMoreItems);
expectNotAssignable<MinimumN<any, 7>>(sixOrMoreItems);
expectType<MinimumN<any, 7>>(sevenOrMoreItems);
expectAssignable<MinimumN<any, 7>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 7>>(nineOrMoreItems);

// MinimumN<any, 8> tests
expectNotAssignable<MinimumN<any, 8>>(empty);
expectNotAssignable<MinimumN<any, 8>>(oneItem);
expectNotAssignable<MinimumN<any, 8>>(twoItems);
expectNotAssignable<MinimumN<any, 8>>(threeItems);
expectNotAssignable<MinimumN<any, 8>>(fourItems);
expectNotAssignable<MinimumN<any, 8>>(fiveItems);
expectNotAssignable<MinimumN<any, 8>>(sixItems);
expectNotAssignable<MinimumN<any, 8>>(sevenItems);
expectAssignable<MinimumN<any, 8>>(eightItems);
expectAssignable<MinimumN<any, 8>>(nineItems);
expectNotAssignable<MinimumN<any, 8>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(twoOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(threeOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(fourOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(fiveOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(sixOrMoreItems);
expectNotAssignable<MinimumN<any, 8>>(sevenOrMoreItems);
expectType<MinimumN<any, 8>>(eightOrMoreItems);
expectAssignable<MinimumN<any, 8>>(nineOrMoreItems);

// MinimumN<any, 9> tests
expectNotAssignable<MinimumN<any, 9>>(empty);
expectNotAssignable<MinimumN<any, 9>>(oneItem);
expectNotAssignable<MinimumN<any, 9>>(twoItems);
expectNotAssignable<MinimumN<any, 9>>(threeItems);
expectNotAssignable<MinimumN<any, 9>>(fourItems);
expectNotAssignable<MinimumN<any, 9>>(fiveItems);
expectNotAssignable<MinimumN<any, 9>>(sixItems);
expectNotAssignable<MinimumN<any, 9>>(sevenItems);
expectNotAssignable<MinimumN<any, 9>>(eightItems);
expectAssignable<MinimumN<any, 9>>(nineItems);
expectNotAssignable<MinimumN<any, 9>>(zeroOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(oneOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(twoOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(threeOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(fourOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(fiveOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(sixOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(sevenOrMoreItems);
expectNotAssignable<MinimumN<any, 9>>(eightOrMoreItems);
expectType<MinimumN<any, 9>>(nineOrMoreItems);
