import {expectTypeOf} from 'nz';
import type {GlobalThis} from '../index.d.ts';

type ExtraProperties = GlobalThis & {
	readonly GLOBAL_TOKEN: string;
};

// Verify `globalThis` can be cast to a type which extends `GlobalThis`.
expectTypeOf((globalThis as ExtraProperties).GLOBAL_TOKEN).toBe<string>();

// Verify that object literals cannot be cast to a type which extends `GlobalThis`.
declare function consumeExtraProperties(extraProperties: ExtraProperties): void;
// @ts-expect-error
consumeExtraProperties(({something: 'value'}) as ExtraProperties);
