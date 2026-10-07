import {expectType} from 'tsd';
import type {Words} from '../source/words.d.ts';
import type {Tagged} from '../source/tagged.d.ts';

expectType<Words<''>>([]);
expectType<Words<'a'>>(['a']);
expectType<Words<'B'>>(['B']);
expectType<Words<'aa'>>(['aa']);
expectType<Words<'aB'>>(['a', 'B']);
expectType<Words<'Ba'>>(['Ba']);
expectType<Words<'BB'>>(['BB']);
expectType<Words<'aaa'>>(['aaa']);
expectType<Words<'aaB'>>(['aa', 'B']);
expectType<Words<'aBa'>>(['a', 'Ba']);
expectType<Words<'aBB'>>(['a', 'BB']);
expectType<Words<'Baa'>>(['Baa']);
expectType<Words<'BaB'>>(['Ba', 'B']);
expectType<Words<'BBa'>>(['B', 'Ba']);
expectType<Words<'BBB'>>(['BBB']);
expectType<Words<'aaaa'>>(['aaaa']);
expectType<Words<'aaaB'>>(['aaa', 'B']);
expectType<Words<'aaBa'>>(['aa', 'Ba']);
expectType<Words<'aaBB'>>(['aa', 'BB']);
expectType<Words<'aBaa'>>(['a', 'Baa']);
expectType<Words<'aBaB'>>(['a', 'Ba', 'B']);
expectType<Words<'aBBa'>>(['a', 'B', 'Ba']);
expectType<Words<'aBBB'>>(['a', 'BBB']);
expectType<Words<'Baaa'>>(['Baaa']);
expectType<Words<'BaaB'>>(['Baa', 'B']);
expectType<Words<'BaBa'>>(['Ba', 'Ba']);
expectType<Words<'BaBB'>>(['Ba', 'BB']);
expectType<Words<'BBaa'>>(['B', 'Baa']);
expectType<Words<'BBaB'>>(['B', 'Ba', 'B']);
expectType<Words<'BBBa'>>(['BB', 'Ba']);
expectType<Words<'BBBB'>>(['BBBB']);
expectType<Words<'aaaaa'>>(['aaaaa']);
expectType<Words<'aaaaB'>>(['aaaa', 'B']);
expectType<Words<'aaaBa'>>(['aaa', 'Ba']);
expectType<Words<'aaaBB'>>(['aaa', 'BB']);
expectType<Words<'aaBaa'>>(['aa', 'Baa']);
expectType<Words<'aaBaB'>>(['aa', 'Ba', 'B']);
expectType<Words<'aaBBa'>>(['aa', 'B', 'Ba']);
expectType<Words<'aaBBB'>>(['aa', 'BBB']);
expectType<Words<'aBaaa'>>(['a', 'Baaa']);
expectType<Words<'aBaaB'>>(['a', 'Baa', 'B']);
expectType<Words<'aBaBa'>>(['a', 'Ba', 'Ba']);
expectType<Words<'aBaBB'>>(['a', 'Ba', 'BB']);
expectType<Words<'aBBaa'>>(['a', 'B', 'Baa']);
expectType<Words<'aBBaB'>>(['a', 'B', 'Ba', 'B']);
expectType<Words<'aBBBa'>>(['a', 'BB', 'Ba']);
expectType<Words<'aBBBB'>>(['a', 'BBBB']);
expectType<Words<'Baaaa'>>(['Baaaa']);
expectType<Words<'BaaaB'>>(['Baaa', 'B']);
expectType<Words<'BaaBa'>>(['Baa', 'Ba']);
expectType<Words<'BaaBB'>>(['Baa', 'BB']);
expectType<Words<'BaBaa'>>(['Ba', 'Baa']);
expectType<Words<'BaBaB'>>(['Ba', 'Ba', 'B']);
expectType<Words<'BaBBa'>>(['Ba', 'B', 'Ba']);
expectType<Words<'BaBBB'>>(['Ba', 'BBB']);
expectType<Words<'BBaaa'>>(['B', 'Baaa']);
expectType<Words<'BBaaB'>>(['B', 'Baa', 'B']);
expectType<Words<'BBaBa'>>(['B', 'Ba', 'Ba']);
expectType<Words<'BBaBB'>>(['B', 'Ba', 'BB']);
expectType<Words<'BBBaa'>>(['BB', 'Baa']);
expectType<Words<'BBBaB'>>(['BB', 'Ba', 'B']);
expectType<Words<'BBBBa'>>(['BBB', 'Ba']);
expectType<Words<'BBBBB'>>(['BBBBB']);

expectType<Words<'hello world'>>(['hello', 'world']);
expectType<Words<'Hello-world'>>(['Hello', 'world']);
expectType<Words<'hello_world'>>(['hello', 'world']);
expectType<Words<'hello  world'>>(['hello', 'world']);
expectType<Words<'Hello--world'>>(['Hello', 'world']);
expectType<Words<'hello__world'>>(['hello', 'world']);
expectType<Words<'   hello  world'>>(['hello', 'world']);
expectType<Words<'---Hello--world'>>(['Hello', 'world']);
expectType<Words<'___hello__world'>>(['hello', 'world']);
expectType<Words<'hello  world   '>>(['hello', 'world']);
expectType<Words<'hello\tworld'>>(['hello', 'world']);
expectType<Words<'Hello--world--'>>(['Hello', 'world']);
expectType<Words<'hello__world___'>>(['hello', 'world']);
expectType<Words<'___ hello -__  _world'>>(['hello', 'world']);
expectType<Words<'__HelloWorld-HELLOWorld helloWORLD'>>(['Hello', 'World', 'HELLO', 'World', 'hello', 'WORLD']);
expectType<Words<'hello WORLD lowercase'>>(['hello', 'WORLD', 'lowercase']);
expectType<Words<'hello WORLD-lowercase'>>(['hello', 'WORLD', 'lowercase']);
expectType<Words<'hello WORLD Uppercase'>>(['hello', 'WORLD', 'Uppercase']);

