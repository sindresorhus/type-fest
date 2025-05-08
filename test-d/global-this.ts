import {expectType} from 'tsd';
import type {GlobalThis} from '../index.d.ts';

type ExtraProperties = GlobalThis & {
	readonly GLOBAL_TOKEN: string;
};

// Verify `globalThis` can be cast to a type which extends `GlobalThis`.
expectType<string>((globalThis as ExtraProperties).GLOBAL_TOKEN);

// Verify that object literals cannot be cast to a type which extends `GlobalThis`.
declare function consumeExtraProperties(extraProperties: ExtraProperties): void;
// @ts-expect-error
consumeExtraProperties(({something: 'value'}) as ExtraProperties);
