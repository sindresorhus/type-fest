import {expectTypeOf} from 'nz';
import type {AsciiPunctuationCharacter, LiteralUnion, Opaque, RouteParameters, Tagged, WhitespaceCharacter} from '../index.d.ts';

// Named parameters can occupy whole path segments or appear alongside literal text.
expectTypeOf<RouteParameters<'/users/:id'>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<'/users/:id/posts/:postId'>>().toBe<{id: string; postId: string}>();
expectTypeOf<RouteParameters<'/:year/:month/:day'>>().toBe<{year: string; month: string; day: string}>();
expectTypeOf<RouteParameters<'teams/:teamId'>>().toBe<{teamId: string}>();
expectTypeOf<RouteParameters<'/users'>>().toBe<{}>();
expectTypeOf<RouteParameters<''>>().toBe<{}>();
expectTypeOf<RouteParameters<'/'>>().toBe<{}>();
expectTypeOf<RouteParameters<'/users/:id/'>>().toBe<{id: string}>();

// Modifiers use URLPattern semantics: repeating parameters are strings, not arrays.
expectTypeOf<RouteParameters<'/users/:id?'>>().toBe<{id?: string | undefined}>();
expectTypeOf<RouteParameters<'/files/:path*'>>().toBe<{path?: string | undefined}>();
expectTypeOf<RouteParameters<'/files/:path+'>>().toBe<{path: string}>();
expectTypeOf<RouteParameters<'/:a?/:b*/:c+'>>().toBe<{a?: string | undefined; b?: string | undefined; c: string}>();
expectTypeOf<RouteParameters<'/users/:id?/posts'>>().toBe<{id?: string | undefined}>();
expectTypeOf<RouteParameters<'/files/prefix-:path?'>>().toBe<{path?: string | undefined}>();

// The doc examples, pinned exactly.
expectTypeOf<RouteParameters<'/users/:id/files/:fileId?'>>().toBe<{id: string; fileId?: string | undefined}>();
expectTypeOf<RouteParameters<'/files/:folderId/:path*'>>().toBe<{folderId: string; path?: string | undefined}>();

// Parameter names are ASCII identifiers, with digits allowed after the first character.
expectTypeOf<RouteParameters<'/:a$b_c9/x'>>().toBe<{a$b_c9: string}>();
expectTypeOf<RouteParameters<'/:$_/x'>>().toBe<{$_: string}>();
expectTypeOf<RouteParameters<'/:A0/:_id/:$value'>>().toBe<{A0: string; _id: string; $value: string}>();

// Whitespace ends a name too.
expectTypeOf<RouteParameters<'/a/:id b'>>().toBe<{id: string}>();

// Embedded parameters include literal prefixes, filename extensions, and multiple names in one segment.
expectTypeOf<RouteParameters<'/a/:id.jpg'>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<'/v:version'>>().toBe<{version: string}>();
expectTypeOf<RouteParameters<'/:team-id/x'>>().toBe<{team: string}>();
expectTypeOf<RouteParameters<'/flights/:from-:to'>>().toBe<{from: string; to: string}>();
expectTypeOf<RouteParameters<'/plantae/:genus.:species'>>().toBe<{genus: string; species: string}>();
expectTypeOf<RouteParameters<'/api/v:version/users/:id'>>().toBe<{version: string; id: string}>();
expectTypeOf<RouteParameters<'/files/:file.:ext?'>>().toBe<{file: string; ext?: string | undefined}>();
expectTypeOf<RouteParameters<'/files/prefix-:path*'>>().toBe<{path?: string | undefined}>();
expectTypeOf<RouteParameters<'/files/prefix-:path+'>>().toBe<{path: string}>();
expectTypeOf<RouteParameters<'/café/:id'>>().toBe<{id: string}>();

// An unmatched closing parenthesis is literal text. Only `(` starts a regular expression group.
expectTypeOf<RouteParameters<'/:id)a'>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<'/a)/:id'>>().toBe<{id: string}>();

// Unicode parameter names are unsupported instead of being truncated.
expectTypeOf<RouteParameters<'/:café'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:中'>>().toBe<Record<string, string | undefined>>();

// Bare wildcards and numbered captures are unsupported. Use a named catchall such as `:path*`.
expectTypeOf<RouteParameters<'/files/*'>>().toBe<Record<string, string | undefined>>();

