import {Get} from '../ts41/get';
import {expectTypeOf} from 'expect-type';

declare const get: <ObjectType, Path extends string>(object: ObjectType, path: Path) => Get<ObjectType, Path>;

interface ApiResponse {
	hits: {
		hits: Array<{
			_id: string;
			_source: {
				name: Array<{
					given: string[];
					family: string;
				}>;
				birthDate: string;
			};
		}>;
	};
}

declare const apiResponse: ApiResponse;

expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name')).toEqualTypeOf<Array<{given: string[]; family: string}>>();
expectTypeOf(get(apiResponse, 'hits.hits.0._source.name')).toEqualTypeOf<Array<{given: string[]; family: string}>>();

expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name[0].given[0]')).toBeString();

// TypeScript is structurally typed. It's *possible* this value exists even though it's not on the parent interface, so the type is `unknown`.
expectTypeOf(get(apiResponse, 'hits.someNonsense.notTheRightPath')).toBeUnknown();

// This interface uses a tuple type (as opposed to an array).
interface WithTuples {
	foo: [
		{
			bar: number;
		},
		{
			baz: boolean;
		}
	];
}

expectTypeOf<Get<WithTuples, 'foo[0].bar'>>().toBeNumber();
expectTypeOf<Get<WithTuples, 'foo.0.bar'>>().toBeNumber();

expectTypeOf<Get<WithTuples, 'foo[1].baz'>>().toBeBoolean();
expectTypeOf<Get<WithTuples, 'foo[1].bar'>>().toBeUnknown();

expectTypeOf<Get<WithTuples, 'foo[-1]'>>().toBeUnknown();
expectTypeOf<Get<WithTuples, 'foo[999]'>>().toBeUnknown();

type EmptyTuple = Parameters<() => {}>;

expectTypeOf<Get<EmptyTuple, '-1'>>().toBeUnknown();
expectTypeOf<Get<EmptyTuple, '0'>>().toBeUnknown();
expectTypeOf<Get<EmptyTuple, '1'>>().toBeUnknown();
expectTypeOf<Get<EmptyTuple, 'length'>>().toEqualTypeOf<0>();

interface WithNumberKeys {
	foo: {
		1: {
			bar: number;
		};
	};
}

expectTypeOf<Get<WithNumberKeys, 'foo[1].bar'>>().toBeNumber();
expectTypeOf<Get<WithNumberKeys, 'foo.1.bar'>>().toBeNumber();

expectTypeOf<Get<WithNumberKeys, 'foo[2].bar'>>().toBeUnknown();
expectTypeOf<Get<WithNumberKeys, 'foo.2.bar'>>().toBeUnknown();

// Test `readonly`, `ReadonlyArray`, optional properties, and unions with null.

interface WithModifiers {
	foo: ReadonlyArray<{
		bar?: {
			readonly baz: {
				qux: number;
			};
		};
		abc: {
			def: {
				ghi: string;
			};
		} | null;
	}>;
}

expectTypeOf<Get<WithModifiers, 'foo[0].bar.baz'>>().toEqualTypeOf<{qux: number} | undefined>();
expectTypeOf<Get<WithModifiers, 'foo[0].abc.def.ghi'>>().toEqualTypeOf<string | undefined>();
