import {expectType} from 'tsd';
import {Passthrough} from '..';

namespace JSX {
	export interface IntrinsicElements {
		a: AnchorProps;
	}

	export interface AnchorProps {
		foo: string;
	}
}

interface EnhancedAnchorProps extends Passthrough<JSX.IntrinsicElements['a']> {
	bar: number;
}

declare const props: EnhancedAnchorProps;
expectType<string>(props.foo);
expectType<number>(props.bar);
