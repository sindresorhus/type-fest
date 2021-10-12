import {
	expectType,
	expectAssignable,
	expectNotAssignable,
} from 'tsd';
import {OneOrMore, NOrMore} from '../index';

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
expectNotAssignable<OneOrMore<any>>(empty);
expectAssignable<OneOrMore<number>>(oneItem);
expectAssignable<OneOrMore<number>>(twoItems);
expectAssignable<OneOrMore<number>>(threeItems);
expectAssignable<OneOrMore<number>>(fourItems);
expectAssignable<OneOrMore<number>>(fiveItems);
expectAssignable<OneOrMore<number>>(sixItems);
expectAssignable<OneOrMore<number>>(sevenItems);
expectAssignable<OneOrMore<number>>(eightItems);
expectAssignable<OneOrMore<number>>(nineItems);

expectNotAssignable<OneOrMore<any>>(zeroOrMoreItems);
expectType<OneOrMore<any>>(oneOrMoreItems);
expectAssignable<OneOrMore<any>>(twoOrMoreItems);
expectAssignable<OneOrMore<any>>(threeOrMoreItems);
expectAssignable<OneOrMore<any>>(fourOrMoreItems);
expectAssignable<OneOrMore<any>>(fiveOrMoreItems);
expectAssignable<OneOrMore<any>>(sixOrMoreItems);
expectAssignable<OneOrMore<any>>(sevenOrMoreItems);
expectAssignable<OneOrMore<any>>(eightOrMoreItems);
expectAssignable<OneOrMore<any>>(nineOrMoreItems);

// NOrMore<any, 0> tests
expectAssignable<NOrMore<any, 0>>(empty);
expectAssignable<NOrMore<any, 0>>(oneItem);
expectAssignable<NOrMore<any, 0>>(twoItems);
expectAssignable<NOrMore<any, 0>>(threeItems);
expectAssignable<NOrMore<any, 0>>(fourItems);
expectAssignable<NOrMore<any, 0>>(fiveItems);
expectAssignable<NOrMore<any, 0>>(sixItems);
expectAssignable<NOrMore<any, 0>>(sevenItems);
expectAssignable<NOrMore<any, 0>>(eightItems);
expectAssignable<NOrMore<any, 0>>(nineItems);
expectType<NOrMore<any, 0>>(zeroOrMoreItems);
expectAssignable<NOrMore<any, 0>>(oneOrMoreItems);
expectAssignable<NOrMore<any, 0>>(twoOrMoreItems);
expectAssignable<NOrMore<any, 0>>(threeOrMoreItems);
expectAssignable<NOrMore<any, 0>>(fourOrMoreItems);
expectAssignable<NOrMore<any, 0>>(fiveOrMoreItems);
expectAssignable<NOrMore<any, 0>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 0>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 0>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 0>>(nineOrMoreItems);

// NOrMore<any, 1> tests
expectNotAssignable<NOrMore<any, 1>>(empty);
expectAssignable<NOrMore<any, 1>>(oneItem);
expectAssignable<NOrMore<any, 1>>(twoItems);
expectAssignable<NOrMore<any, 1>>(threeItems);
expectAssignable<NOrMore<any, 1>>(fourItems);
expectAssignable<NOrMore<any, 1>>(fiveItems);
expectAssignable<NOrMore<any, 1>>(sixItems);
expectAssignable<NOrMore<any, 1>>(sevenItems);
expectAssignable<NOrMore<any, 1>>(eightItems);
expectAssignable<NOrMore<any, 1>>(nineItems);
expectNotAssignable<NOrMore<any, 1>>(zeroOrMoreItems);
expectType<NOrMore<any, 1>>(oneOrMoreItems);
expectAssignable<NOrMore<any, 1>>(twoOrMoreItems);
expectAssignable<NOrMore<any, 1>>(threeOrMoreItems);
expectAssignable<NOrMore<any, 1>>(fourOrMoreItems);
expectAssignable<NOrMore<any, 1>>(fiveOrMoreItems);
expectAssignable<NOrMore<any, 1>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 1>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 1>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 1>>(nineOrMoreItems);

