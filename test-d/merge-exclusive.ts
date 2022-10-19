import {expectTypeOf} from 'expect-type';
import type {MergeExclusive} from '../index';

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

expectTypeOf(exclusiveVariation1).toMatchTypeOf<{option?: string; exclusive1: boolean; exclusive2?: string}>();
expectTypeOf(exclusiveVariation2).toMatchTypeOf<{option?: string; exclusive1?: string; exclusive2: number}>();

expectTypeOf<{exclusive1: true; exclusive2: 1}>().not.toMatchTypeOf<Options>();
