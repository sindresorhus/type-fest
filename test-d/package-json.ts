import {expectType, expectAssignable, expectNotAssignable} from 'tsd';
import type {PackageJson, LiteralUnion, JsonObject} from '../index.d.ts';

const packageJson: PackageJson = {};

expectType<string | undefined>(packageJson.name);
expectType<string | undefined>(packageJson.version);
expectType<string | undefined>(packageJson.description);
expectType<string[] | undefined>(packageJson.keywords);
expectType<LiteralUnion<'.', string> | undefined>(packageJson.homepage);
expectType<PackageJson.BugsLocation | undefined>(packageJson.bugs);
expectType<string | undefined>(packageJson.license);
expectType<Array<{type?: string; url?: string}> | undefined>(packageJson.licenses);
expectType<PackageJson.Person | undefined>(packageJson.author);
expectType<PackageJson.Person[] | undefined>(packageJson.contributors);
expectType<PackageJson.Person[] | undefined>(packageJson.maintainers);
expectType<string[] | undefined>(packageJson.files);
expectType<string | undefined>(packageJson.main);
expectType<string | undefined>(packageJson.packageManager);
expectType<string | Partial<Record<string, string>> | undefined>(packageJson.bin);
expectType<string | undefined>(packageJson.types);
expectType<string | undefined>(packageJson.typings);
expectType<string | string[] | undefined>(packageJson.man);
expectType<PackageJson.DirectoryLocations | undefined>(packageJson.directories);
expectType<{type: string; url: string; directory?: string} | string | undefined>(
	packageJson.repository,
);
expectType<PackageJson.Scripts | undefined>(packageJson.scripts);
expectType<JsonObject | undefined>(packageJson.config);
expectType<PackageJson.Dependency | undefined>(packageJson.dependencies);
expectType<PackageJson.Dependency | undefined>(packageJson.devDependencies);
expectType<PackageJson.Dependency | undefined>(
	packageJson.optionalDependencies,
);
expectType<PackageJson.Dependency | undefined>(packageJson.peerDependencies);
expectType<string[] | undefined>(packageJson.bundleDependencies);
expectType<string[] | undefined>(packageJson.bundledDependencies);
expectType<PackageJson.Dependency | undefined>(packageJson.resolutions);
expectType<PackageJson.WorkspaceConfig | string[] | undefined>(packageJson.workspaces);
expectType<Partial<Record<string, string>> | undefined>(packageJson.engines);
expectType<boolean | undefined>(packageJson.engineStrict);
expectAssignable<
| undefined
| Array<LiteralUnion<
'darwin' | 'linux' | 'win32' | '!darwin' | '!linux' | '!win32',
string
>>
>(packageJson.os);
expectAssignable<
| undefined
| Array<LiteralUnion<
'x64' | 'ia32' | 'arm' | 'mips' | '!x64' | '!ia32' | '!arm' | '!mips',
string
>>
>(packageJson.cpu);
expectAssignable<PackageJson.Imports>({'#unicorn': 'unicorn'});
expectAssignable<PackageJson.Imports>({
	'#unicorn': {
		import: {browser: 'unicorn', node: 'pony'},
		require: ['./fallback-1', './fallback-2', {default: './fallback-3', browser: null}],
		custom: null,
		default: 'horse',
	},
});
expectAssignable<PackageJson.Exports>({
	'./unicorn': {
		import: {browser: './unicorn.js', node: './pony.js'},
		require: ['./fallback-1', './fallback-2', {default: './fallback-3', browser: null}],
		custom: null,
		default: './horse.js',
	},
});
expectNotAssignable<PackageJson.Exports>({
	'./unicorn': undefined,
});
expectNotAssignable<PackageJson.Imports>({unicorn: 'unicorn'});
expectType<boolean | undefined>(packageJson.preferGlobal);
expectType<boolean | undefined>(packageJson.private);
expectType<PackageJson.PublishConfig | undefined>(packageJson.publishConfig);
expectType<string | undefined>(packageJson.module);
expectType<
| string
| {
	[moduleName: string]: string | undefined;
	main?: string;
	browser?: string;
}
| undefined
>(packageJson.esnext);
expectType<PackageJson | undefined>(packageJson.jspm);

// Undefined assigns
expectAssignable<PackageJson.Dependency>({dep: undefined});
expectAssignable<typeof packageJson['engines']>({engine: undefined});
expectAssignable<typeof packageJson['scripts']>({unknownScript: undefined});
expectAssignable<typeof packageJson['bin']>({bin: undefined});
expectAssignable<typeof packageJson['typesVersions']>({
	'>=4': {
		'*': ['src'],
		somethingElse: undefined,
	},
	'<4': undefined,
});

// Must reject an object that contains properties with `undefined` values.
// See https://github.com/sindresorhus/type-fest/issues/272
declare function setConfig(config: JsonObject): void;

// @ts-expect-error
setConfig({bugs: undefined});
// @ts-expect-error
setConfig({bugs: {life: undefined}});

expectNotAssignable<JsonObject>({bugs: undefined});
expectNotAssignable<JsonObject>({bugs: {life: undefined}});

expectAssignable<JsonObject>({});
expectAssignable<JsonObject>({bugs: 42});
expectAssignable<JsonObject>({bugs: [42]});
expectAssignable<JsonObject>({bugs: {life: 42}});

// `PackageJson` should be a valid `JsonObject`.
// See https://github.com/sindresorhus/type-fest/issues/79
type UnknownRecord = Record<string, unknown>;

const unknownRecord: UnknownRecord = {};
const jsonObject: JsonObject = {};

expectAssignable<UnknownRecord>(packageJson);
expectNotAssignable<PackageJson>(unknownRecord);

expectAssignable<PackageJson>(jsonObject);
expectAssignable<JsonObject>(packageJson);
