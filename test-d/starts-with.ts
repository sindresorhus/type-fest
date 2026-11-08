import {expectTypeOf} from 'nz';
import type {Flavor, LiteralUnion, Opaque, StartsWith, StringRepeat, Tagged} from '../index.d.ts';

// Literal prefixes match only at the beginning, with case preserved.
expectTypeOf<StartsWith<'user:created', 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', 'order:'>>().toBe<false>();
expectTypeOf<StartsWith<'user:created', 'created'>>().toBe<false>();
expectTypeOf<StartsWith<'user:created', 'User:'>>().toBe<false>();
expectTypeOf<StartsWith<'user:created', 'user:created'>>().toBe<true>();
expectTypeOf<StartsWith<'user', 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<'foobar', 'foobaz'>>().toBe<false>();
expectTypeOf<StartsWith<'foofoo', 'foo'>>().toBe<true>();

// Every string starts with the empty prefix.
expectTypeOf<StartsWith<'user:created', ''>>().toBe<true>();
expectTypeOf<StartsWith<'', ''>>().toBe<true>();
expectTypeOf<StartsWith<string, ''>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}`, ''>>().toBe<true>();
expectTypeOf<StartsWith<'', 'user:'>>().toBe<false>();

// Spaces, escapes, and punctuation are compared literally.
expectTypeOf<StartsWith<' user', ' '>>().toBe<true>();
expectTypeOf<StartsWith<'user', ' '>>().toBe<false>();
expectTypeOf<StartsWith<'\n\tuser', '\n\t'>>().toBe<true>();
expectTypeOf<StartsWith<'\0user', '\0'>>().toBe<true>();
expectTypeOf<StartsWith<'[user]', '['>>().toBe<true>();
expectTypeOf<StartsWith<'a.b', 'a.'>>().toBe<true>();
expectTypeOf<StartsWith<'axb', 'a.'>>().toBe<false>();
expectTypeOf<StartsWith<'a b', 'a '>>().toBe<true>();
expectTypeOf<StartsWith<'ab', 'a '>>().toBe<false>();
expectTypeOf<StartsWith<'\f\v', '\f'>>().toBe<true>();
expectTypeOf<StartsWith<'a$b', 'a$'>>().toBe<true>();
expectTypeOf<StartsWith<'a+b', 'a+'>>().toBe<true>();
expectTypeOf<StartsWith<'a|b', 'a|'>>().toBe<true>();

// Numeric strings are compared as plain text, without numeric normalization.
expectTypeOf<StartsWith<'0123', '01'>>().toBe<true>();
expectTypeOf<StartsWith<'-1.5', '-1'>>().toBe<true>();
expectTypeOf<StartsWith<'-1.5', '1'>>().toBe<false>();
expectTypeOf<StartsWith<'1e3', '1e'>>().toBe<true>();

// Unicode is neither normalized nor case-folded.
expectTypeOf<StartsWith<'🦄 magic', '🦄'>>().toBe<true>();
expectTypeOf<StartsWith<'你好世界', '你好'>>().toBe<true>();
expectTypeOf<StartsWith<'éclair', 'é'>>().toBe<true>();
expectTypeOf<StartsWith<'e\u{301}clair', 'é'>>().toBe<false>();
expectTypeOf<StartsWith<'Éclair', 'é'>>().toBe<false>();
expectTypeOf<StartsWith<'straße', 'strasse'>>().toBe<false>();
expectTypeOf<StartsWith<'İstanbul', 'Istanbul'>>().toBe<false>();

// Input unions distribute; a prefix union matches any member.
expectTypeOf<StartsWith<'user:created' | 'user:deleted', 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'order:created' | 'order:deleted', 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<'user:created' | 'order:created', 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', 'user:' | 'order:'>>().toBe<true>();
expectTypeOf<StartsWith<'other', 'user:' | 'order:'>>().toBe<false>();
expectTypeOf<StartsWith<'user:created' | 'order:created', 'user:' | 'order:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created' | 'other', 'user:' | 'order:'>>().toBe<boolean>();
expectTypeOf<StartsWith<string, '' | 'user:'>>().toBe<true>();

// A known start can guarantee a match even when the remainder is unknown.
expectTypeOf<StartsWith<`user:${string}`, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${number}`, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${bigint}`, 'user'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${Uppercase<string>}`, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}`, 'user:created'>>().toBe<boolean>();
expectTypeOf<StartsWith<`order:${string}`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${string}:created`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${number}`, '1'>>().toBe<boolean>();
expectTypeOf<StartsWith<Uppercase<string>, 'A'>>().toBe<boolean>();
expectTypeOf<StartsWith<string, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created' | string, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<LiteralUnion<'user:created', string>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`+${number}`, '+'>>().toBe<true>();
expectTypeOf<StartsWith<`-${number}`, '-'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${number}${string}`, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<`${string}${number}`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${number}:user`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${Uppercase<string>}:created`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Uppercase<`user:${string}`>, 'user:'>>().toBe<boolean>();

