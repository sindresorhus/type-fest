import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {RuleTester} from 'eslint';
import tsParser from '@typescript-eslint/parser';

export const createRuleTester = (overrides = {}) => {
	const {
		languageOptions: overrideLanguageOptions = {},
		...restOverrides
	} = overrides;

	const {
		parserOptions: overrideParserOptions = {},
		...otherLanguageOptions
	} = overrideLanguageOptions;

	return new RuleTester({
		...restOverrides,
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tsParser,
			...otherLanguageOptions,
			parserOptions: {
				...overrideParserOptions,
			},
		},
	});
};

const defaultTypeAwareTsconfig = {
	compilerOptions: {
		declaration: true,
		emitDeclarationOnly: true,
		module: 'ESNext',
		moduleResolution: 'Bundler',
		skipLibCheck: true,
		strict: true,
		target: 'ES2022',
	},
	include: [
		'*.d.ts',
		'source/**/*.*',
		'lib/**/*.d.ts',
		'test/**/*.d.ts',
	],
};

export const createTypeAwareRuleTester = (fixtureFiles, options = {}) => {
	const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'type-fest-type-aware-'));

	const writeFixture = (relativePath, content) => {
		const absolutePath = path.join(fixtureRoot, relativePath);
		fs.mkdirSync(path.dirname(absolutePath), {recursive: true});
		fs.writeFileSync(absolutePath, content ?? '');
	};

	for (const [relativePath, content] of Object.entries(fixtureFiles)) {
		writeFixture(relativePath, content);
	}

	const hasRuleTesterOption = Object.hasOwn(options, 'ruleTester');
	const hasTsconfigOption = Object.hasOwn(options, 'tsconfig');
	const ruleTesterOverrides = hasRuleTesterOption || hasTsconfigOption ? options.ruleTester ?? {} : options;
	const tsconfig = hasRuleTesterOption || hasTsconfigOption
		? options.tsconfig ?? defaultTypeAwareTsconfig
		: defaultTypeAwareTsconfig;

	if (!('tsconfig.json' in fixtureFiles)) {
		writeFixture('tsconfig.json', `${JSON.stringify(tsconfig, null, '\t')}\n`);
	}

	const overrideLanguageOptions = ruleTesterOverrides.languageOptions ?? {};
	const overrideParserOptions = overrideLanguageOptions.parserOptions ?? {};
	const overrideProjectService = overrideParserOptions.projectService ?? {};
	const ruleTester = createRuleTester({
		...ruleTesterOverrides,
		languageOptions: {
			...overrideLanguageOptions,
			parserOptions: {
				...overrideParserOptions,
				projectService: {
					allowDefaultProject: ['*.ts*'],
					...overrideProjectService,
				},
				tsconfigRootDir: fixtureRoot,
			},
		},
	});

	const fixturePath = relativePath => path.join(fixtureRoot, relativePath);

	return {
		ruleTester,
		fixtureRoot,
		fixturePath,
		writeFixture,
	};
};
