import {expectTypeOf} from 'nz';
import type {AsciiPunctuationCharacter, LiteralUnion, Opaque, PathParameters, Tagged, WhitespaceCharacter} from '../index.d.ts';

// Named parameters can occupy whole path segments or appear alongside literal text.
expectTypeOf<PathParameters<'/users/:id'>>().toBe<{id: string}>();
expectTypeOf<PathParameters<'/users/:id/posts/:postId'>>().toBe<{id: string; postId: string}>();
expectTypeOf<PathParameters<'/:year/:month/:day'>>().toBe<{year: string; month: string; day: string}>();
expectTypeOf<PathParameters<'teams/:teamId'>>().toBe<{teamId: string}>();
expectTypeOf<PathParameters<'/users'>>().toBe<{}>();
expectTypeOf<PathParameters<''>>().toBe<{}>();
expectTypeOf<PathParameters<'/'>>().toBe<{}>();
expectTypeOf<PathParameters<'/users/:id/'>>().toBe<{id: string}>();

// Modifiers use URLPattern semantics: repeating parameters are strings, not arrays.
expectTypeOf<PathParameters<'/users/:id?'>>().toBe<{id?: string | undefined}>();
expectTypeOf<PathParameters<'/files/:path*'>>().toBe<{path?: string | undefined}>();
expectTypeOf<PathParameters<'/files/:path+'>>().toBe<{path: string}>();
expectTypeOf<PathParameters<'/:a?/:b*/:c+'>>().toBe<{a?: string | undefined; b?: string | undefined; c: string}>();
expectTypeOf<PathParameters<'/users/:id?/posts'>>().toBe<{id?: string | undefined}>();
expectTypeOf<PathParameters<'/files/prefix-:path?'>>().toBe<{path?: string | undefined}>();

// The doc examples, pinned exactly.
expectTypeOf<PathParameters<'/users/:id/files/:fileId?'>>().toBe<{id: string; fileId?: string | undefined}>();
expectTypeOf<PathParameters<'/files/:folderId/:path*'>>().toBe<{folderId: string; path?: string | undefined}>();

// Parameter names are ASCII identifiers, with digits allowed after the first character.
expectTypeOf<PathParameters<'/:a$b_c9/x'>>().toBe<{a$b_c9: string}>();
expectTypeOf<PathParameters<'/:$_/x'>>().toBe<{$_: string}>();
expectTypeOf<PathParameters<'/:A0/:_id/:$value'>>().toBe<{A0: string; _id: string; $value: string}>();

// Whitespace ends a name too.
expectTypeOf<PathParameters<'/a/:id b'>>().toBe<{id: string}>();

// Embedded parameters include literal prefixes, filename extensions, and multiple names in one segment.
expectTypeOf<PathParameters<'/a/:id.jpg'>>().toBe<{id: string}>();
expectTypeOf<PathParameters<'/v:version'>>().toBe<{version: string}>();
expectTypeOf<PathParameters<'/:team-id/x'>>().toBe<{team: string}>();
expectTypeOf<PathParameters<'/flights/:from-:to'>>().toBe<{from: string; to: string}>();
expectTypeOf<PathParameters<'/plantae/:genus.:species'>>().toBe<{genus: string; species: string}>();
expectTypeOf<PathParameters<'/api/v:version/users/:id'>>().toBe<{version: string; id: string}>();
expectTypeOf<PathParameters<'/files/:file.:ext?'>>().toBe<{file: string; ext?: string | undefined}>();
expectTypeOf<PathParameters<'/files/prefix-:path*'>>().toBe<{path?: string | undefined}>();
expectTypeOf<PathParameters<'/files/prefix-:path+'>>().toBe<{path: string}>();
expectTypeOf<PathParameters<'/café/:id'>>().toBe<{id: string}>();

// An unmatched closing parenthesis is literal text. Only `(` starts a regular expression group.
expectTypeOf<PathParameters<'/:id)a'>>().toBe<{id: string}>();
expectTypeOf<PathParameters<'/a)/:id'>>().toBe<{id: string}>();

// Unicode parameter names are unsupported instead of being truncated.
expectTypeOf<PathParameters<'/:café'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:中'>>().toBe<Record<string, string | undefined>>();

// Bare wildcards and numbered captures are unsupported. Use a named catchall such as `:path*`.
expectTypeOf<PathParameters<'/files/*'>>().toBe<Record<string, string | undefined>>();

// Regular expression content is unsupported, whether named or unnamed, nested or escaped.
expectTypeOf<PathParameters<'/users/:id(\\d+)'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/(foo)'>>().toBe<Record<string, string | undefined>>();

