import type {WhitespaceCharacter} from './whitespace-character.d.ts';
import type {Alphanumeric, LowercaseLetter, UppercaseLetter} from './characters.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {AsciiPunctuation, UnwrapPathBrand} from './internal/index.d.ts';

/**
Consume ASCII identifier characters. Other ASCII punctuation or whitespace ends the name, while unsupported name characters make the entire pattern fall back.
*/
type ScanParameterName<Segment extends string, Name extends string> =
	Segment extends `${infer Character}${infer Rest}`
		? Character extends Alphanumeric | '$' | '_'
			? ScanParameterName<Rest, `${Name}${Character}`>
			: Character extends AsciiPunctuation | WhitespaceCharacter
				? FinishParameter<Segment, Name>
				: never
		: {[Key in Name]: string};

/**
Apply a modifier only at the end of a slash-separated segment; otherwise continue scanning literal text and parameters.
*/
type FinishParameter<Segment extends string, Name extends string> =
	Segment extends '?' | '*'
		? {[Key in Name]?: string | undefined}
		: Segment extends '+'
			? {[Key in Name]: string}
			: {[Key in Name]: string} & SegmentParameters<Segment>;

/**
Read named parameters and literal text in a flat segment. Unsupported syntax returns `never` so the entire pattern can fall back.
*/
type SegmentParameters<Segment extends string> =
	Segment extends `:${infer FirstCharacter}${infer Rest}`
		? FirstCharacter extends LowercaseLetter | UppercaseLetter | '$' | '_'
			? ScanParameterName<Rest, FirstCharacter>
			: never
		: Segment extends `${infer Character}${infer Rest}`
			? Character extends ':' | '?' | '*' | '+' | '(' | '{' | '}' | '\\' | '#'
				? never
				: SegmentParameters<Rest>
			: {};

/**
Collect parameters from slash-separated segments. An unsupported segment makes the whole result `never`, rather than retaining partially extracted parameters.
*/
type ExtractPathParameters<Pattern extends string, Parameters = {}> =
	Pattern extends `${infer Segment}/${infer Rest}`
		? ExtractPathParameters<Rest, Parameters & SegmentParameters<Segment>>
		: Parameters & SegmentParameters<Pattern>;

/**
Extract named parameters from a URL path pattern.

Supports a flat subset of the [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API) pathname syntax: literal text and named parameters, including multiple parameters in one segment like `/flights/:from-:to`. Parameter names must start with an ASCII letter, `$`, or `_`, followed by ASCII letters, digits, `$`, or `_`. Other ASCII punctuation or whitespace ends a name, so `/:id.json` captures `id`.

- `:id` requires the key `id`, with a `string` value.
- `:id?` and `:path*` make the key optional, with a `string | undefined` value. A `*` parameter is conservatively optional even when a zero-length match captures the empty string.
- `:path+` requires the key, with a `string` value. Repeated parameters follow URLPattern semantics and are strings, not arrays.
- A union of literal patterns gives a union of parameter objects.

Modifiers are supported only at the end of a slash-separated segment, including after a literal prefix like `/files/prefix-:path*`. A modifier inside a segment, like `/:id?-suffix`, is unsupported.

Unsupported syntax makes the entire pattern fall back to `Record<string, string | undefined>`, without partially extracting parameters. This includes Unicode parameter names, regular expression groups (`/:id(\\d+)`), brace groups (`/users{/:id}?`), escapes, bare wildcards (`/files/*`), full URLs, search strings, and fragments. For example, `/users/:id/*` falls back without retaining `id`. Use a named catchall like `/files/:path*` instead of a bare wildcard.

Non-literal patterns, including `string`, `any`, and template literal patterns containing placeholders like `` `${string}` ``, also fall back to `Record<string, string | undefined>`. A `LiteralUnion` preserves its literal members alongside that fallback. This type does not validate patterns at runtime or diagnose every invalid pattern. Validate patterns with `new URLPattern({pathname: pattern})` when needed.

Use-cases:
- Type the `params` that a router passes to a route, from a route path constant.
- Type the arguments for building a URL from a pattern.

@example
```
import type {PathParameters} from 'type-fest';

type A = PathParameters<'/users/:id'>;
//=> {id: string}

type B = PathParameters<'/users/:id?'>;
//=> {id?: string | undefined}

type C = PathParameters<'/users/:id/files/:fileId?'>;
//=> {id: string; fileId?: string | undefined}

type D = PathParameters<'/files/:folderId/:path*'>;
//=> {folderId: string; path?: string | undefined}

type E = PathParameters<'/flights/:from-:to'>;
//=> {from: string; to: string}

type F = PathParameters<'/files/:file.:ext?'>;
//=> {file: string; ext?: string | undefined}
```

@example
```
import type {PathParameters} from 'type-fest';

declare function createRoute<Pattern extends string>(pattern: Pattern, handler: (parameters: PathParameters<Pattern>) => Promise<Response>): void;

createRoute('/users/:userId/posts/:postId', ({userId, postId}) => fetch(`/users/${userId}/posts/${postId}`));

createRoute('/about', () => fetch('/about'));
```

@category Template literal
*/
export type PathParameters<Pattern extends string> =
	IsAny<Pattern> extends true
		? Record<string, string | undefined>
		// Distribute here, inside the `IsAny` check, so a union of patterns shows as a union of parameter objects.
		: Pattern extends unknown
			? PathParametersImplementation<UnwrapPathBrand<Pattern>>
			: never;

// The brand is unwrapped before checking whether the pattern is a literal or extracting its parameters.
type PathParametersImplementation<Pattern extends string> =
	IsStringLiteral<Pattern> extends true
		? ExtractPathParameters<Pattern> extends infer Parameters
			? [Parameters] extends [never]
				? Record<string, string | undefined>
				: Simplify<Parameters>
			: never
		: Record<string, string | undefined>;

export {};
