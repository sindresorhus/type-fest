import {expectTypeOf} from 'nz';
import type {PackageJson, LiteralUnion, JsonObject} from '../index.d.ts';

const packageJson: PackageJson = {};

expectTypeOf(packageJson.name).toBe<string | undefined>();
expectTypeOf(packageJson.version).toBe<string | undefined>();
expectTypeOf(packageJson.description).toBe<string | undefined>();
expectTypeOf(packageJson.keywords).toBe<string[] | undefined>();
expectTypeOf(packageJson.homepage).toBe<LiteralUnion<'.', string> | undefined>();
expectTypeOf(packageJson.bugs).toBe<PackageJson.BugsLocation | undefined>();
expectTypeOf(packageJson.license).toBe<string | undefined>();
expectTypeOf(packageJson.licenses).toBe<Array<{type?: string; url?: string}> | undefined>();
expectTypeOf(packageJson.author).toBe<PackageJson.Person | undefined>();
expectTypeOf(packageJson.contributors).toBe<PackageJson.Person[] | undefined>();
expectTypeOf(packageJson.maintainers).toBe<PackageJson.Person[] | undefined>();
expectTypeOf(packageJson.files).toBe<string[] | undefined>();
expectTypeOf(packageJson.main).toBe<string | undefined>();
expectTypeOf(packageJson.packageManager).toBe<string | undefined>();
expectTypeOf(packageJson.bin).toBe<string | Partial<Record<string, string>> | undefined>();
expectTypeOf(packageJson.types).toBe<string | undefined>();
expectTypeOf(packageJson.typings).toBe<string | undefined>();
expectTypeOf(packageJson.man).toBe<string | string[] | undefined>();
expectTypeOf(packageJson.directories).toBe<PackageJson.DirectoryLocations | undefined>();
expectTypeOf(
	packageJson.repository,
).toBe<string | {type: string; url: string; directory?: string} | undefined>();
expectTypeOf(packageJson.scripts).toBe<PackageJson.Scripts | undefined>();
expectTypeOf(packageJson.config).toBe<JsonObject | undefined>();
expectTypeOf(packageJson.dependencies).toBe<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.devDependencies).toBe<PackageJson.Dependency | undefined>();
expectTypeOf(
	packageJson.optionalDependencies,
).toBe<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.peerDependencies).toBe<PackageJson.Dependency | undefined>();
expectTypeOf(packageJson.bundleDependencies).toBe<string[] | undefined>();
expectTypeOf(packageJson.bundledDependencies).toBe<string[] | undefined>();
expectTypeOf(packageJson.resolutions).toBe<PackageJson.Dependency | undefined>();
expectTypeOf<string>().toBe<keyof PackageJson.Dependency>();
expectTypeOf(packageJson.workspaces).toBe<PackageJson.WorkspaceConfig | string[] | undefined>();
({foo: '1.0.0'}) satisfies PackageJson['overrides'];
({foo: {'.': '1.0.0', bar: '1.0.0'}}) satisfies PackageJson['overrides'];
({baz: {bar: {foo: '1.0.0'}}}) satisfies PackageJson['overrides'];
({foo: undefined}) satisfies PackageJson['overrides'];
({foo: {bar: undefined}}) satisfies PackageJson['overrides'];
expectTypeOf<string>().toBe<keyof PackageJson.DependencyOverrides>();
({
	name: 'unicorn',
	version: '>= 1.0.0',
	onFail: 'ignore',
}) satisfies PackageJson.DevEngineDependency;
expectTypeOf(packageJson.engines).toBe<{[EngineName in LiteralUnion<'npm' | 'node', string>]?: string} | undefined>();
expectTypeOf(packageJson.engines).toBeAssignableTo<Partial<Record<string, string>> | undefined>();
expectTypeOf(packageJson.engineStrict).toBe<boolean | undefined>();
expectTypeOf(packageJson.os).toBeAssignableTo<
	| undefined
	| Array<LiteralUnion<
		'darwin' | 'linux' | 'win32' | '!darwin' | '!linux' | '!win32',
		string
	>>>();
expectTypeOf(packageJson.cpu).toBeAssignableTo<
	| undefined
	| Array<LiteralUnion<
		'x64' | 'ia32' | 'arm' | 'mips' | '!x64' | '!ia32' | '!arm' | '!mips',
		string
	>>>();
({'#unicorn': 'unicorn'}) satisfies PackageJson.Imports;
({
	'#unicorn': {
		import: {browser: 'unicorn', node: 'pony'},
		require: ['./fallback-1', './fallback-2', {default: './fallback-3', browser: null}],
		custom: null,
		default: 'horse',
	},
}) satisfies PackageJson.Imports;
({
	'./unicorn': {
		import: {browser: './unicorn.js', node: './pony.js'},
		require: ['./fallback-1', './fallback-2', {default: './fallback-3', browser: null}],
		custom: null,
		default: './horse.js',
	},
}) satisfies PackageJson.Exports;
expectTypeOf<{
	'./unicorn': undefined;
}>().not.toBeAssignableTo<PackageJson.Exports>();
// @ts-expect-error
const imports: PackageJson.Imports = {unicorn: 'unicorn'};
expectTypeOf(packageJson.preferGlobal).toBe<boolean | undefined>();
expectTypeOf(packageJson.private).toBe<boolean | undefined>();
expectTypeOf(packageJson.publishConfig).toBe<PackageJson.PublishConfig | undefined>();
expectTypeOf(packageJson.module).toBe<string | undefined>();
expectTypeOf(packageJson.esnext).toBe<
	| string
	| {
		[moduleName: string]: string | undefined;
		main?: string;
		browser?: string;
	}
	| undefined>();