// NOrMore<any, 2> tests
expectNotAssignable<NOrMore<any, 2>>(empty);
expectNotAssignable<NOrMore<any, 2>>(oneItem);
expectAssignable<NOrMore<any, 2>>(twoItems);
expectAssignable<NOrMore<any, 2>>(threeItems);
expectAssignable<NOrMore<any, 2>>(fourItems);
expectAssignable<NOrMore<any, 2>>(fiveItems);
expectAssignable<NOrMore<any, 2>>(sixItems);
expectAssignable<NOrMore<any, 2>>(sevenItems);
expectAssignable<NOrMore<any, 2>>(eightItems);
expectAssignable<NOrMore<any, 2>>(nineItems);
expectNotAssignable<NOrMore<any, 2>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 2>>(oneOrMoreItems);
expectType<NOrMore<any, 2>>(twoOrMoreItems);
expectAssignable<NOrMore<any, 2>>(threeOrMoreItems);
expectAssignable<NOrMore<any, 2>>(fourOrMoreItems);
expectAssignable<NOrMore<any, 2>>(fiveOrMoreItems);
expectAssignable<NOrMore<any, 2>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 2>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 2>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 2>>(nineOrMoreItems);

// NOrMore<any, 3> tests
expectNotAssignable<NOrMore<any, 3>>(empty);
expectNotAssignable<NOrMore<any, 3>>(oneItem);
expectNotAssignable<NOrMore<any, 3>>(twoItems);
expectAssignable<NOrMore<any, 3>>(threeItems);
expectAssignable<NOrMore<any, 3>>(fourItems);
expectAssignable<NOrMore<any, 3>>(fiveItems);
expectAssignable<NOrMore<any, 3>>(sixItems);
expectAssignable<NOrMore<any, 3>>(sevenItems);
expectAssignable<NOrMore<any, 3>>(eightItems);
expectAssignable<NOrMore<any, 3>>(nineItems);
expectNotAssignable<NOrMore<any, 3>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 3>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 3>>(twoOrMoreItems);
expectType<NOrMore<any, 3>>(threeOrMoreItems);
expectAssignable<NOrMore<any, 3>>(fourOrMoreItems);
expectAssignable<NOrMore<any, 3>>(fiveOrMoreItems);
expectAssignable<NOrMore<any, 3>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 3>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 3>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 3>>(nineOrMoreItems);

// NOrMore<any, 4> tests
expectNotAssignable<NOrMore<any, 4>>(empty);
expectNotAssignable<NOrMore<any, 4>>(oneItem);
expectNotAssignable<NOrMore<any, 4>>(twoItems);
expectNotAssignable<NOrMore<any, 4>>(threeItems);
expectAssignable<NOrMore<any, 4>>(fourItems);
expectAssignable<NOrMore<any, 4>>(fiveItems);
expectAssignable<NOrMore<any, 4>>(sixItems);
expectAssignable<NOrMore<any, 4>>(sevenItems);
expectAssignable<NOrMore<any, 4>>(eightItems);
expectAssignable<NOrMore<any, 4>>(nineItems);
expectNotAssignable<NOrMore<any, 4>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 4>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 4>>(twoOrMoreItems);
expectNotAssignable<NOrMore<any, 4>>(threeOrMoreItems);
expectType<NOrMore<any, 4>>(fourOrMoreItems);
expectAssignable<NOrMore<any, 4>>(fiveOrMoreItems);
expectAssignable<NOrMore<any, 4>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 4>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 4>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 4>>(nineOrMoreItems);

// NOrMore<any, 5> tests
expectNotAssignable<NOrMore<any, 5>>(empty);
expectNotAssignable<NOrMore<any, 5>>(oneItem);
expectNotAssignable<NOrMore<any, 5>>(twoItems);
expectNotAssignable<NOrMore<any, 5>>(threeItems);
expectNotAssignable<NOrMore<any, 5>>(fourItems);
expectAssignable<NOrMore<any, 5>>(fiveItems);
expectAssignable<NOrMore<any, 5>>(sixItems);
expectAssignable<NOrMore<any, 5>>(sevenItems);
expectAssignable<NOrMore<any, 5>>(eightItems);
expectAssignable<NOrMore<any, 5>>(nineItems);
expectNotAssignable<NOrMore<any, 5>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 5>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 5>>(twoOrMoreItems);
expectNotAssignable<NOrMore<any, 5>>(threeOrMoreItems);
expectNotAssignable<NOrMore<any, 5>>(fourOrMoreItems);
expectType<NOrMore<any, 5>>(fiveOrMoreItems);
expectAssignable<NOrMore<any, 5>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 5>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 5>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 5>>(nineOrMoreItems);

