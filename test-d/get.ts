import {Get} from '../ts41/get';
import {expectType} from 'tsd';

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

expectType<Get<ApiResponse, 'hits.hits[0]._source.name'>>([{given: ['Homer', 'J'], family: 'Simpson'}]);
expectType<Get<ApiResponse, 'hits.hits.0._source.name'>>([{given: ['Homer', 'J'], family: 'Simpson'}]);
expectType<Get<ApiResponse, 'hits.hits[12345]._source.name'>>([{given: ['Homer', 'J'], family: 'Simpson'}]);

expectType<Get<ApiResponse, 'hits.someNonsense.notTheRightPath'>>({} as never);

interface WithTuples {
  foo: [
    {bar: number},
    {baz: boolean}
  ];
}

expectType<Get<WithTuples, 'foo[0].bar'>>(123);
expectType<Get<WithTuples, 'foo.0.bar'>>(123);

expectType<Get<WithTuples, 'foo[1].bar'>>({} as never);
expectType<Get<WithTuples, 'foo.1.bar'>>({} as never);

interface WithNumberKeys {
  foo: {
    1: {
      bar: number;
    };
  };
}

expectType<Get<WithNumberKeys, 'foo[1].bar'>>(123);
expectType<Get<WithNumberKeys, 'foo.1.bar'>>(123);

expectType<Get<WithNumberKeys, 'foo[2].bar'>>({} as never);
expectType<Get<WithNumberKeys, 'foo.2.bar'>>({} as never);
