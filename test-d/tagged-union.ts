import {expectAssignable, expectNotAssignable} from 'tsd';
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

expectAssignable<Union>(first);
expectAssignable<Union>(second);

const fails = {
	tag: 'num' as const,
	b: 'should not be string',
};

const failsToo = {
	tag: 'str' as const,
	b: 2,
};

expectNotAssignable<Union>(fails);
expectNotAssignable<Union>(failsToo);

// Issue #1211: `TaggedUnion` should be usable through a generic wrapper whose
// members are constrained as `Record<string, unknown>`, as shown in the docs.
type Tagged<Fields extends Record<string, unknown>> = TaggedUnion<'type', Fields>;

type EventMessage = Tagged<{
	OpenExternalUrl: {url: string; id: number};
	ToggleBackButtonVisibility: {visible: boolean};
}>;

expectAssignable<EventMessage>({type: 'OpenExternalUrl', url: 'https://example.com', id: 1});
expectAssignable<EventMessage>({type: 'ToggleBackButtonVisibility', visible: true});

// The discriminant still narrows the field types correctly.
expectNotAssignable<EventMessage>({type: 'ToggleBackButtonVisibility', visible: 'yes'});