// An unknown prefix cannot be decided, so the result is `boolean` rather than a template pattern match.
expectTypeOf<StartsWith<'user:created', string>>().toBe<boolean>();
expectTypeOf<StartsWith<string, string>>().toBe<boolean>();
expectTypeOf<StartsWith<'', string>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', `user:${string}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', `${string}:`>>().toBe<boolean>();
expectTypeOf<StartsWith<'123', `${number}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'ABC', Uppercase<string>>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', 'user:' | `${number}`>>().toBe<boolean>();

// A case transform on a literal prefix resolves before matching.
expectTypeOf<StartsWith<'USER:created', Uppercase<'user:'>>>().toBe<true>();
expectTypeOf<StartsWith<'User:created', Capitalize<'user:'>>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Uppercase<'user:'>>>().toBe<false>();
expectTypeOf<StartsWith<Uppercase<string>, Uppercase<'user:'>>>().toBe<boolean>();
expectTypeOf<StartsWith<`user:${Uppercase<string>}`, 'USER:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Lowercase<string>, ''>>().toBe<true>();
expectTypeOf<StartsWith<Capitalize<string>, ''>>().toBe<true>();
expectTypeOf<StartsWith<Uncapitalize<string>, ''>>().toBe<true>();

// Brands describe the string without changing its characters.
expectTypeOf<StartsWith<Tagged<'user:created', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<'order:created', 'Event'>, 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<'user:created', Tagged<'user:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<Tagged<'user:created', 'Event'>, 'Validated'>, Tagged<'user:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<`user:${string}`, 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<string, 'Event'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', Tagged<string, 'Prefix'>>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<string, 'Event'>, ''>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Tagged<'order:', 'Prefix'>>>().toBe<false>();

// Deep, repeated, and union tags unwrap in both positions.
expectTypeOf<StartsWith<Tagged<Tagged<Tagged<'user:created', 'A'>, 'B'>, 'C'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Tagged<Tagged<Tagged<'user:', 'A'>, 'B'>, 'C'>>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<Tagged<string, 'A'>, 'B'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'user:created', 'A' | 'B'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<Tagged<'user:created', 'A'>, 'B', {level: 1}>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Opaque<Tagged<'user:created', 'A'>, 'B'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<Opaque<'user:created', 'A'>, 'B'>, 'user:'>>().toBe<true>();

// A tag does not change an empty or `never` base.
expectTypeOf<StartsWith<Tagged<never, 'E'>, 'user:'>>().toBe<never>();
expectTypeOf<StartsWith<'', Tagged<never, 'P'>>>().toBe<false>();
expectTypeOf<StartsWith<Tagged<'', 'E'>, 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<Tagged<'user', 'E'>, 'user:'>>().toBe<false>();

// A branded union distributes its own members, even inside a plain union.
expectTypeOf<StartsWith<Tagged<'user:a' | 'user:b', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<'order:a' | 'order:b', 'Event'>, 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<Opaque<'user:a' | 'user:b', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Opaque<'order:a' | 'order:b', 'Event'>, 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<Tagged<'user:a' | 'order:b', 'Event'> | 'other', 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'user:a' | 'user:b', 'Event'> | 'other', 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'order:a' | 'order:b', 'Event'> | 'other', 'user:'>>().toBe<false>();
expectTypeOf<StartsWith<Tagged<'user:a', 'Event'> | Opaque<'user:b', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<string, 'E'> | 'order:created', 'user:'>>().toBe<boolean>();

// A branded prefix union decides through its members.
expectTypeOf<StartsWith<'other:a', Tagged<'user:' | 'order:', 'Prefix'>>>().toBe<false>();
expectTypeOf<StartsWith<'user:a', Tagged<'' | 'user:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<'order:a', Tagged<'' | 'user:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<string, Tagged<'', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Tagged<'', 'P'> | 'order:'>>().toBe<true>();

type BrandedString<Value extends string> = Value & {readonly brand: unique symbol};

expectTypeOf<StartsWith<BrandedString<'user:created'>, BrandedString<'user:'>>>().toBe<true>();
expectTypeOf<StartsWith<BrandedString<string>, 'user:'>>().toBe<boolean>();

// A flavor is a brand too, so it unwraps the same way.
expectTypeOf<StartsWith<Flavor<'user:created', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Flavor<string, 'Event'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', Flavor<'user:', 'Prefix'>>>().toBe<true>();

enum EventName {
	UserCreated = 'user:created',
	OrderCreated = 'order:created',
}

enum EventPrefix {
	User = 'user:',
	Order = 'order:',
}

expectTypeOf<StartsWith<EventName.UserCreated, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<EventName.OrderCreated, EventPrefix.User>>().toBe<false>();
expectTypeOf<StartsWith<'user:created', EventPrefix.User>>().toBe<true>();
expectTypeOf<StartsWith<EventName, EventPrefix>>().toBe<true>();
expectTypeOf<StartsWith<EventName, EventPrefix.User>>().toBe<boolean>();
expectTypeOf<StartsWith<EventPrefix.User, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<EventName.UserCreated, EventPrefix.User>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', EventName.UserCreated>>().toBe<true>();
expectTypeOf<StartsWith<EventName, 'user'>>().toBe<boolean>();
expectTypeOf<StartsWith<EventName.OrderCreated, EventName.UserCreated>>().toBe<false>();
expectTypeOf<StartsWith<EventName, EventName>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<EventName, 'E'>, EventPrefix>>().toBe<true>();
expectTypeOf<StartsWith<EventName.UserCreated, Tagged<EventPrefix.User, 'P'>>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', EventPrefix.User | EventPrefix.Order>>().toBe<true>();

enum NumericEvent {
	One = 1,
}

// @ts-expect-error Numeric enum members are numbers, not strings.
type NumericEnumInput = StartsWith<NumericEvent.One, '1'>;

// An empty input union produces no results; an empty prefix union cannot match.
expectTypeOf<StartsWith<never, 'user:'>>().toBe<never>();
expectTypeOf<StartsWith<never, string>>().toBe<never>();
expectTypeOf<StartsWith<never, any>>().toBe<never>();
expectTypeOf<StartsWith<never, never>>().toBe<never>();
expectTypeOf<StartsWith<'user:created', never>>().toBe<false>();
expectTypeOf<StartsWith<string, never>>().toBe<false>();
expectTypeOf<StartsWith<any, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', any>>().toBe<boolean>();
expectTypeOf<StartsWith<any, any>>().toBe<boolean>();
expectTypeOf<StartsWith<any, ''>>().toBe<boolean>();
expectTypeOf<StartsWith<any, never>>().toBe<false>();

// @ts-expect-error Only string inputs are supported.
type UnknownInput = StartsWith<unknown, 'user:'>;
// @ts-expect-error Only string prefixes are supported.
type UnknownPrefix = StartsWith<'user:created', unknown>;
// @ts-expect-error Numbers are not coerced to strings.
type NumericInput = StartsWith<123, '1'>;
// @ts-expect-error Prefixes are not coerced to strings.
type NumericPrefix = StartsWith<'123', 1>;
// @ts-expect-error Non-string union members are rejected.
type MixedInput = StartsWith<'user:created' | undefined, 'user:'>;
// @ts-expect-error Boxed strings are not primitive strings.
type BoxedInput = StartsWith<String, 'user:'>;

// Matching does not need to recurse through the input.
expectTypeOf<StartsWith<`user:${StringRepeat<'x', 1500>}`, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<StringRepeat<'x', 1500>, StringRepeat<'x', 1200>>>().toBe<true>();

// Filter a union by its prefix, as in the documentation.
type UserEvents<Event extends string> = Event extends unknown
	? StartsWith<Event, 'user:'> extends true ? Event : never
	: never;

expectTypeOf<UserEvents<'user:created' | 'order:created' | 'user:deleted'>>().toBe<'user:created' | 'user:deleted'>();
expectTypeOf<UserEvents<string>>().toBe<never>();
expectTypeOf<UserEvents<never>>().toBe<never>();

// Use the predicate to validate event names while retaining their literal types.
declare function onUserEvent<const Event extends string>(event: StartsWith<Event, 'user:'> extends true ? Event : never): Event;

expectTypeOf(onUserEvent('user:created')).toBe<'user:created'>();
// @ts-expect-error The event does not have the required prefix.
onUserEvent('order:created');
// @ts-expect-error A wide string does not guarantee the required prefix.
onUserEvent('user:created' as string);

function _readPrefixFlag<Value extends string, Prefix extends string>(flag: StartsWith<Value, Prefix>): boolean {
	return flag;
}

// Prefix alternatives can overlap, include the entire value, or cover an empty input.
expectTypeOf<StartsWith<'user:created', 'u' | 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', 'user:created' | 'user:deleted'>>().toBe<true>();
expectTypeOf<StartsWith<'user', 'user:' | 'users'>>().toBe<false>();
expectTypeOf<StartsWith<'', '' | 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'' | 'user:created', 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'' | 'order:created', '' | 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created' | 'order:created', 'user:created' | 'order:created'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created' | 'order:created', 'user:created' | 'order:deleted'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user', 'user' | 'users'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created' | 'user:deleted' | 'order:created', 'user' | 'order'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created' | 'order:created', never>>().toBe<false>();
expectTypeOf<StartsWith<`user:${string}`, 'user:' | ''>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}`, 'user:' | 'user:created'>>().toBe<true>();

