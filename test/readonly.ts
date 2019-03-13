import {expectType} from 'tsd-check';
import {Readonly} from '..';

declare const readonly: Readonly<{a: number; b: string}>;
expectType<{readonly a: number; readonly b: string}>(readonly);
