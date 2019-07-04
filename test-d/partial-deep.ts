import {expectError, expectType} from 'tsd';
import {PartialDeep} from '..';

type Foo = {
    baz: string;
    bar: {
        waldo: number[];
        fred: string;
        qux: {
            corge: number;
        };
    };
};

type PartialDeepFoo = {
    baz?: string;
    bar?: {
        waldo?: number[];
        fred?: string;
        qux?: {
            corge?: number;
        };
    };
};

const partialDeep: PartialDeep<Foo> = {bar: {fred: 'thump'}};
expectType<PartialDeepFoo>(partialDeep);
expectError(expectType<Partial<Foo>>(partialDeep));
