import {expectType} from 'tsd-check';
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

expectType<{option?: string; exclusive1: boolean; exclusive2?: string}>(
	exclusiveVariation1
);
expectType<{option?: string; exclusive1?: string; exclusive2: number}>(
	exclusiveVariation2
);

// TODO: Enable when https://github.com/SamVerschueren/tsd-check/pull/16 is fixed
// expectError<Options>({exclusive1: true, exclusive2: 1});