expectType<Words<'item0'>>(['item', '0']);
expectType<Words<'item01'>>(['item', '01']);
expectType<Words<'item10'>>(['item', '10']);
expectType<Words<'item010'>>(['item', '010']);
expectType<Words<'0item0'>>(['0', 'item', '0']);
expectType<Words<'01item01'>>(['01', 'item', '01']);
expectType<Words<'10item10'>>(['10', 'item', '10']);
expectType<Words<'010item010'>>(['010', 'item', '010']);
expectType<Words<'item0_item_1 item -2'>>(['item', '0', 'item', '1', 'item', '2']);

// SplitOnPunctuation

// Without `splitOnPunctuation`, punctuation is not a word boundary, so it stays inside the word. Splitting on it there was a side effect of punctuation matching both case predicates, which also made every non-ASCII character start a new word.
expectType<Words<':'>>([':']);
expectType<Words<'::'>>(['::']);
expectType<Words<'hello::'>>(['hello::']);
expectType<Words<'hello:world'>>(['hello:world']);
expectType<Words<'hello::world'>>(['hello::world']);
expectType<Words<'hello-braveNew:world'>>(['hello', 'brave', 'New:world']);

// A character with no case at all, such as a Han character or an emoji, is part of the surrounding word.
expectType<Words<'日本語テキスト'>>(['日本語テキスト']);
expectType<Words<'a日b'>>(['a日b']);
expectType<Words<'Hello世界'>>(['Hello世界']);

// An acronym keeps its last capital when the next character is not a lowercase letter, such as punctuation or a character with no case.
expectType<['FOO:bar']>({} as Words<'FOO:bar'>);
expectType<['FOO', 'bar']>({} as Words<'FOO:bar', {splitOnPunctuation: true}>);
expectType<['HELLO世界']>({} as Words<'HELLO世界'>);
expectType<['parse', 'JSON😀']>({} as Words<'parseJSON😀'>);
expectType<['user', 'ID?']>({} as Words<'userID?'>);

expectType<Words<':', {splitOnPunctuation: true}>>([]);
expectType<Words<'::', {splitOnPunctuation: true}>>([]);
expectType<Words<'hello::', {splitOnPunctuation: true}>>(['hello']);
expectType<Words<'hello:world', {splitOnPunctuation: true}>>(['hello', 'world']);
expectType<Words<'hello::world', {splitOnPunctuation: true}>>(['hello', 'world']);
expectType<Words<'hello-braveNew:world', {splitOnPunctuation: true}>>(['hello', 'brave', 'New', 'world']);
expectType<Words<'item::01', {splitOnPunctuation: true; splitOnNumbers: false}>>(['item', '01']);
expectType<Words<'item::01', {splitOnPunctuation: true; splitOnNumbers: true}>>(['item', '01']);

// A string type with an infinite set of possible values cannot be split, so it yields `string[]`, like the other string utilities do.
expectType<Words<string>>([] as string[]);
expectType<Words<Uppercase<string>>>([] as string[]);
expectType<Words<Lowercase<string>>>([] as string[]);
expectType<Words<`${string}b`>>([] as string[]);
expectType<Words<`a${string}b`>>([] as string[]);
expectType<Words<`${string}-${string}`>>([] as string[]);

// A union distributes, so the infinite member widens the result while the literal members are still split. The infinite member must not be `string`, because `'a-b' | string` collapses to `string`.
expectType<string[] | ['a', 'b']>({} as Words<'a-b' | `x${string}`>);

// A branded or tagged string is still a finite string literal, so it is walked like any other.
expectType<Words<Tagged<'a-b', 'x'>>>(['a', 'b']);
expectType<Words<Tagged<'helloWorld', 'x'>>>(['hello', 'World']);
expectType<Words<'a-b' & {readonly __brand: 'x'}>>(['a', 'b']);

// A capital letter starts a new word whatever script it is in. A character with no case at all, such as a Han character or an emoji, is its own lowercase form, so it is not a capital and does not split.
expectType<['a', 'Äb']>({} as Words<'aÄb'>);
expectType<['a😀b']>({} as Words<'a😀b'>);
expectType<['a', 'ÉB']>({} as Words<'aÉB'>);
expectType<['XML', 'Http']>({} as Words<'XMLHttp'>);
expectType<['a', 'Éb']>({} as Words<'aÉb'>);
expectType<['a', 'Öb']>({} as Words<'aÖb'>);
expectType<['a', 'Жб']>({} as Words<'aЖб'>);
expectType<['a', 'Αβ']>({} as Words<'aΑβ'>);
expectType<['a', 'Бв']>({} as Words<'aБв'>);

// A script with no case distinction is not a capital, so it does not start a word. Hebrew consonants, Japanese, Hangul, Devanagari and Arabic are all caseless in the sense that matters here: none of them is the uppercase form of another.
expectType<['aאב']>({} as Words<'aאב'>);
expectType<['aあb']>({} as Words<'aあb'>);
expectType<['a한b']>({} as Words<'a한b'>);
expectType<['aअb']>({} as Words<'aअb'>);
expectType<['aبb']>({} as Words<'aبb'>);

// `U+0085` (next line) is kept by `String.prototype.trim()`, but it still separates words.
expectType<['a', 'b']>({} as Words<'a\u{85}b'>);
