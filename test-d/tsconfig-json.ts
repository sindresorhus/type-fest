import {expectTypeOf} from 'nz';
import type {Jsonifiable, TsConfigJson} from '../index.d.ts';

const tsConfig: TsConfigJson = {};

expectTypeOf(tsConfig.compileOnSave).toBe<boolean | undefined>();
expectTypeOf(tsConfig.compilerOptions).toBe<TsConfigJson.CompilerOptions | undefined>();
expectTypeOf(tsConfig.exclude).toBe<string[] | undefined>();
expectTypeOf(tsConfig.extends).toBe<string | string[] | undefined>();
expectTypeOf(tsConfig.files).toBe<string[] | undefined>();
expectTypeOf(tsConfig.include).toBe<string[] | undefined>();
expectTypeOf(tsConfig.references).toBe<TsConfigJson.References[] | undefined>();
expectTypeOf(tsConfig.typeAcquisition).toBe<TsConfigJson.TypeAcquisition | undefined>();
expectTypeOf(tsConfig).toBeAssignableTo<Jsonifiable>();

expectTypeOf(tsConfig.compilerOptions?.noCheck).toBe<boolean | undefined>();

// `--lib` names that `tsc` accepts must be accepted here too.
({compilerOptions: {lib: ['es2016', 'es2016.intl']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['ES2016.Intl']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['esnext.sharedmemory']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['ESNext.SharedMemory']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['esnext.date']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['ESNext.Date']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['esnext.typedarrays']}}) satisfies TsConfigJson;
({compilerOptions: {lib: ['ESNext.TypedArrays']}}) satisfies TsConfigJson;

// A lib name that `tsc` rejects must be rejected here too, otherwise a typo passes silently. `es2022.sharedmemory` is the odd one out: TypeScript has no `lib.es2022.sharedmemory.d.ts`.
type Lib = NonNullable<TsConfigJson.CompilerOptions['lib']>[number];

expectTypeOf<'es2024.sharedmemory'>().toBeAssignableTo<Lib>();
// @ts-expect-error -- There is no `es2022.sharedmemory` lib.
expectTypeOf<'es2022.sharedmemory'>().toBeAssignableTo<Lib>();
// @ts-expect-error -- There is no `ES2022.SharedMemory` lib either.
expectTypeOf<'ES2022.SharedMemory'>().toBeAssignableTo<Lib>();
// @ts-expect-error -- There is no such lib.
expectTypeOf<'not-a-real-lib'>().toBeAssignableTo<Lib>();

// The compiler rejects a boolean for `generateTrace` with "requires a value of type string".
({compilerOptions: {generateTrace: 'trace'}}) satisfies TsConfigJson;
// @ts-expect-error -- the compiler requires a string here
({compilerOptions: {generateTrace: true}}) satisfies TsConfigJson;

// The compiler compares these values case-insensitively and the TSConfig reference documents the camelCase spellings, so the common spellings are accepted.
({watchOptions: {watchFile: 'useFsEvents'}}) satisfies TsConfigJson;
({watchOptions: {watchFile: 'fixedPollingInterval'}}) satisfies TsConfigJson;
({watchOptions: {watchDirectory: 'fixedChunkSizePolling'}}) satisfies TsConfigJson;
({watchOptions: {fallbackPolling: 'dynamicPriority'}}) satisfies TsConfigJson;

// The watch strategies are only valid under `watchOptions`: tsc answers "Unknown compiler option" for them inside `compilerOptions`, so a config written from this type must not compile here.
// @ts-expect-error
({compilerOptions: {watchFile: 'fixedPollingInterval'}}) satisfies TsConfigJson;
// @ts-expect-error
({compilerOptions: {watchDirectory: 'useFsEvents'}}) satisfies TsConfigJson;
// @ts-expect-error
({compilerOptions: {fallbackPolling: 'fixedInterval'}}) satisfies TsConfigJson;
// @ts-expect-error
({compilerOptions: {watch: true}}) satisfies TsConfigJson;

// `listFilesOnly` is a command-line-only flag: tsc answers "can only be specified on command line" for it inside `compilerOptions`, so a config written from this type must not compile here.
// @ts-expect-error
({compilerOptions: {listFilesOnly: true}}) satisfies TsConfigJson;

// The watch options are only read under `watchOptions`, but their old value types stay available, deprecated.
expectTypeOf<'useFsEvents'>().toBeAssignableTo<TsConfigJson.CompilerOptions.WatchFile>();
expectTypeOf<'useFsEvents'>().toBeAssignableTo<TsConfigJson.CompilerOptions.WatchDirectory>();
expectTypeOf<'fixedInterval'>().toBeAssignableTo<TsConfigJson.CompilerOptions.FallbackPolling>();