// Brace groups and their optional or repeating captures are unsupported.
expectTypeOf<PathParameters<'/users{/:id}?'>>().toBe<Record<string, string | undefined>>();

// A lone `}` is invalid in URLPattern, so it falls back too.
expectTypeOf<PathParameters<'/a}/:id'>>().toBe<Record<string, string | undefined>>();

// No captures are partially extracted or numbered when any part of the pattern is unsupported.
expectTypeOf<PathParameters<'/users/:id/*'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/files/*/:id'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/users/:id/:file(abc)'>>().toBe<Record<string, string | undefined>>();

// Escapes are unsupported rather than interpreted as literal pattern text.
expectTypeOf<PathParameters<'/a\\:id/:known'>>().toBe<Record<string, string | undefined>>();

// Invalid names and modifiers fall back without diagnosing the pattern.
expectTypeOf<PathParameters<'/:'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:0'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id??'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id?-suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id+-suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/flights/:from?-:to'>>().toBe<Record<string, string | undefined>>();

// Only pathnames are supported, without a hostname, search string, or fragment.
expectTypeOf<PathParameters<'https://example.com/users/:id'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/users/:id?limit=10'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/users/:id#section'>>().toBe<Record<string, string | undefined>>();

// Unions distribute.
expectTypeOf<PathParameters<'/users/:id' | '/posts/:postId'>>().toBe<{id: string} | {postId: string}>();
expectTypeOf<PathParameters<'/users/:id' | '/users'>>().toBe<{id: string} | {}>();
expectTypeOf<PathParameters<'/:a' | '/:b' | '/:c'>>().toBe<{a: string} | {b: string} | {c: string}>();
expectTypeOf<PathParameters<'/:a' | string>>().toBe<Record<string, string | undefined>>();

// A long pattern does not hit the recursion limit.
expectTypeOf<PathParameters<'/a/:v1/b/:v2/c/:v3/d/:v4/e/:v5/f/:v6/g/:v7/h/:v8'>>().toBe<{v1: string; v2: string; v3: string; v4: string; v5: string; v6: string; v7: string; v8: string}>();

// Non-literal patterns can have any keys, including placeholders in template literal patterns.
expectTypeOf<PathParameters<string>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<any>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<never>>().toBe<never>();
expectTypeOf<PathParameters<string & {}>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<LiteralUnion<'/users/:id', string>>>().toBe<Record<string, string | undefined> | {id: string}>();
expectTypeOf<PathParameters<LiteralUnion<'/users/:id' | '/posts/:postId', string>>>().toBe<Record<string, string | undefined> | {id: string} | {postId: string}>();
expectTypeOf<PathParameters<`/users/${string}`>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<`${string}/:id`>>().toBe<Record<string, string | undefined>>();

// A pattern brand is removed before checking whether the path is a literal.
expectTypeOf<PathParameters<Tagged<'/users/:id', 'Route'>>>().toBe<{id: string}>();
expectTypeOf<PathParameters<Opaque<'/users/:id', 'Route'>>>().toBe<{id: string}>();
expectTypeOf<PathParameters<Tagged<Tagged<'/users/:id', 'Route'>, 'Validated'>>>().toBe<{id: string}>();
expectTypeOf<PathParameters<Tagged<'/a/:id' | '/b/:otherId', 'Route'>>>().toBe<{id: string} | {otherId: string}>();
expectTypeOf<PathParameters<Tagged<string, 'Route'>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<Opaque<string, 'Route'>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<Tagged<'/a/:id', 'Route'> | '/b/:otherId'>>().toBe<{id: string} | {otherId: string}>();
expectTypeOf<PathParameters<Tagged<any, 'Route'>>>().toBe<Record<string, string | undefined>>();

// @ts-expect-error - Patterns are strings.
expectTypeOf<PathParameters<unknown>>();
// @ts-expect-error - Patterns are strings.
expectTypeOf<PathParameters<42>>();

// A wrong value type is not assignable, and a required key cannot be dropped.
expectTypeOf<{id: number}>().not.toBeAssignableTo<PathParameters<'/users/:id'>>();
expectTypeOf<{}>().not.toBeAssignableTo<PathParameters<'/users/:id'>>();
expectTypeOf<{id: string | undefined}>().not.toBeAssignableTo<PathParameters<'/users/:id'>>();
expectTypeOf<PathParameters<'/users/:id?'>>().not.toBeAssignableTo<{id: string}>();
expectTypeOf<{id: string; postId: string}>().toBeAssignableTo<PathParameters<'/users/:id/posts/:postId'>>();
expectTypeOf<{id?: string; fileId: string}>().toBeAssignableTo<PathParameters<'/users/:id?/files/:fileId'>>();

// Unmatched URLPattern captures remain present with an undefined value, including with `exactOptionalPropertyTypes`.
expectTypeOf<{id?: string}>().toBeAssignableTo<PathParameters<'/users/:id?'>>();
expectTypeOf<{id: string}>().toBeAssignableTo<PathParameters<'/users/:id?'>>();
expectTypeOf<{id: string | undefined}>().toBeAssignableTo<PathParameters<'/users/:id?'>>();
expectTypeOf<{id: undefined}>().toBeAssignableTo<PathParameters<'/users/:id?'>>();

declare const optionalParameters: PathParameters<'/users/:id?'>;
if ('id' in optionalParameters) {
	expectTypeOf(optionalParameters.id).toBe<string | undefined>();
}

// With a router
declare function useParameters<const Pattern extends string>(pattern: Pattern): PathParameters<Pattern>;

expectTypeOf(useParameters('/teams/:teamId')).toBe<{teamId: string}>();
expectTypeOf(useParameters('/flights/:from-:to')).toBe<{from: string; to: string}>();
expectTypeOf(useParameters('/users')).toBe<{}>();
expectTypeOf(useParameters('/users/:id?')).toBe<{id?: string | undefined}>();
expectTypeOf(useParameters('/files/:path*')).toBe<{path?: string | undefined}>();
expectTypeOf(useParameters('/files/*')).toBe<Record<string, string | undefined>>();
declare const dynamicPattern: string;
expectTypeOf(useParameters(dynamicPattern)).toBe<Record<string, string | undefined>>();
declare const unionPattern: '/a/:x' | '/b';
expectTypeOf(useParameters(unionPattern)).toBe<{x: string} | {}>();

// A typed route table
type RouteHandler<Pattern extends string> = (parameters: PathParameters<Pattern>) => Promise<Response>;

declare const getPost: RouteHandler<'/users/:userId/posts/:postId'>;
declare const listFiles: RouteHandler<'/files/:folderId/:path*'>;
declare const pattern: '/users/:userId/posts/:postId';

expectTypeOf(getPost({userId: '1', postId: '2'})).toBe<Promise<Response>>();
expectTypeOf(listFiles({folderId: 'a', path: 'b/c'})).toBe<Promise<Response>>();
expectTypeOf<PathParameters<typeof pattern>>().toBe<{userId: string; postId: string}>();

// Every ECMAScript whitespace character terminates a parameter name without becoming part of its key.
expectTypeOf<{[Character in WhitespaceCharacter]: PathParameters<`/:id${Character}suffix`>}>().toBe<{[Character in WhitespaceCharacter]: {id: string}}>();
expectTypeOf<{[Character in WhitespaceCharacter]: PathParameters<`/:first${Character}:second`>}>().toBe<{[Character in WhitespaceCharacter]: {first: string; second: string}}>();
expectTypeOf<PathParameters<'/:id\r\ntext/:file?'>>().toBe<{id: string; file?: string | undefined}>();
expectTypeOf<PathParameters<'/:id\u{A0}label'>>().toBe<{id: string}>();
expectTypeOf<PathParameters<'/:id\u{FEFF}'>>().toBe<{id: string}>();
expectTypeOf<PathParameters<'/:id\u{2028}:part\u{2029}:last'>>().toBe<{id: string; part: string; last: string}>();
expectTypeOf<PathParameters<'/:id\t\u{3000}:name?'>>().toBe<{id: string; name?: string | undefined}>();
expectTypeOf<PathParameters<'/:id\u{205F}text/:path*'>>().toBe<{id: string; path?: string | undefined}>();
expectTypeOf<PathParameters<Tagged<'/:id\u{3000}:name', 'Route'>>>().toBe<{id: string; name: string}>();

// A whitespace boundary still permits later literal Unicode text and parameter captures.
expectTypeOf<PathParameters<'/:id\u{A0}café/:file'>>().toBe<{id: string; file: string}>();
expectTypeOf<PathParameters<'/\u{200B}/:id'>>().toBe<{id: string}>();
expectTypeOf<PathParameters<'/:id \u{200B}/:file'>>().toBe<{id: string; file: string}>();

// Excluded format and control characters immediately after a name trigger the documented fallback.
expectTypeOf<PathParameters<'/:id\u{85}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id\u{180E}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id\u{200B}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id\u{2060}suffix/:known'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:known/:id\u{200C}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id\u{200D}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id\0suffix'>>().toBe<Record<string, string | undefined>>();

// Whitespace cannot supply a missing name or turn a nonterminal modifier into a terminal one.
expectTypeOf<PathParameters<'/:\tname'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id?\t'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PathParameters<'/:id\t?'>>().toBe<Record<string, string | undefined>>();

// A fallback in one union member does not erase the extraction from another member.
expectTypeOf<PathParameters<'/:id\u{A0}suffix' | '/:name\u{85}suffix'>>().toBe<Record<string, string | undefined> | {id: string}>();

// Every literal punctuation boundary ends the name and permits a later parameter capture.
type LiteralPunctuation = Exclude<AsciiPunctuationCharacter, '$' | '_' | ':' | '?' | '*' | '+' | '(' | '{' | '}' | '\\' | '#'>;
expectTypeOf<{[Character in LiteralPunctuation]: PathParameters<`/:id${Character}suffix`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string}}>();
expectTypeOf<{[Character in LiteralPunctuation]: PathParameters<`/:id${Character}:next`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; next: string}}>();
expectTypeOf<{[Character in LiteralPunctuation]: PathParameters<`/:id${Character}:next?`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; next?: string | undefined}}>();
expectTypeOf<{[Character in LiteralPunctuation]: PathParameters<`/:id${Character}:rest*`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; rest?: string | undefined}}>();
expectTypeOf<{[Character in LiteralPunctuation]: PathParameters<`/:id${Character}:rest+`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; rest: string}}>();

// Dollar signs and underscores belong to identifier names instead of terminating them.
expectTypeOf<PathParameters<'/:id$suffix/:id_suffix'>>().toBe<{id$suffix: string; id_suffix: string}>();
expectTypeOf<PathParameters<'/:$9_?/:_9$*'>>().toBe<{$9_?: string | undefined; _9$?: string | undefined}>();
expectTypeOf<PathParameters<'/:first:second'>>().toBe<{first: string; second: string}>();
expectTypeOf<PathParameters<'/:first:second?'>>().toBe<{first: string; second?: string | undefined}>();
expectTypeOf<PathParameters<'/:first:second*'>>().toBe<{first: string; second?: string | undefined}>();
expectTypeOf<PathParameters<'/:first:second+'>>().toBe<{first: string; second: string}>();

// Punctuation that starts unsupported syntax discards captures on both sides.
type UnsupportedPunctuation = '(' | '{' | '}' | '\\' | '#';
expectTypeOf<{[Character in UnsupportedPunctuation]: PathParameters<`/:known/:id${Character}suffix/:last`>}>()
	.toBe<{[Character in UnsupportedPunctuation]: Record<string, string | undefined>}>();
expectTypeOf<{[Character in '?' | '*' | '+']: PathParameters<`/:known/:id${Character}-suffix/:last`>}>()
	.toBe<{[Character in '?' | '*' | '+']: Record<string, string | undefined>}>();
expectTypeOf<{[Character in '?' | '*' | '+']: PathParameters<`/:known/:id${Character}${Character}`>}>()
	.toBe<{[Character in '?' | '*' | '+']: Record<string, string | undefined>}>();
expectTypeOf<PathParameters<'/:first:'>>().toBe<Record<string, string | undefined>>();

// A non-ASCII punctuation lookalike must not silently truncate a parameter name.
type NonAsciiPunctuation = '！' | '：' | '＿' | '＄' | '’' | '…' | '。';
expectTypeOf<{[Character in NonAsciiPunctuation]: PathParameters<`/:known/:id${Character}suffix`>}>()
	.toBe<{[Character in NonAsciiPunctuation]: Record<string, string | undefined>}>();
expectTypeOf<{[Character in NonAsciiPunctuation]: PathParameters<`/${Character}/:id`>}>()
	.toBe<{[Character in NonAsciiPunctuation]: {id: string}}>();

// Identifier boundaries and modifiers keep working through pattern unions and brands.
expectTypeOf<PathParameters<'/:file.:ext?' | '/:directory/:path*'>>()
	.toBe<{file: string; ext?: string | undefined} | {directory: string; path?: string | undefined}>();
expectTypeOf<PathParameters<Tagged<'/:file.:ext?', 'Route'>>>().toBe<{file: string; ext?: string | undefined}>();
expectTypeOf<PathParameters<Opaque<'/:from-:to+', 'Route'>>>().toBe<{from: string; to: string}>();
expectTypeOf<PathParameters<'/:file.:ext' | '/:id#fragment'>>()
	.toBe<Record<string, string | undefined> | {file: string; ext: string}>();
