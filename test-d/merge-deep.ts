import {expectType} from 'tsd';
import {MergeDeep} from '..';

type Foo = {
    baz: Array<{
        yowza: string;
        george: string;
    }>;
	waldo: string;
	fred: {
		['1']: number;
		['2']: string;
	};
};

type Bar = {
    baz: Array<{
        george: number;
    }>;
	waldo: number;
	fred: {
		['2']: number[];
	};
};

declare const foobar: MergeDeep<Foo, Bar>;
expectType<{
    baz: Array<{
        yowza: string;
        george: number;
    }>;
    waldo: number;
    fred: {
        ['1']: number;
        ['2']: number[];
    };
}>(foobar);
