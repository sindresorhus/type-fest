import {expectTypeOf} from 'nz';
import type {Words} from '../source/words.d.ts';
import type {Tagged} from '../source/tagged.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';

expectTypeOf<Words<''>>().toBe<[]>();
expectTypeOf<Words<'a'>>().toBe<['a']>();
expectTypeOf<Words<'B'>>().toBe<['B']>();
expectTypeOf<Words<'aa'>>().toBe<['aa']>();
expectTypeOf<Words<'aB'>>().toBe<['a', 'B']>();
expectTypeOf<Words<'Ba'>>().toBe<['Ba']>();
expectTypeOf<Words<'BB'>>().toBe<['BB']>();
expectTypeOf<Words<'aaa'>>().toBe<['aaa']>();
expectTypeOf<Words<'aaB'>>().toBe<['aa', 'B']>();
expectTypeOf<Words<'aBa'>>().toBe<['a', 'Ba']>();
expectTypeOf<Words<'aBB'>>().toBe<['a', 'BB']>();
expectTypeOf<Words<'Baa'>>().toBe<['Baa']>();
expectTypeOf<Words<'BaB'>>().toBe<['Ba', 'B']>();
expectTypeOf<Words<'BBa'>>().toBe<['B', 'Ba']>();
expectTypeOf<Words<'BBB'>>().toBe<['BBB']>();
expectTypeOf<Words<'aaaa'>>().toBe<['aaaa']>();
expectTypeOf<Words<'aaaB'>>().toBe<['aaa', 'B']>();
expectTypeOf<Words<'aaBa'>>().toBe<['aa', 'Ba']>();
expectTypeOf<Words<'aaBB'>>().toBe<['aa', 'BB']>();
expectTypeOf<Words<'aBaa'>>().toBe<['a', 'Baa']>();
expectTypeOf<Words<'aBaB'>>().toBe<['a', 'Ba', 'B']>();
expectTypeOf<Words<'aBBa'>>().toBe<['a', 'B', 'Ba']>();
expectTypeOf<Words<'aBBB'>>().toBe<['a', 'BBB']>();
expectTypeOf<Words<'Baaa'>>().toBe<['Baaa']>();
expectTypeOf<Words<'BaaB'>>().toBe<['Baa', 'B']>();
expectTypeOf<Words<'BaBa'>>().toBe<['Ba', 'Ba']>();
expectTypeOf<Words<'BaBB'>>().toBe<['Ba', 'BB']>();
expectTypeOf<Words<'BBaa'>>().toBe<['B', 'Baa']>();
expectTypeOf<Words<'BBaB'>>().toBe<['B', 'Ba', 'B']>();
expectTypeOf<Words<'BBBa'>>().toBe<['BB', 'Ba']>();
expectTypeOf<Words<'BBBB'>>().toBe<['BBBB']>();
expectTypeOf<Words<'aaaaa'>>().toBe<['aaaaa']>();
expectTypeOf<Words<'aaaaB'>>().toBe<['aaaa', 'B']>();
expectTypeOf<Words<'aaaBa'>>().toBe<['aaa', 'Ba']>();
expectTypeOf<Words<'aaaBB'>>().toBe<['aaa', 'BB']>();
expectTypeOf<Words<'aaBaa'>>().toBe<['aa', 'Baa']>();
expectTypeOf<Words<'aaBaB'>>().toBe<['aa', 'Ba', 'B']>();
expectTypeOf<Words<'aaBBa'>>().toBe<['aa', 'B', 'Ba']>();
expectTypeOf<Words<'aaBBB'>>().toBe<['aa', 'BBB']>();
expectTypeOf<Words<'aBaaa'>>().toBe<['a', 'Baaa']>();
expectTypeOf<Words<'aBaaB'>>().toBe<['a', 'Baa', 'B']>();
expectTypeOf<Words<'aBaBa'>>().toBe<['a', 'Ba', 'Ba']>();
expectTypeOf<Words<'aBaBB'>>().toBe<['a', 'Ba', 'BB']>();
expectTypeOf<Words<'aBBaa'>>().toBe<['a', 'B', 'Baa']>();
expectTypeOf<Words<'aBBaB'>>().toBe<['a', 'B', 'Ba', 'B']>();
expectTypeOf<Words<'aBBBa'>>().toBe<['a', 'BB', 'Ba']>();
expectTypeOf<Words<'aBBBB'>>().toBe<['a', 'BBBB']>();
expectTypeOf<Words<'Baaaa'>>().toBe<['Baaaa']>();
expectTypeOf<Words<'BaaaB'>>().toBe<['Baaa', 'B']>();
expectTypeOf<Words<'BaaBa'>>().toBe<['Baa', 'Ba']>();
expectTypeOf<Words<'BaaBB'>>().toBe<['Baa', 'BB']>();
expectTypeOf<Words<'BaBaa'>>().toBe<['Ba', 'Baa']>();
expectTypeOf<Words<'BaBaB'>>().toBe<['Ba', 'Ba', 'B']>();
expectTypeOf<Words<'BaBBa'>>().toBe<['Ba', 'B', 'Ba']>();
expectTypeOf<Words<'BaBBB'>>().toBe<['Ba', 'BBB']>();
expectTypeOf<Words<'BBaaa'>>().toBe<['B', 'Baaa']>();
expectTypeOf<Words<'BBaaB'>>().toBe<['B', 'Baa', 'B']>();
expectTypeOf<Words<'BBaBa'>>().toBe<['B', 'Ba', 'Ba']>();
expectTypeOf<Words<'BBaBB'>>().toBe<['B', 'Ba', 'BB']>();
expectTypeOf<Words<'BBBaa'>>().toBe<['BB', 'Baa']>();
expectTypeOf<Words<'BBBaB'>>().toBe<['BB', 'Ba', 'B']>();
expectTypeOf<Words<'BBBBa'>>().toBe<['BBB', 'Ba']>();
expectTypeOf<Words<'BBBBB'>>().toBe<['BBBBB']>();

