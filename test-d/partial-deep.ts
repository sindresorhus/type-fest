import {expectError, expectType} from 'tsd';
import {PartialDeep} from '..';

const foo = {
    baz: 'fred',
	bar: {
        object: {key: 'value'},
        string: 'waldo',
        number: 1,
        boolean: false,
        symbol: Symbol('test'),
        null: null,
        undefined: undefined, // eslint-disable-line object-shorthand
        map: new Map<string, string>(),
        set: new Set<string>(),
        array: ['foo']
	}
};

const partialDeepFoo: PartialDeep<typeof foo> = foo;

expectError(expectType<Partial<typeof foo>>(partialDeepFoo));
expectType<object | undefined>(partialDeepFoo.bar!.object);
expectType<string | undefined>(partialDeepFoo.bar!.string);
expectType<number | undefined>(partialDeepFoo.bar!.number);
expectType<boolean | undefined>(partialDeepFoo.bar!.boolean);
expectType<symbol | undefined>(partialDeepFoo.bar!.symbol);
expectType<null | undefined>(partialDeepFoo.bar!.null);
expectType<undefined>(partialDeepFoo.bar!.undefined);
expectType<Map<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.map);
expectType<Set<string | undefined> | undefined>(partialDeepFoo.bar!.set);
expectType<string[] | undefined>(partialDeepFoo.bar!.array);
