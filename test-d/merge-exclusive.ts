import {expectNotAssignable, expectAssignable} from 'tsd';
import type {MergeExclusive} from '../index.d.ts';

type BaseOptions = {
	option?: string;
};

type ExclusiveVariation1 = {
	exclusive1: boolean;
} & BaseOptions;

type ExclusiveVariation2 = {
	exclusive2: number;
} & BaseOptions;

type Options = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

const exclusiveVariation1: Options = {exclusive1: true};
const exclusiveVariation2: Options = {exclusive2: 1};

expectAssignable<{option?: string; exclusive1: boolean; exclusive2?: string}>(
	exclusiveVariation1,
);
expectAssignable<{option?: string; exclusive1?: string; exclusive2: number}>(
	exclusiveVariation2,
);

expectNotAssignable<Options>({exclusive1: true, exclusive2: 1});