// NOrMore<any, 6> tests
expectNotAssignable<NOrMore<any, 6>>(empty);
expectNotAssignable<NOrMore<any, 6>>(oneItem);
expectNotAssignable<NOrMore<any, 6>>(twoItems);
expectNotAssignable<NOrMore<any, 6>>(threeItems);
expectNotAssignable<NOrMore<any, 6>>(fourItems);
expectNotAssignable<NOrMore<any, 6>>(fiveItems);
expectAssignable<NOrMore<any, 6>>(sixItems);
expectAssignable<NOrMore<any, 6>>(sevenItems);
expectAssignable<NOrMore<any, 6>>(eightItems);
expectAssignable<NOrMore<any, 6>>(nineItems);
expectNotAssignable<NOrMore<any, 6>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 6>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 6>>(twoOrMoreItems);
expectNotAssignable<NOrMore<any, 6>>(threeOrMoreItems);
expectNotAssignable<NOrMore<any, 6>>(fourOrMoreItems);
expectNotAssignable<NOrMore<any, 6>>(fiveOrMoreItems);
expectType<NOrMore<any, 6>>(sixOrMoreItems);
expectAssignable<NOrMore<any, 6>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 6>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 6>>(nineOrMoreItems);

// NOrMore<any, 7> tests
expectNotAssignable<NOrMore<any, 7>>(empty);
expectNotAssignable<NOrMore<any, 7>>(oneItem);
expectNotAssignable<NOrMore<any, 7>>(twoItems);
expectNotAssignable<NOrMore<any, 7>>(threeItems);
expectNotAssignable<NOrMore<any, 7>>(fourItems);
expectNotAssignable<NOrMore<any, 7>>(fiveItems);
expectNotAssignable<NOrMore<any, 7>>(sixItems);
expectAssignable<NOrMore<any, 7>>(sevenItems);
expectAssignable<NOrMore<any, 7>>(eightItems);
expectAssignable<NOrMore<any, 7>>(nineItems);
expectNotAssignable<NOrMore<any, 7>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 7>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 7>>(twoOrMoreItems);
expectNotAssignable<NOrMore<any, 7>>(threeOrMoreItems);
expectNotAssignable<NOrMore<any, 7>>(fourOrMoreItems);
expectNotAssignable<NOrMore<any, 7>>(fiveOrMoreItems);
expectNotAssignable<NOrMore<any, 7>>(sixOrMoreItems);
expectType<NOrMore<any, 7>>(sevenOrMoreItems);
expectAssignable<NOrMore<any, 7>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 7>>(nineOrMoreItems);

// NOrMore<any, 8> tests
expectNotAssignable<NOrMore<any, 8>>(empty);
expectNotAssignable<NOrMore<any, 8>>(oneItem);
expectNotAssignable<NOrMore<any, 8>>(twoItems);
expectNotAssignable<NOrMore<any, 8>>(threeItems);
expectNotAssignable<NOrMore<any, 8>>(fourItems);
expectNotAssignable<NOrMore<any, 8>>(fiveItems);
expectNotAssignable<NOrMore<any, 8>>(sixItems);
expectNotAssignable<NOrMore<any, 8>>(sevenItems);
expectAssignable<NOrMore<any, 8>>(eightItems);
expectAssignable<NOrMore<any, 8>>(nineItems);
expectNotAssignable<NOrMore<any, 8>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(twoOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(threeOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(fourOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(fiveOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(sixOrMoreItems);
expectNotAssignable<NOrMore<any, 8>>(sevenOrMoreItems);
expectType<NOrMore<any, 8>>(eightOrMoreItems);
expectAssignable<NOrMore<any, 8>>(nineOrMoreItems);

// NOrMore<any, 9> tests
expectNotAssignable<NOrMore<any, 9>>(empty);
expectNotAssignable<NOrMore<any, 9>>(oneItem);
expectNotAssignable<NOrMore<any, 9>>(twoItems);
expectNotAssignable<NOrMore<any, 9>>(threeItems);
expectNotAssignable<NOrMore<any, 9>>(fourItems);
expectNotAssignable<NOrMore<any, 9>>(fiveItems);
expectNotAssignable<NOrMore<any, 9>>(sixItems);
expectNotAssignable<NOrMore<any, 9>>(sevenItems);
expectNotAssignable<NOrMore<any, 9>>(eightItems);
expectAssignable<NOrMore<any, 9>>(nineItems);
expectNotAssignable<NOrMore<any, 9>>(zeroOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(oneOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(twoOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(threeOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(fourOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(fiveOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(sixOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(sevenOrMoreItems);
expectNotAssignable<NOrMore<any, 9>>(eightOrMoreItems);
expectType<NOrMore<any, 9>>(nineOrMoreItems);
