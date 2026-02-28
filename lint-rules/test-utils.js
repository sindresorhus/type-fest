import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {RuleTester} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import dedent from 'dedent';

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

export const dedenter = dedent.withOptions({alignValues: true});

/**
Returns the specified code in a fenced code block, with an optional language tag.

@example
```
fence('type A = string;');
// Returns:
// ```
// type A = string;
// ```

fence(`import {RemovePrefix} from 'type-fest';

type A = RemovePrefix<'onChange', 'on'>;
//=> 'Change'`, 'ts');
// Returns:
// ```ts
// import {RemovePrefix} from 'type-fest';

// type A = RemovePrefix<'onChange', 'on'>;
// //=> 'Change'
// ```
```
*/
export const fence = (code, lang = '') =>
	dedenter`
		\`\`\`${lang}
		${code}
		\`\`\`
	`;

/**
Returns the specified lines as a JSDoc comment, placing each specified line on a new line.

@example
```
jsdoc('Some description.', 'Note: Some note.');
// Returns:
// /**
// Some description.
// Note: Some note.
// *​/

jsdoc('@example', '```\ntype A = string;\n```', '@category Test');
// Returns;
// /**
// @example
// ```
// type A = string;
// ```
// @category Test
// *​/
```
*/
export const jsdoc = (...lines) =>
	dedenter`
		/**
		${lines.join('\n')}
		*/
	`;

/**
Returns an exported type for each provided prefix, with each prefix placed directly above its corresponding type declaration.

@example
```
exportType(
	'// Some comment',
	'type Test = string;',
	'/**\nSome description.\nNote: Some note.\n*​/'
);
// Returns:
// // Some comment
// export type T0 = string;
//
// type Test = string;
// export type T1 = string;
//
// /**
// Some description.
// Note: Some note.
// *​/
// export type T2 = string;
*/
export const exportType = (...prefixes) =>
	prefixes
		.map((doc, i) => dedenter`
			${doc}
			export type T${i} = string;
		`)
		.join('\n\n');

/**
Returns an exported "Options" object type containing a property for each specified prefix, with each prefix placed directly above its corresponding property declaration.

@example
```
exportOption(
	'// Some comment',
	'type Test = string;',
	'/**\nSome description.\nNote: Some note.\n*​/'
);
// Returns:
// export type TOptions = {
// 	// Some comment
// 	p0: string;

// 	test: string;
// 	p1: string;

// 	/**
// 	Some description.
// 	Note: Some note.
// 	*​/
// 	p2: string;
// };
```
*/
export const exportOption = (...prefixes) =>
	dedenter`
		export type TOptions = {
			${prefixes
				.map((doc, i) => dedenter`
					${doc}
					p${i}: string;
				`)
				.join('\n\n')}
		};
	`;

/**
Returns an exported type for each provided prefix, and an exported "Options" object type containing a property for each specified prefix, with each prefix placed directly above its corresponding declaration.

@example
```
exportTypeAndOption('// Some comment', '/**\nSome JSDoc\n*​/');
// Returns:
// // Some comment
// type T0 = string;

// /**
// Some JSDoc
// *​/
// type T1 = string;

// type TOptions = {
// 	// Some comment
// 	p0: string;

// 	/**
// 	Some JSDoc
// 	*​/
// 	p1: string;
// };
```
*/
export const exportTypeAndOption = (...prefixes) =>
	dedenter`
		${exportType(...prefixes)}

		${exportOption(...prefixes)}
	`;

/**
@typedef {{
	line: number;
	textBeforeStart: string;
	ruleId?: string;
	messageId?: string;
} & ({ target: string } | { endLine: number; textBeforeEnd: string })} ErrorAtProps

@param {ErrorAtProps} props
@returns {{line: number, column: number, endLine: number, endColumn: number, ruleId?: string, messageId?: string}}
*/
export const errorAt = props => {
	const {line, textBeforeStart, ruleId, messageId} = props;

	const column = textBeforeStart.length + 1;
	const endColumn = 'textBeforeEnd' in props ? props.textBeforeEnd.length + 1 : column + props.target.length;

	const endLine = 'endLine' in props ? props.endLine : line;

	return {
		...(ruleId && {ruleId}),
		...(messageId && {messageId}),
		line, // 1-based, inclusive
		column, // 1-based, inclusive
		endLine, // 1-based, inclusive
		endColumn, // 1-based, exclusive
	};
};

/// Code samples
export const code1 = dedenter`
import type {Sum} from 'type-fest';

type A = Sum<1, 2>;
//=> 3
`;

export const code2 = dedenter`
import type {LiteralToPrimitiveDeep} from 'type-fest';

const config = {appName: 'MyApp', version: '1.0.0'} as const;

declare function updateConfig(newConfig: LiteralToPrimitiveDeep<typeof config>): void;

updateConfig({appName: 'MyUpdatedApp', version: '2.0.0'});
`;