expectTypeOf<Words<'hello world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'Hello-world'>>().toBe<['Hello', 'world']>();
expectTypeOf<Words<'hello_world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'hello  world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'Hello--world'>>().toBe<['Hello', 'world']>();
expectTypeOf<Words<'hello__world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'   hello  world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'---Hello--world'>>().toBe<['Hello', 'world']>();
expectTypeOf<Words<'___hello__world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'hello  world   '>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'hello\tworld'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'Hello--world--'>>().toBe<['Hello', 'world']>();
expectTypeOf<Words<'hello__world___'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'___ hello -__  _world'>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'__HelloWorld-HELLOWorld helloWORLD'>>().toBe<['Hello', 'World', 'HELLO', 'World', 'hello', 'WORLD']>();
expectTypeOf<Words<'hello WORLD lowercase'>>().toBe<['hello', 'WORLD', 'lowercase']>();
expectTypeOf<Words<'hello WORLD-lowercase'>>().toBe<['hello', 'WORLD', 'lowercase']>();
expectTypeOf<Words<'hello WORLD Uppercase'>>().toBe<['hello', 'WORLD', 'Uppercase']>();

expectTypeOf<Words<'item0'>>().toBe<['item', '0']>();
expectTypeOf<Words<'item01'>>().toBe<['item', '01']>();
expectTypeOf<Words<'item10'>>().toBe<['item', '10']>();
expectTypeOf<Words<'item010'>>().toBe<['item', '010']>();
expectTypeOf<Words<'0item0'>>().toBe<['0', 'item', '0']>();
expectTypeOf<Words<'01item01'>>().toBe<['01', 'item', '01']>();
expectTypeOf<Words<'10item10'>>().toBe<['10', 'item', '10']>();
expectTypeOf<Words<'010item010'>>().toBe<['010', 'item', '010']>();
expectTypeOf<Words<'item0_item_1 item -2'>>().toBe<['item', '0', 'item', '1', 'item', '2']>();

// SplitOnPunctuation

// Without `splitOnPunctuation`, punctuation is not a word boundary, so it stays inside the word. Splitting on it there was a side effect of punctuation matching both case predicates, which also made every non-ASCII character start a new word.
expectTypeOf<Words<':'>>().toBe<[':']>();
expectTypeOf<Words<'::'>>().toBe<['::']>();
expectTypeOf<Words<'hello::'>>().toBe<['hello::']>();
expectTypeOf<Words<'hello:world'>>().toBe<['hello:world']>();
expectTypeOf<Words<'hello::world'>>().toBe<['hello::world']>();
expectTypeOf<Words<'hello-braveNew:world'>>().toBe<['hello', 'brave', 'New:world']>();

// A character with no case at all, such as a Han character or an emoji, is part of the surrounding word.
expectTypeOf<Words<'日本語テキスト'>>().toBe<['日本語テキスト']>();
expectTypeOf<Words<'a日b'>>().toBe<['a日b']>();
expectTypeOf<Words<'Hello世界'>>().toBe<['Hello世界']>();

// An acronym keeps its last capital when the next character is not a lowercase letter, such as punctuation or a character with no case.
expectTypeOf<Words<'FOO:bar'>>().toBe<['FOO:bar']>();
expectTypeOf<Words<'FOO:bar', {splitOnPunctuation: true}>>().toBe<['FOO', 'bar']>();
expectTypeOf<Words<'HELLO世界'>>().toBe<['HELLO世界']>();
expectTypeOf<Words<'parseJSON😀'>>().toBe<['parse', 'JSON😀']>();
expectTypeOf<Words<'userID?'>>().toBe<['user', 'ID?']>();

