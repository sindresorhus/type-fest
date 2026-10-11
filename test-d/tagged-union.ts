import {expectTypeOf} from 'nz';
import type {TaggedUnion} from '../index.d.ts';

type Union = TaggedUnion<'tag', {str: {a: string}; num: {b: number}}>;

const first = {
	tag: 'str' as const,
	a: 'some-string',
};

const second = {
	tag: 'num' as const,
	b: 1,
};

expectTypeOf(first).toBeAssignableTo<Union>();
expectTypeOf(second).toBeAssignableTo<Union>();

const fails = {
	tag: 'num' as const,
	b: 'should not be string',
};

const failsToo = {
	tag: 'str' as const,
	b: 2,
};

expectTypeOf(fails).not.toBeAssignableTo<Union>();
expectTypeOf(failsToo).not.toBeAssignableTo<Union>();

// Three members, each with its own fields, and a tag whose name is also a field's name in one of them, which is the case where a key and a tag could be confused for one another.
type ThreeMembers = TaggedUnion<'kind', {
	Open: {url: string; id: number};
	Close: {visible: boolean};
	Move: {to: {x: number; y: number}; kind?: 'Move'};
}>;

// A member's tag is paired with its own fields, so another member's fields do not satisfy it.
({kind: 'Open', url: 'a', id: 1}) satisfies ThreeMembers;
({kind: 'Close', visible: true}) satisfies ThreeMembers;
expectTypeOf({kind: 'Open', visible: true} as const).not.toBeAssignableTo<ThreeMembers>();
expectTypeOf({kind: 'Move', url: 'a', id: 1} as const).not.toBeAssignableTo<ThreeMembers>();

// The optional field stays optional, and the tag is still required.
({kind: 'Move', to: {x: 1, y: 2}}) satisfies ThreeMembers;
expectTypeOf({to: {x: 1, y: 2}} as const).not.toBeAssignableTo<ThreeMembers>();

// An empty record is one member with no fields, which is a tag and nothing else.
type OnlyATag = TaggedUnion<'tag', {A: {}; B: {value: string}}>;
({tag: 'A'}) satisfies OnlyATag;
({tag: 'B', value: 'x'}) satisfies OnlyATag;
// @ts-expect-error
const onlyATag: OnlyATag = {tag: 'A', value: 'x'} as const;
