import {expectType, expectAssignable} from 'tsd';
import type {Jsonifiable, TsConfigJson} from '../index.d.ts';

const tsConfig: TsConfigJson = {};

expectType<boolean | undefined>(tsConfig.compileOnSave);
expectType<TsConfigJson.CompilerOptions | undefined>(tsConfig.compilerOptions);
expectType<string[] | undefined>(tsConfig.exclude);
expectType<string | string[] | undefined>(tsConfig.extends);
expectType<string[] | undefined>(tsConfig.files);
expectType<string[] | undefined>(tsConfig.include);
expectType<TsConfigJson.References[] | undefined>(tsConfig.references);
expectType<TsConfigJson.TypeAcquisition | undefined>(tsConfig.typeAcquisition);
expectAssignable<Jsonifiable>(tsConfig);

expectType<boolean | undefined>(tsConfig.compilerOptions?.noCheck);

// `--lib` names that `tsc` accepts must be accepted here too.
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['es2016', 'es2016.intl']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['ES2016.Intl']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['esnext.sharedmemory']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['ESNext.SharedMemory']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['esnext.date']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['ESNext.Date']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['esnext.typedarrays']}});
expectAssignable<TsConfigJson>({compilerOptions: {lib: ['ESNext.TypedArrays']}});

// A lib name that `tsc` rejects must be rejected here too, otherwise a typo passes silently. `es2022.sharedmemory` is the odd one out: TypeScript has no `lib.es2022.sharedmemory.d.ts`.
type Lib = NonNullable<TsConfigJson.CompilerOptions['lib']>[number];

expectAssignable<Lib>('es2024.sharedmemory');
// @ts-expect-error -- There is no `es2022.sharedmemory` lib.
expectAssignable<Lib>('es2022.sharedmemory');
// @ts-expect-error -- There is no `ES2022.SharedMemory` lib either.
expectAssignable<Lib>('ES2022.SharedMemory');
// @ts-expect-error -- There is no such lib.
expectAssignable<Lib>('not-a-real-lib');

// The compiler rejects a boolean for `generateTrace` with "requires a value of type string".
expectAssignable<TsConfigJson>({compilerOptions: {generateTrace: 'trace'}});
// @ts-expect-error -- the compiler requires a string here
expectAssignable<TsConfigJson>({compilerOptions: {generateTrace: true}});

// The compiler compares these values case-insensitively and the TSConfig reference documents the camelCase spellings, so the common spellings are accepted.
expectAssignable<TsConfigJson>({watchOptions: {watchFile: 'useFsEvents'}});
expectAssignable<TsConfigJson>({watchOptions: {watchFile: 'fixedPollingInterval'}});
expectAssignable<TsConfigJson>({watchOptions: {watchDirectory: 'fixedChunkSizePolling'}});
expectAssignable<TsConfigJson>({watchOptions: {fallbackPolling: 'dynamicPriority'}});

// The watch strategies are only valid under `watchOptions`: tsc answers "Unknown compiler option" for them inside `compilerOptions`, so a config written from this type must not compile here.
// @ts-expect-error
expectAssignable<TsConfigJson>({compilerOptions: {watchFile: 'fixedPollingInterval'}});
// @ts-expect-error
expectAssignable<TsConfigJson>({compilerOptions: {watchDirectory: 'useFsEvents'}});
// @ts-expect-error
expectAssignable<TsConfigJson>({compilerOptions: {fallbackPolling: 'fixedInterval'}});
// @ts-expect-error
expectAssignable<TsConfigJson>({compilerOptions: {watch: true}});

// `listFilesOnly` is a command-line-only flag: tsc answers "can only be specified on command line" for it inside `compilerOptions`, so a config written from this type must not compile here.
// @ts-expect-error
expectAssignable<TsConfigJson>({compilerOptions: {listFilesOnly: true}});

// The watch options are only read under `watchOptions`, but their old value types stay available, deprecated.
expectAssignable<TsConfigJson.CompilerOptions.WatchFile>('useFsEvents');
expectAssignable<TsConfigJson.CompilerOptions.WatchDirectory>('useFsEvents');
expectAssignable<TsConfigJson.CompilerOptions.FallbackPolling>('fixedInterval');
