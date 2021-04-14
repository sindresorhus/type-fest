import {expectType} from 'tsd';
import {AsExtendable} from '../ts41';

namespace JSX {
	export interface IntrinsicElements {
		a: AnchorProps;
	}

	export interface AnchorProps {
		foo: string;
	}
}

interface EnhancedAnchorProps extends AsExtendable<JSX.IntrinsicElements['a']> {
	bar: number;
}

declare const props: EnhancedAnchorProps;
expectType<string>(props.foo);
expectType<number>(props.bar);