// Regular expression content is unsupported, whether named or unnamed, nested or escaped.
expectTypeOf<RouteParameters<'/users/:id(\\d+)'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/(foo)'>>().toBe<Record<string, string | undefined>>();

// Brace groups and their optional or repeating captures are unsupported.
expectTypeOf<RouteParameters<'/users{/:id}?'>>().toBe<Record<string, string | undefined>>();

// A lone `}` is invalid in URLPattern, so it falls back too.
expectTypeOf<RouteParameters<'/a}/:id'>>().toBe<Record<string, string | undefined>>();

// No captures are partially extracted or numbered when any part of the pattern is unsupported.
expectTypeOf<RouteParameters<'/users/:id/*'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/files/*/:id'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/users/:id/:file(abc)'>>().toBe<Record<string, string | undefined>>();

// Escapes are unsupported rather than interpreted as literal pattern text.
expectTypeOf<RouteParameters<'/a\\:id/:known'>>().toBe<Record<string, string | undefined>>();

// Invalid names and modifiers fall back without diagnosing the pattern.
expectTypeOf<RouteParameters<'/:'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:0'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id??'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id?-suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id+-suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/flights/:from?-:to'>>().toBe<Record<string, string | undefined>>();

// Only pathnames are supported, without a hostname, search string, or fragment.
expectTypeOf<RouteParameters<'https://example.com/users/:id'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/users/:id?limit=10'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/users/:id#section'>>().toBe<Record<string, string | undefined>>();

// Unions distribute.
expectTypeOf<RouteParameters<'/users/:id' | '/posts/:postId'>>().toBe<{id: string} | {postId: string}>();
expectTypeOf<RouteParameters<'/users/:id' | '/users'>>().toBe<{id: string} | {}>();
expectTypeOf<RouteParameters<'/:a' | '/:b' | '/:c'>>().toBe<{a: string} | {b: string} | {c: string}>();
expectTypeOf<RouteParameters<'/:a' | string>>().toBe<Record<string, string | undefined>>();

// A long pattern does not hit the recursion limit.
expectTypeOf<RouteParameters<'/a/:v1/b/:v2/c/:v3/d/:v4/e/:v5/f/:v6/g/:v7/h/:v8'>>().toBe<{v1: string; v2: string; v3: string; v4: string; v5: string; v6: string; v7: string; v8: string}>();

// Non-literal patterns can have any keys, including placeholders in template literal patterns.
expectTypeOf<RouteParameters<string>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<any>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<never>>().toBe<never>();
expectTypeOf<RouteParameters<string & {}>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<LiteralUnion<'/users/:id', string>>>().toBe<Record<string, string | undefined> | {id: string}>();
expectTypeOf<RouteParameters<LiteralUnion<'/users/:id' | '/posts/:postId', string>>>().toBe<Record<string, string | undefined> | {id: string} | {postId: string}>();
expectTypeOf<RouteParameters<`/users/${string}`>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<`${string}/:id`>>().toBe<Record<string, string | undefined>>();

// A pattern brand is removed before checking whether the path is a literal.
expectTypeOf<RouteParameters<Tagged<'/users/:id', 'Route'>>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<Opaque<'/users/:id', 'Route'>>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<Tagged<Tagged<'/users/:id', 'Route'>, 'Validated'>>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<Tagged<'/a/:id' | '/b/:otherId', 'Route'>>>().toBe<{id: string} | {otherId: string}>();
expectTypeOf<RouteParameters<Tagged<string, 'Route'>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<Opaque<string, 'Route'>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<Tagged<'/a/:id', 'Route'> | '/b/:otherId'>>().toBe<{id: string} | {otherId: string}>();
expectTypeOf<RouteParameters<Tagged<any, 'Route'>>>().toBe<Record<string, string | undefined>>();

// @ts-expect-error - Patterns are strings.
expectTypeOf<RouteParameters<unknown>>();
// @ts-expect-error - Patterns are strings.
expectTypeOf<RouteParameters<42>>();

// A wrong value type is not assignable, and a required key cannot be dropped.
expectTypeOf<{id: number}>().not.toBeAssignableTo<RouteParameters<'/users/:id'>>();
expectTypeOf<{}>().not.toBeAssignableTo<RouteParameters<'/users/:id'>>();
expectTypeOf<{id: string | undefined}>().not.toBeAssignableTo<RouteParameters<'/users/:id'>>();
expectTypeOf<RouteParameters<'/users/:id?'>>().not.toBeAssignableTo<{id: string}>();
expectTypeOf<{id: string; postId: string}>().toBeAssignableTo<RouteParameters<'/users/:id/posts/:postId'>>();
expectTypeOf<{id?: string; fileId: string}>().toBeAssignableTo<RouteParameters<'/users/:id?/files/:fileId'>>();

// Unmatched URLPattern captures remain present with an undefined value, including with `exactOptionalPropertyTypes`.
expectTypeOf<{id?: string}>().toBeAssignableTo<RouteParameters<'/users/:id?'>>();
expectTypeOf<{id: string}>().toBeAssignableTo<RouteParameters<'/users/:id?'>>();
expectTypeOf<{id: string | undefined}>().toBeAssignableTo<RouteParameters<'/users/:id?'>>();
expectTypeOf<{id: undefined}>().toBeAssignableTo<RouteParameters<'/users/:id?'>>();

declare const optionalParameters: RouteParameters<'/users/:id?'>;
if ('id' in optionalParameters) {
	expectTypeOf(optionalParameters.id).toBe<string | undefined>();
}

// With a router
declare function useParameters<const Pattern extends string>(pattern: Pattern): RouteParameters<Pattern>;

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
type RouteHandler<Pattern extends string> = (parameters: RouteParameters<Pattern>) => Promise<Response>;

declare const getPost: RouteHandler<'/users/:userId/posts/:postId'>;
declare const listFiles: RouteHandler<'/files/:folderId/:path*'>;
declare const pattern: '/users/:userId/posts/:postId';

expectTypeOf(getPost({userId: '1', postId: '2'})).toBe<Promise<Response>>();
expectTypeOf(listFiles({folderId: 'a', path: 'b/c'})).toBe<Promise<Response>>();
expectTypeOf<RouteParameters<typeof pattern>>().toBe<{userId: string; postId: string}>();

// Every ECMAScript whitespace character terminates a parameter name without becoming part of its key.
expectTypeOf<{[Character in WhitespaceCharacter]: RouteParameters<`/:id${Character}suffix`>}>().toBe<{[Character in WhitespaceCharacter]: {id: string}}>();
expectTypeOf<{[Character in WhitespaceCharacter]: RouteParameters<`/:first${Character}:second`>}>().toBe<{[Character in WhitespaceCharacter]: {first: string; second: string}}>();
expectTypeOf<RouteParameters<'/:id\r\ntext/:file?'>>().toBe<{id: string; file?: string | undefined}>();
expectTypeOf<RouteParameters<'/:id\u{A0}label'>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<'/:id\u{FEFF}'>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<'/:id\u{2028}:part\u{2029}:last'>>().toBe<{id: string; part: string; last: string}>();
expectTypeOf<RouteParameters<'/:id\t\u{3000}:name?'>>().toBe<{id: string; name?: string | undefined}>();
expectTypeOf<RouteParameters<'/:id\u{205F}text/:path*'>>().toBe<{id: string; path?: string | undefined}>();
expectTypeOf<RouteParameters<Tagged<'/:id\u{3000}:name', 'Route'>>>().toBe<{id: string; name: string}>();

// A whitespace boundary still permits later literal Unicode text and parameter captures.
expectTypeOf<RouteParameters<'/:id\u{A0}café/:file'>>().toBe<{id: string; file: string}>();
expectTypeOf<RouteParameters<'/\u{200B}/:id'>>().toBe<{id: string}>();
expectTypeOf<RouteParameters<'/:id \u{200B}/:file'>>().toBe<{id: string; file: string}>();

// Excluded format and control characters immediately after a name trigger the documented fallback.
expectTypeOf<RouteParameters<'/:id\u{85}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id\u{180E}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id\u{200B}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id\u{2060}suffix/:known'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:known/:id\u{200C}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id\u{200D}suffix'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id\0suffix'>>().toBe<Record<string, string | undefined>>();

// Whitespace cannot supply a missing name or turn a nonterminal modifier into a terminal one.
expectTypeOf<RouteParameters<'/:\tname'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id?\t'>>().toBe<Record<string, string | undefined>>();
expectTypeOf<RouteParameters<'/:id\t?'>>().toBe<Record<string, string | undefined>>();

// A fallback in one union member does not erase the extraction from another member.
expectTypeOf<RouteParameters<'/:id\u{A0}suffix' | '/:name\u{85}suffix'>>().toBe<Record<string, string | undefined> | {id: string}>();

// Every literal punctuation boundary ends the name and permits a later parameter capture.
type LiteralPunctuation = Exclude<AsciiPunctuationCharacter, '$' | '_' | ':' | '?' | '*' | '+' | '(' | '{' | '}' | '\\' | '#'>;
expectTypeOf<{[Character in LiteralPunctuation]: RouteParameters<`/:id${Character}suffix`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string}}>();
expectTypeOf<{[Character in LiteralPunctuation]: RouteParameters<`/:id${Character}:next`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; next: string}}>();
expectTypeOf<{[Character in LiteralPunctuation]: RouteParameters<`/:id${Character}:next?`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; next?: string | undefined}}>();
expectTypeOf<{[Character in LiteralPunctuation]: RouteParameters<`/:id${Character}:rest*`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; rest?: string | undefined}}>();
expectTypeOf<{[Character in LiteralPunctuation]: RouteParameters<`/:id${Character}:rest+`>}>()
	.toBe<{[Character in LiteralPunctuation]: {id: string; rest: string}}>();

// Dollar signs and underscores belong to identifier names instead of terminating them.
expectTypeOf<RouteParameters<'/:id$suffix/:id_suffix'>>().toBe<{id$suffix: string; id_suffix: string}>();
expectTypeOf<RouteParameters<'/:$9_?/:_9$*'>>().toBe<{$9_?: string | undefined; _9$?: string | undefined}>();
expectTypeOf<RouteParameters<'/:first:second'>>().toBe<{first: string; second: string}>();
expectTypeOf<RouteParameters<'/:first:second?'>>().toBe<{first: string; second?: string | undefined}>();
expectTypeOf<RouteParameters<'/:first:second*'>>().toBe<{first: string; second?: string | undefined}>();
expectTypeOf<RouteParameters<'/:first:second+'>>().toBe<{first: string; second: string}>();

// Punctuation that starts unsupported syntax discards captures on both sides.
type UnsupportedPunctuation = '(' | '{' | '}' | '\\' | '#';
expectTypeOf<{[Character in UnsupportedPunctuation]: RouteParameters<`/:known/:id${Character}suffix/:last`>}>()
	.toBe<{[Character in UnsupportedPunctuation]: Record<string, string | undefined>}>();
expectTypeOf<{[Character in '?' | '*' | '+']: RouteParameters<`/:known/:id${Character}-suffix/:last`>}>()
	.toBe<{[Character in '?' | '*' | '+']: Record<string, string | undefined>}>();
expectTypeOf<{[Character in '?' | '*' | '+']: RouteParameters<`/:known/:id${Character}${Character}`>}>()
	.toBe<{[Character in '?' | '*' | '+']: Record<string, string | undefined>}>();
expectTypeOf<RouteParameters<'/:first:'>>().toBe<Record<string, string | undefined>>();

// A non-ASCII punctuation lookalike must not silently truncate a parameter name.
type NonAsciiPunctuation = '！' | '：' | '＿' | '＄' | '’' | '…' | '。';
expectTypeOf<{[Character in NonAsciiPunctuation]: RouteParameters<`/:known/:id${Character}suffix`>}>()
	.toBe<{[Character in NonAsciiPunctuation]: Record<string, string | undefined>}>();
expectTypeOf<{[Character in NonAsciiPunctuation]: RouteParameters<`/${Character}/:id`>}>()
	.toBe<{[Character in NonAsciiPunctuation]: {id: string}}>();

// Identifier boundaries and modifiers keep working through pattern unions and brands.
expectTypeOf<RouteParameters<'/:file.:ext?' | '/:directory/:path*'>>()
	.toBe<{file: string; ext?: string | undefined} | {directory: string; path?: string | undefined}>();
expectTypeOf<RouteParameters<Tagged<'/:file.:ext?', 'Route'>>>().toBe<{file: string; ext?: string | undefined}>();
expectTypeOf<RouteParameters<Opaque<'/:from-:to+', 'Route'>>>().toBe<{from: string; to: string}>();
expectTypeOf<RouteParameters<'/:file.:ext' | '/:id#fragment'>>()
	.toBe<Record<string, string | undefined> | {file: string; ext: string}>();
