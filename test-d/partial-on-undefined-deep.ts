import {expectType} from 'tsd';
import type {PartialOnUndefinedDeep} from '../index';

declare const foo: PartialOnUndefinedDeep<{
  func: (() => void) | undefined;
  obj: {objKey: 1} | undefined;
  objDeep: {
    subObj: string | undefined;
  };
  str: string | undefined;
  union: 'test1' | 'test2' | undefined;
  number: number | undefined;
  bool: boolean | undefined;
  date: Date | undefined;
  regexp: RegExp | undefined;
  symbol: Symbol | undefined;
  null: null | undefined;
  record: Record<string, any> | undefined;
  map: Map<string, string> | undefined;
  set: Set<string> | undefined;
  array: any[] | undefined;
  tuple: ['test1'] | undefined;
  readonly: readonly string[] | undefined;
}>;

expectType<{
  func?: typeof foo['func'];
  obj?: typeof foo['obj'];
  objDeep: {
    subObj?: typeof foo['objDeep']['subObj'];
  };
  str?: typeof foo['str'];
  union?: typeof foo['union'];
  number?: typeof foo['number'];
  bool?: typeof foo['bool'];
  date?: typeof foo['date'];
  regexp?: typeof foo['regexp'];
  symbol?: typeof foo['symbol'];
  null?: typeof foo['null'];
  record?: typeof foo['record'];
  map?: typeof foo['map'];
  set?: typeof foo['set'];
  array?: typeof foo['array'];
  tuple?: typeof foo['tuple'];
  readonly?: typeof foo['readonly'];
}>(foo);