// Finite interpolations are literal unions, including boolean, null, and undefined text.
expectTypeOf<StartsWith<`${'user' | 'order'}:${'created' | 'deleted'}`, 'user:' | 'order:'>>().toBe<true>();
expectTypeOf<StartsWith<`${'user' | 'order'}:${'created' | 'deleted'}`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', `${'user' | 'order'}:`>>().toBe<true>();
expectTypeOf<StartsWith<'other:created', `${'user' | 'order'}:`>>().toBe<false>();
expectTypeOf<StartsWith<`enabled:${boolean}`, 'enabled:'>>().toBe<true>();
expectTypeOf<StartsWith<`enabled:${boolean}`, 'enabled:true'>>().toBe<boolean>();
expectTypeOf<StartsWith<'true:value', `${boolean}:`>>().toBe<true>();
expectTypeOf<StartsWith<'truthy:value', `${boolean}:`>>().toBe<false>();
expectTypeOf<StartsWith<`${null | undefined}:value`, 'null:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${null | undefined}:value`, 'null:' | 'undefined:'>>().toBe<true>();
expectTypeOf<StartsWith<`${1 | 2}:${'read' | 'write'}`, '1:' | '2:'>>().toBe<true>();
expectTypeOf<StartsWith<'2:write', `${1n | 2n}:`>>().toBe<true>();
expectTypeOf<StartsWith<'false:value', `${boolean}:`>>().toBe<true>();
expectTypeOf<StartsWith<`x${boolean}`, 'xtrue'>>().toBe<boolean>();
expectTypeOf<StartsWith<`x${boolean}`, 'xtrue' | 'xfalse'>>().toBe<true>();
expectTypeOf<StartsWith<'undefined:value', `${null | undefined}:`>>().toBe<true>();
expectTypeOf<StartsWith<`${-1}`, '-1'>>().toBe<true>();
expectTypeOf<StartsWith<`${1n | 2n}:`, '2:'>>().toBe<boolean>();
expectTypeOf<StartsWith<'1:read', `${1 | 2}:${'read' | 'write'}`>>().toBe<true>();
expectTypeOf<StartsWith<'3:read', `${1 | 2}:${'read' | 'write'}`>>().toBe<false>();
expectTypeOf<StartsWith<'user:created', `${'user' | 'order'}:created`>>().toBe<true>();
expectTypeOf<StartsWith<'admin:created', `${'user' | 'order'}:created`>>().toBe<false>();

