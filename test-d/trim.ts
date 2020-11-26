import {expectError, expectType} from 'tsd';
import {Trim} from '../ts41';

let leftSpaced: {withSpaces: ' foo'; trimmed: 'foo'};
let rightSpaced: {withSpaces: 'bar '; trimmed: 'bar'};
let onceSpaced: {withSpaces: ' baz '; trimmed: 'baz'};
let twiceSpaced: {withSpaces: '  waldo  '; trimmed: 'waldo'};

type TrimmedFromLeft = Trim<typeof leftSpaced.withSpaces>;
type TrimmedFromRight = Trim<typeof rightSpaced.withSpaces>;
type TrimmedOnce = Trim<typeof onceSpaced.withSpaces>;
type TrimmedTwice = Trim<typeof twiceSpaced.withSpaces>;

expectType<TrimmedFromLeft>(leftSpaced.trimmed);
expectType<TrimmedFromRight>(rightSpaced.trimmed);
expectType<TrimmedOnce>(onceSpaced.trimmed);
expectType<TrimmedTwice>(twiceSpaced.trimmed);

expectError(expectType<TrimmedFromLeft>(rightSpaced.trimmed));
expectError(expectType<TrimmedFromRight>(onceSpaced.trimmed));
expectError(expectType<TrimmedOnce>(twiceSpaced.trimmed));
expectError(expectType<TrimmedTwice>(leftSpaced.trimmed));
