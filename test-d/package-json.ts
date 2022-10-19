import {expectTypeOf} from 'expect-type';
import type {PackageJson, LiteralUnion, JsonObject} from '../index';

const packageJson: PackageJson = {};

expectTypeOf(packageJson.name).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.version).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.description).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.keywords).toEqualTypeOf<string[] | undefined>();
expectTypeOf(packageJson.homepage).toEqualTypeOf<LiteralUnion<'.', string> | undefined>();
expectTypeOf(packageJson.bugs).toEqualTypeOf<PackageJson.BugsLocation | undefined>();
expectTypeOf(packageJson.license).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.licenses).toEqualTypeOf<Array<{type?: string; url?: string}> | undefined>();
expectTypeOf(packageJson.author).toEqualTypeOf<PackageJson.Person | undefined>();
expectTypeOf(packageJson.contributors).toEqualTypeOf<PackageJson.Person[] | undefined>();
expectTypeOf(packageJson.maintainers).toEqualTypeOf<PackageJson.Person[] | undefined>();
expectTypeOf(packageJson.files).toEqualTypeOf<string[] | undefined>();
expectTypeOf(packageJson.main).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.packageManager).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.bin).toEqualTypeOf<string | Partial<Record<string, string>> | undefined>();
expectTypeOf(packageJson.types).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.typings).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.man).toEqualTypeOf<string | string[] | undefined>();
expectTypeOf(packageJson.directories).toEqualTypeOf<PackageJson.DirectoryLocations | undefined>();
expectTypeOf(
	packageJson.repository,
).toEqualTypeOf<{type: string; url: string; directory?: string} | string | undefined>();
expectTypeOf(packageJson.scripts).toEqualTypeOf<PackageJson.Scripts | undefined>();
expectTypeOf(packageJson.config).toEqualTypeOf<JsonObject | undefined>();
expectTypeOf(packageJson.dependencies).toEqualTypeOf<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.devDependencies).toEqualTypeOf<PackageJson.Dependency | undefined>();
expectTypeOf(
	packageJson.optionalDependencies,
).toEqualTypeOf<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.peerDependencies).toEqualTypeOf<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.bundleDependencies).toEqualTypeOf<string[] | undefined>();
expectTypeOf(packageJson.bundledDependencies).toEqualTypeOf<string[] | undefined>();
expectTypeOf(packageJson.resolutions).toEqualTypeOf<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.workspaces).toEqualTypeOf<PackageJson.WorkspaceConfig | string[] | undefined>();
expectTypeOf(packageJson.engines).toEqualTypeOf<Partial<Record<string, string>> | undefined>();
expectTypeOf(packageJson.engineStrict).toEqualTypeOf<boolean | undefined>();
expectTypeOf(packageJson.os).toMatchTypeOf<
| undefined
| Array<LiteralUnion<
'darwin' | 'linux' | 'win32' | '!darwin' | '!linux' | '!win32',
string
>>
>();
expectTypeOf(packageJson.cpu).toMatchTypeOf<
| undefined
| Array<LiteralUnion<
'x64' | 'ia32' | 'arm' | 'mips' | '!x64' | '!ia32' | '!arm' | '!mips',
string
>>
>();
expectTypeOf(packageJson.preferGlobal).toEqualTypeOf<boolean | undefined>();
expectTypeOf(packageJson.private).toEqualTypeOf<boolean | undefined>();
expectTypeOf(packageJson.publishConfig).toEqualTypeOf<PackageJson.PublishConfig | undefined>();
expectTypeOf(packageJson.module).toEqualTypeOf<string | undefined>();
expectTypeOf(packageJson.esnext).toEqualTypeOf<
| string
| {
	[moduleName: string]: string | undefined;
	main?: string;
	browser?: string;
}
| undefined
>();
expectTypeOf(packageJson.jspm).toEqualTypeOf<PackageJson | undefined>();

// Undefined assigns
expectTypeOf<{dep: undefined}>().toMatchTypeOf<PackageJson.Dependency>();
expectTypeOf<{engine: undefined}>().toMatchTypeOf<typeof packageJson['engines']>();
expectTypeOf<{unknownScript: undefined}>().toMatchTypeOf<typeof packageJson['scripts']>();
expectTypeOf<{bin: undefined}>().toMatchTypeOf<typeof packageJson['bin']>();
expectTypeOf({
	'>=4': {
		'*': ['src'],
		somethingElse: undefined,
	},
	'<4': undefined,
}).toMatchTypeOf<typeof packageJson['typesVersions']>();

// Must reject an object that contains properties with `undefined` values.
// See https://github.com/sindresorhus/type-fest/issues/272
declare function setConfig(config: JsonObject): void;

// @ts-expect-error
setConfig({bugs: undefined});
// @ts-expect-error
setConfig({bugs: {life: undefined}});

expectTypeOf<{bugs: undefined}>().not.toMatchTypeOf<JsonObject>();
expectTypeOf<{bugs: {life: undefined}}>().not.toMatchTypeOf<JsonObject>();

expectTypeOf<{}>().toMatchTypeOf<JsonObject>();
expectTypeOf<{bugs: 42}>().toMatchTypeOf<JsonObject>();
expectTypeOf<{bugs: [42]}>().toMatchTypeOf<JsonObject>();
expectTypeOf<{bugs: {life: 42}}>().toMatchTypeOf<JsonObject>();

// `PackageJson` should be a valid `JsonObject`.
// See https://github.com/sindresorhus/type-fest/issues/79
type UnknownRecord = Record<string, unknown>;

const unknownRecord: UnknownRecord = {};
const jsonObject: JsonObject = {};

expectTypeOf(packageJson).toMatchTypeOf<UnknownRecord>();
expectTypeOf(unknownRecord).not.toMatchTypeOf<PackageJson>();

expectTypeOf(jsonObject).toMatchTypeOf<PackageJson>();
expectTypeOf(packageJson).toMatchTypeOf<JsonObject>();
