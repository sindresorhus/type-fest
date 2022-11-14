import {expectType} from 'tsd';
import type {GlobalThis} from '../index';

type ExtraProps = GlobalThis & {
	readonly GLOBAL_TOKEN: string;
};

// Verify `globalThis` can be cast to a type which extends `GlobalThis`.
expectType<string>((globalThis as ExtraProps).GLOBAL_TOKEN);

// Verify that object literals cannot be cast to a type which extends `GlobalThis`.
declare function consumeExtraProps(extraProps: ExtraProps): void;
// @ts-expect-error
consumeExtraProps(({something: 'value'}) as ExtraProps);
