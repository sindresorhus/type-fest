import {expectError, expectAssignable} from 'tsd';
import {MergeExclusive} from '..';

interface BaseOptions {
	option?: string;
}

interface ExclusiveVariation1 extends BaseOptions {
	exclusive1: boolean;
}

interface ExclusiveVariation2 extends BaseOptions {
	exclusive2: number;
}

type Options = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

const exclusiveVariation1: Options = {exclusive1: true};
const exclusiveVariation2: Options = {exclusive2: 1};

expectAssignable<{option?: string; exclusive1: boolean; exclusive2?: string}>(
	exclusiveVariation1
);
expectAssignable<{option?: string; exclusive1?: string; exclusive2: number}>(
	exclusiveVariation2
);

expectError<Options>({exclusive1: true, exclusive2: 1});