// A known start is enough even with multiple unknown segments or case transformations.
expectTypeOf<StartsWith<`/api/${string}/${number}`, '/api/'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}:created`, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}`, 'u' | 'order:'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}` | `order:${number}`, 'user:' | 'order:'>>().toBe<true>();
expectTypeOf<StartsWith<`user:${string}` | 'order:created', 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Uppercase<`user:${string}`>, 'USER:'>>().toBe<true>();
expectTypeOf<StartsWith<Lowercase<`USER:${string}`>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Capitalize<`user:${string}`>, 'User:'>>().toBe<true>();
expectTypeOf<StartsWith<Uncapitalize<`USER:${string}`>, 'uSER:'>>().toBe<true>();
expectTypeOf<StartsWith<`${number}:user`, ''>>().toBe<true>();
expectTypeOf<StartsWith<`${bigint}`, ''>>().toBe<true>();

// Unknown inputs conservatively return boolean even when a mismatch seems apparent.
expectTypeOf<StartsWith<`order:${number}`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${bigint}`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Lowercase<string>, 'USER:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`user:${string}`, 'user:created' | 'user:deleted'>>().toBe<boolean>();
expectTypeOf<StartsWith<LiteralUnion<'user:created', `user:${string}`>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<string & {}, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<string & {}, ''>>().toBe<true>();
expectTypeOf<StartsWith<string, 'user:created'>>().toBe<boolean>();
expectTypeOf<StartsWith<`${number}`, '123'>>().toBe<boolean>();
expectTypeOf<StartsWith<`Order:${string}`, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<`user:${string}`, `user:${number}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:42', `user:${number}`>>().toBe<boolean>();
expectTypeOf<StartsWith<LiteralUnion<'user:created', string>, 'user:created'>>().toBe<boolean>();
expectTypeOf<StartsWith<string & {}, 'user:created'>>().toBe<boolean>();
expectTypeOf<StartsWith<string & {}, string & {}>>().toBe<boolean>();

// A non-literal prefix makes the complete prefix choice uncertain.
expectTypeOf<StartsWith<'user:created', 'order:' | `user:${string}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', '' | `${number}`>>().toBe<boolean>();
expectTypeOf<StartsWith<`user:${string}`, `user:${string}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'order:created', `user:${string}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'', `${number}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'123', `${bigint}`>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', LiteralUnion<'user:', string>>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', string & {}>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', Lowercase<string>>>().toBe<boolean>();
expectTypeOf<StartsWith<'User:created', Capitalize<string>>>().toBe<boolean>();
expectTypeOf<StartsWith<'user:created', Uncapitalize<string>>>().toBe<boolean>();

// Unicode prefixes can end before a whole grapheme, without normalization.
expectTypeOf<StartsWith<'🦄 magic', '🦄 '>>().toBe<true>();
expectTypeOf<StartsWith<'👩‍💻 developer', '👩'>>().toBe<true>();
expectTypeOf<StartsWith<'🇯🇵 flag', '🇯🇵'>>().toBe<true>();
expectTypeOf<StartsWith<'🇯🇵 flag', '🇯'>>().toBe<true>();
expectTypeOf<StartsWith<'❤️ love', '❤'>>().toBe<true>();
expectTypeOf<StartsWith<'e\u{301}clair', 'e'>>().toBe<true>();
expectTypeOf<StartsWith<'éclair', 'e\u{301}'>>().toBe<false>();
expectTypeOf<StartsWith<'\r\nheader', '\r\n'>>().toBe<true>();
expectTypeOf<StartsWith<'\\\\server\\share', '\\\\'>>().toBe<true>();
expectTypeOf<StartsWith<'^user.*', '^user.'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', '^user'>>().toBe<false>();

// Unwrapping works independently on each member, including legacy opaque strings.
expectTypeOf<StartsWith<Opaque<'user:created', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Opaque<'user:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<Opaque<'order:created', 'Event'>, Opaque<'user:', 'Prefix'>>>().toBe<false>();
expectTypeOf<StartsWith<Opaque<string, 'Event'>, ''>>().toBe<true>();
expectTypeOf<StartsWith<Opaque<string, 'Event'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Opaque<`user:${number}`, 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Opaque<`user:${string}`, 'Prefix'>>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'user:created', 'Event', {validated: true}>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<'user:created' | 'order:created', 'Event'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'user:created' | 'user:deleted', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Tagged<'user:' | 'order:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<'user:created' | Tagged<'order:created', 'Event'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'user:created', 'Event'> | Opaque<'user:deleted', 'Event'>, 'user:'>>().toBe<true>();
expectTypeOf<StartsWith<'order:created', 'user:' | Tagged<'order:', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<Tagged<'' | 'user:created', 'Event'>, 'user:'>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<'', 'Event'>, Tagged<'', 'Prefix'>>>().toBe<true>();
expectTypeOf<StartsWith<BrandedString<`user:${number}`>, BrandedString<'user:'>>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', BrandedString<string>>>().toBe<boolean>();
expectTypeOf<StartsWith<BrandedString<'user:created'> | 'order:created', BrandedString<'user:'> | 'order:'>>().toBe<true>();
expectTypeOf<StartsWith<'user:created', Tagged<'user:', 'Prefix'> | Tagged<string, 'Dynamic'>>>().toBe<boolean>();

// String enums also work as exact prefixes and as members of mixed unions.
expectTypeOf<StartsWith<EventName.UserCreated, EventName.UserCreated>>().toBe<true>();
expectTypeOf<StartsWith<'user:created:received', EventName.UserCreated>>().toBe<true>();
expectTypeOf<StartsWith<'user:', EventName.UserCreated>>().toBe<false>();
expectTypeOf<StartsWith<EventName | 'system:ready', EventPrefix>>().toBe<boolean>();
expectTypeOf<StartsWith<Tagged<EventName.UserCreated, 'Event'>, EventPrefix.User>>().toBe<true>();
expectTypeOf<StartsWith<EventName, ''>>().toBe<true>();

// Empty choices and dynamic operands retain their documented precedence.
expectTypeOf<StartsWith<never, ''>>().toBe<never>();
expectTypeOf<StartsWith<never, Tagged<'user:', 'Prefix'>>>().toBe<never>();
expectTypeOf<StartsWith<'', never>>().toBe<false>();
expectTypeOf<StartsWith<`user:${string}`, never>>().toBe<false>();
expectTypeOf<StartsWith<Tagged<string, 'Event'>, never>>().toBe<false>();
expectTypeOf<StartsWith<never, `user:${string}`>>().toBe<never>();
expectTypeOf<StartsWith<'', any>>().toBe<boolean>();
expectTypeOf<StartsWith<any, 'user:' | 'order:'>>().toBe<boolean>();
expectTypeOf<StartsWith<any, `user:${string}`>>().toBe<boolean>();

// Both positions reject every kind of non-string operand.
// @ts-expect-error A null input is not a string.
type NullInput = StartsWith<null, ''>;
// @ts-expect-error An undefined input is not a string.
type UndefinedInput = StartsWith<undefined, ''>;
// @ts-expect-error Boolean inputs are not coerced to text.
type BooleanInput = StartsWith<true, 'true'>;
// @ts-expect-error Bigint inputs are not coerced to text.
type BigintInput = StartsWith<1n, '1'>;
// @ts-expect-error A symbol cannot be matched as a string.
type SymbolInput = StartsWith<symbol, ''>;
// @ts-expect-error An object with a string representation is not a string.
type ObjectInput = StartsWith<{toString(): string}, ''>;
// @ts-expect-error Null prefixes are not coerced to text.
type NullPrefix = StartsWith<'null', null>;
// @ts-expect-error Undefined prefixes are not coerced to text.
type UndefinedPrefix = StartsWith<'undefined', undefined>;
// @ts-expect-error Boolean prefixes are not coerced to text.
type BooleanPrefix = StartsWith<'true', true>;
// @ts-expect-error Bigint prefixes are not coerced to text.
type BigintPrefix = StartsWith<'1', 1n>;
// @ts-expect-error Symbols are not string prefixes.
type SymbolPrefix = StartsWith<'user:created', symbol>;
// @ts-expect-error Boxed prefixes are not primitive strings.
type BoxedPrefix = StartsWith<'user:created', String>;
// @ts-expect-error A prefix union must contain only strings.
type MixedPrefix = StartsWith<'user:created', 'user:' | undefined>;
// @ts-expect-error An array of characters is not a prefix.
type ArrayPrefix = StartsWith<'user:created', ['u', 's', 'e', 'r']>;

// Long strings distinguish equality, a shorter input, and a late mismatch.
type LongPrefix = StringRepeat<'x', 1200>;
expectTypeOf<StartsWith<LongPrefix, LongPrefix>>().toBe<true>();
expectTypeOf<StartsWith<LongPrefix, `${LongPrefix}x`>>().toBe<false>();
expectTypeOf<StartsWith<`${LongPrefix}y`, `${LongPrefix}z`>>().toBe<false>();
expectTypeOf<StartsWith<`${LongPrefix}y`, LongPrefix | 'y'>>().toBe<true>();

// The documented filter keeps only guaranteed matches and preserves their identities.
expectTypeOf<UserEvents<'' | 'user:' | 'user:updated'>>().toBe<'user:' | 'user:updated'>();
expectTypeOf<UserEvents<`user:${string}` | 'order:created'>>().toBe<`user:${string}`>();
expectTypeOf<UserEvents<`${string}:created`>>().toBe<never>();
expectTypeOf<UserEvents<Tagged<'user:created', 'Event'> | 'order:created'>>().toBe<Tagged<'user:created', 'Event'>>();
expectTypeOf<UserEvents<EventName>>().toBe<EventName.UserCreated>();
expectTypeOf(onUserEvent('user:')).toBe<'user:'>();
expectTypeOf(onUserEvent('user:42' as `user:${number}`)).toBe<`user:${number}`>();
expectTypeOf(onUserEvent('user:created' as Tagged<'user:created', 'Event'>)).toBe<Tagged<'user:created', 'Event'>>();
// @ts-expect-error A mixed union contains an event outside the required prefix.
onUserEvent('user:created' as 'user:created' | 'order:created');
// @ts-expect-error A suffix alone does not guarantee the required prefix.
onUserEvent('user:created' as `${string}:created`);

// Generic call sites infer literal inputs and propagate uncertain results.
declare function hasPrefix<const Value extends string, const Prefix extends string>(value: Value, prefix: Prefix): StartsWith<Value, Prefix>;
expectTypeOf(hasPrefix('/api/users', '/api/')).toBe<true>();
expectTypeOf(hasPrefix('/settings', '/api/')).toBe<false>();
expectTypeOf(hasPrefix('/api/users' as string, '/api/')).toBe<boolean>();
expectTypeOf(hasPrefix('/api/users', '/api/' as string)).toBe<boolean>();
expectTypeOf(hasPrefix('/api/users' as `/api/${string}`, '/api/')).toBe<true>();
expectTypeOf(hasPrefix('/api/users', '/api/' as '/api/' | '/admin/')).toBe<true>();
expectTypeOf(hasPrefix('/api/users', '' as string)).toBe<boolean>();
expectTypeOf(hasPrefix('/api/users' as Tagged<'/api/users', 'URL'>, '/api/')).toBe<true>();

// Prefix predicates can select object keys without changing their property modifiers.
type UserEventHandlers<Events> = {
	[Key in keyof Events as Key extends string ? StartsWith<Key, 'user:'> extends true ? Key : never : never]: Events[Key];
};
type Handlers = {
	readonly 'user:created': (identifier: number) => void;
	'user:deleted'?: () => void;
	'order:created': () => void;
	0: () => void;
};
expectTypeOf<UserEventHandlers<Handlers>>().toBe<{
	readonly 'user:created': (identifier: number) => void;
	'user:deleted'?: () => void;
}>();
expectTypeOf<UserEventHandlers<Record<`user:${string}`, number>>>().toBe<Record<`user:${string}`, number>>();
expectTypeOf<UserEventHandlers<Record<string, number>>>().toBe<{}>();
expectTypeOf<UserEventHandlers<Record<`order:${string}`, number>>>().toBe<{}>();
expectTypeOf<UserEventHandlers<Record<`user:${string}` | `order:${string}`, number>>>().toBe<Record<`user:${string}`, number>>();
