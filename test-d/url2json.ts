import { expectType, expectError } from 'tsd';
import { Url2Json } from '..';

const url = 'https://google.com?a=1&b=2';
const url2 = 'https://google.com';

declare function getQuery<S extends string>(val: S): Url2Json<S>;

expectType<{
  a: '1',
  b: '2'
}>(getQuery(url));

expectError<{
  c: '2'
}>(getQuery(url));

expectType<{}>(getQuery(url2));
expectError<{ a: '1' }>(getQuery(url2));
