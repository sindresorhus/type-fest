import type {WhitespaceCharacter} from '../whitespace-character.d.ts';

// `U+0085` (next line) is not whitespace to `String.prototype.trim()`, but it still separates words.
export type WordSeparators = '-' | '_' | '\u{85}' | WhitespaceCharacter;

/**
The characters of the Unicode titlecase category (`Lt`), which is closed at these 31 code points. Each is changed by both lowercasing and uppercasing, so a character like `ǅ` is neither lowercase nor uppercase, though it also matches none of the uppercase or lowercase shapes the case predicates look for.
*/
export type TitlecaseCharacter =
	| '\u{1C5}'
	| '\u{1C8}'
	| '\u{1CB}'
	| '\u{1F2}'
	| '\u{1F88}'
	| '\u{1F89}'
	| '\u{1F8A}'
	| '\u{1F8B}'
	| '\u{1F8C}'
	| '\u{1F8D}'
	| '\u{1F8E}'
	| '\u{1F8F}'
	| '\u{1F98}'
	| '\u{1F99}'
	| '\u{1F9A}'
	| '\u{1F9B}'
	| '\u{1F9C}'
	| '\u{1F9D}'
	| '\u{1F9E}'
	| '\u{1F9F}'
	| '\u{1FA8}'
	| '\u{1FA9}'
	| '\u{1FAA}'
	| '\u{1FAB}'
	| '\u{1FAC}'
	| '\u{1FAD}'
	| '\u{1FAE}'
	| '\u{1FAF}'
	| '\u{1FBC}'
	| '\u{1FCC}'
	| '\u{1FFC}';

export {};
