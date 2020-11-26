import {Get} from '../ts41/get';
import {expectTypeOf} from 'expect-type';

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

expectTypeOf<Get<ApiResponse, 'hits.hits[0]._source.name'>>().toEqualTypeOf<Array<{given: string[]; family: string}>>();
expectTypeOf<Get<ApiResponse, 'hits.hits.0._source.name'>>().toEqualTypeOf<Array<{given: string[]; family: string}>>();

expectTypeOf<Get<ApiResponse, 'hits.someNonsense.notTheRightPath'>>().toBeUndefined();

interface WithTuples {
  foo: [
    {bar: number},
    {baz: boolean}
  ];
}

expectTypeOf<Get<WithTuples, 'foo[0].bar'>>().toBeNumber();
expectTypeOf<Get<WithTuples, 'foo.0.bar'>>().toBeNumber();

expectTypeOf<Get<WithTuples, 'foo[1].bar'>>().toBeUndefined();
expectTypeOf<Get<WithTuples, 'foo.1.bar'>>().toBeUndefined();

interface WithNumberKeys {
  foo: {
    1: {
      bar: number;
    };
  };
}

expectTypeOf<Get<WithNumberKeys, 'foo[1].bar'>>().toBeNumber();
expectTypeOf<Get<WithNumberKeys, 'foo.1.bar'>>().toBeNumber();

expectTypeOf<Get<WithNumberKeys, 'foo[2].bar'>>().toBeUndefined();
expectTypeOf<Get<WithNumberKeys, 'foo.2.bar'>>().toBeUndefined();