expectTypeOf(packageJson.jspm).toBe<PackageJson | undefined>();

// Undefined assigns
({dep: undefined}) satisfies PackageJson.Dependency;
({engine: undefined}) satisfies typeof packageJson['engines'];
({unknownScript: undefined}) satisfies typeof packageJson['scripts'];
({bin: undefined}) satisfies typeof packageJson['bin'];
({
	'>=4': {
		'*': ['src'],
		somethingElse: undefined,
	},
	'<4': undefined,
}) satisfies typeof packageJson['typesVersions'];

// Must reject an object that contains properties with `undefined` values.
// See https://github.com/sindresorhus/type-fest/issues/272
declare function setConfig(config: JsonObject): void;

// @ts-expect-error
setConfig({bugs: undefined});
// @ts-expect-error
setConfig({bugs: {life: undefined}});

expectTypeOf<{bugs: undefined}>().not.toBeAssignableTo<JsonObject>();
expectTypeOf<{bugs: {life: undefined}}>().not.toBeAssignableTo<JsonObject>();

({}) satisfies JsonObject;
({bugs: 42}) satisfies JsonObject;
({bugs: [42]}) satisfies JsonObject;
({bugs: {life: 42}}) satisfies JsonObject;

// `PackageJson` should be a valid `JsonObject`.
// See https://github.com/sindresorhus/type-fest/issues/79
type UnknownRecord = Record<string, unknown>;

const unknownRecord: UnknownRecord = {};
const jsonObject: JsonObject = {};

expectTypeOf(packageJson).toBeAssignableTo<UnknownRecord>();
expectTypeOf(unknownRecord).not.toBeAssignableTo<PackageJson>();

expectTypeOf(jsonObject).toBeAssignableTo<PackageJson>();
expectTypeOf(packageJson).toBeAssignableTo<JsonObject>();

// Known limitation: Some nested types include `undefined` in their index signatures, so a value typed with one of them is not a `JsonObject`, and therefore not a `PackageJson`. `satisfies` keeps the literal type, which works.
// See https://github.com/sindresorhus/type-fest/issues/547
declare const scripts: PackageJson.Scripts;
expectTypeOf({scripts}).not.toBeAssignableTo<PackageJson>();
expectTypeOf({...packageJson, version: '2.0.0'}).not.toBeAssignableTo<PackageJson>();
expectTypeOf({scripts: {test: 'xo'} satisfies PackageJson.Scripts}).toBeAssignableTo<PackageJson>();

// The type describes a manifest as a reader sees it, so the loose forms npm tolerates when writing are not accepted.
// @ts-expect-error
({keywords: 'modules, stdlib, util'}) satisfies PackageJson;
// @ts-expect-error
({os: 'linux'}) satisfies PackageJson;
// @ts-expect-error
({bundleDependencies: true}) satisfies PackageJson;
// @ts-expect-error
({author: {email: 'a@example.com'}}) satisfies PackageJson;
// @ts-expect-error
({repository: {url: 'git+https://github.com/npm/cli.git'}}) satisfies PackageJson;

// `funding` accepts an array of string URLs and funding objects, alongside a single string or a single object.
['https://example.com/donate', {type: 'github', url: 'https://github.com/sponsors/x'}] satisfies PackageJson['funding'];

// A fallback `exports` array may contain `null` entries, which mean the module cannot be imported when nothing else in the array resolves.
({'./c': ['./c.js', null]}) satisfies PackageJson.Exports;
['./c.js', null] satisfies PackageJson.Exports;
// A null entry does not prevent a later valid fallback from resolving.
[null, {node: './node.js', default: './browser.js'}] satisfies PackageJson.Exports;
expectTypeOf<[{type: 'github'}]>().not.toBeAssignableTo<PackageJson['funding']>();
expectTypeOf<{gypfile: 'false'}>().not.toBeAssignableTo<PackageJson>();
expectTypeOf<{libc: true}>().not.toBeAssignableTo<PackageJson>();

// `gypfile` and `libc` are documented npm fields. Without a declaration they fell through to the index signature, so reading them back gave `JsonValue | undefined`.
declare const documentedFields: PackageJson;
expectTypeOf(documentedFields.gypfile).toBe<boolean | undefined>();
({gypfile: true}) satisfies PackageJson;
({libc: ['glibc', 'musl']}) satisfies PackageJson;
({libc: ['!musl']}) satisfies PackageJson;
({libc: ['glibc']}) satisfies PackageJson;
// The npm docs show `libc` as a single string, and npm also accepts an array.
({libc: 'glibc'}) satisfies PackageJson;
({os: ['linux'], libc: 'musl'}) satisfies PackageJson;
expectTypeOf<{libc: [true]}>().not.toBeAssignableTo<PackageJson>();
expectTypeOf(documentedFields.libc).toBe<
	| undefined
	| LiteralUnion<'glibc' | 'musl' | '!glibc' | '!musl', string>
	| Array<LiteralUnion<'glibc' | 'musl' | '!glibc' | '!musl', string>>>();