expectTypeOf<Words<':', {splitOnPunctuation: true}>>().toBe<[]>();
expectTypeOf<Words<'::', {splitOnPunctuation: true}>>().toBe<[]>();
expectTypeOf<Words<'hello::', {splitOnPunctuation: true}>>().toBe<['hello']>();
expectTypeOf<Words<'hello:world', {splitOnPunctuation: true}>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'hello::world', {splitOnPunctuation: true}>>().toBe<['hello', 'world']>();
expectTypeOf<Words<'hello-braveNew:world', {splitOnPunctuation: true}>>().toBe<['hello', 'brave', 'New', 'world']>();
expectTypeOf<Words<'item::01', {splitOnPunctuation: true; splitOnNumbers: false}>>().toBe<['item', '01']>();
expectTypeOf<Words<'item::01', {splitOnPunctuation: true; splitOnNumbers: true}>>().toBe<['item', '01']>();

// A string type with an infinite set of possible values cannot be split, so it yields `string[]`, like the other string utilities do.
expectTypeOf([] as string[]).toBe<Words<string>>();
expectTypeOf([] as string[]).toBe<Words<Uppercase<string>>>();
expectTypeOf([] as string[]).toBe<Words<Lowercase<string>>>();
expectTypeOf([] as string[]).toBe<Words<`${string}b`>>();
expectTypeOf([] as string[]).toBe<Words<`a${string}b`>>();
expectTypeOf([] as string[]).toBe<Words<`${string}-${string}`>>();

// A union distributes, so the infinite member widens the result while the literal members are still split. The infinite member must not be `string`, because `'a-b' | string` collapses to `string`.
expectTypeOf<Words<'a-b' | `x${string}`>>().toBe<string[] | ['a', 'b']>();

// A branded or tagged string is still a finite string literal, so it is walked like any other.
expectTypeOf<Words<Tagged<'a-b', 'x'>>>().toBe<['a', 'b']>();
expectTypeOf<Words<Tagged<'helloWorld', 'x'>>>().toBe<['hello', 'World']>();
expectTypeOf<Words<'a-b' & {readonly __brand: 'x'}>>().toBe<['a', 'b']>();

// A capital letter starts a new word whatever script it is in. A character with no case at all, such as a Han character or an emoji, is its own lowercase form, so it is not a capital and does not split.
expectTypeOf<Words<'aÄb'>>().toBe<['a', 'Äb']>();
expectTypeOf<Words<'a😀b'>>().toBe<['a😀b']>();
expectTypeOf<Words<'aÉB'>>().toBe<['a', 'ÉB']>();
expectTypeOf<Words<'XMLHttp'>>().toBe<['XML', 'Http']>();
expectTypeOf<Words<'aÉb'>>().toBe<['a', 'Éb']>();
expectTypeOf<Words<'aÖb'>>().toBe<['a', 'Öb']>();
expectTypeOf<Words<'aЖб'>>().toBe<['a', 'Жб']>();
expectTypeOf<Words<'aΑβ'>>().toBe<['a', 'Αβ']>();
expectTypeOf<Words<'aБв'>>().toBe<['a', 'Бв']>();

// A script with no case distinction is not a capital, so it does not start a word. Hebrew consonants, Japanese, Hangul, Devanagari and Arabic are all caseless in the sense that matters here: none of them is the uppercase form of another.
expectTypeOf<Words<'aאב'>>().toBe<['aאב']>();
expectTypeOf<Words<'aあb'>>().toBe<['aあb']>();
expectTypeOf<Words<'a한b'>>().toBe<['a한b']>();
expectTypeOf<Words<'aअb'>>().toBe<['aअb']>();
expectTypeOf<Words<'aبb'>>().toBe<['aبb']>();

// `U+0085` (next line) is kept by `String.prototype.trim()`, but it still separates words.
expectTypeOf<Words<'a\u{85}b'>>().toBe<['a', 'b']>();

// Repeated tags are removed before reading characters and word boundaries.
expectTypeOf<Words<Tagged<Tagged<'helloWorld', 'Text'>, 'Validated'>>>().toBe<['hello', 'World']>();
expectTypeOf<Words<Tagged<Tagged<'hello:world', 'Text'>, 'Validated'>, {splitOnPunctuation: true}>>().toBe<['hello', 'world']>();

// A long sentence does not hit the recursion limit.
expectTypeOf<Words<StringRepeat<'ab ', 200>>>().toBe<TupleOf<200, 'ab'>>();
expectTypeOf<Words<StringRepeat<'Ab', 200>>>().toBe<TupleOf<200, 'Ab'>>();
