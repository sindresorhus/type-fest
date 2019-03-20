import {expectType} from 'tsd';
import {PackageJson, LiteralUnion} from '..';

const packageJson: PackageJson = {};

expectType<string | undefined>(packageJson.name);
expectType<string | undefined>(packageJson.version);
expectType<string | undefined>(packageJson.description);
expectType<string[] | undefined>(packageJson.keywords);
expectType<LiteralUnion<'.', string> | undefined>(packageJson.homepage);
expectType<PackageJson.BugsLocation | undefined>(packageJson.bugs);
expectType<string | undefined>(packageJson.license);
expectType<{type?: string; url?: string}[] | undefined>(packageJson.licenses);
expectType<PackageJson.Person | undefined>(packageJson.author);
expectType<PackageJson.Person[] | undefined>(packageJson.contributors);
expectType<PackageJson.Person[] | undefined>(packageJson.maintainers);
expectType<string[] | undefined>(packageJson.files);
expectType<string | undefined>(packageJson.main);
expectType<string | {[binary: string]: string} | undefined>(packageJson.bin);
expectType<string | undefined>(packageJson.types);
expectType<string | undefined>(packageJson.typings);
expectType<string | string[] | undefined>(packageJson.man);
expectType<PackageJson.DirectoryLocations | undefined>(packageJson.directories);
expectType<{type: string; url: string} | string | undefined>(
	packageJson.repository
);
expectType<PackageJson.Scripts | undefined>(packageJson.scripts);
expectType<{[configKey: string]: unknown} | undefined>(packageJson.config);
expectType<PackageJson.Dependency | undefined>(packageJson.dependencies);
expectType<PackageJson.Dependency | undefined>(packageJson.devDependencies);
expectType<PackageJson.Dependency | undefined>(
	packageJson.optionalDependencies
);
expectType<PackageJson.Dependency | undefined>(packageJson.peerDependencies);
expectType<string[] | undefined>(packageJson.bundleDependencies);
expectType<string[] | undefined>(packageJson.bundledDependencies);
expectType<PackageJson.Dependency | undefined>(packageJson.resolutions);
expectType<{[engineName: string]: string} | undefined>(packageJson.engines);
expectType<boolean | undefined>(packageJson.engineStrict);
expectType<
	| undefined
	| LiteralUnion<
			'darwin' | 'linux' | 'win32' | '!darwin' | '!linux' | '!win32',
			string
	>[]
>(packageJson.os);
expectType<
	| undefined
	| LiteralUnion<
			'x64' | 'ia32' | 'arm' | 'mips' | '!x64' | '!ia32' | '!arm' | '!mips',
			string
	>[]
>(packageJson.cpu);
expectType<boolean | undefined>(packageJson.preferGlobal);
expectType<boolean | undefined>(packageJson.private);
expectType<{[config: string]: unknown} | undefined>(packageJson.publishConfig);
expectType<string | undefined>(packageJson.module);
expectType<
	| string
	| {
		main?: string;
		browser?: string;
		[moduleName: string]: string | undefined;
	}
	| undefined
>(packageJson.esnext);
expectType<PackageJson | undefined>(packageJson.jspm);
expectType<unknown>(packageJson.foo);
