import path from 'node:path';
import ts from 'typescript';
import {createFSBackedSystem, createVirtualTypeScriptEnvironment} from '@typescript/vfs';

const CODEBLOCK_REGEX = /(?<openingFence>```(?:ts|typescript)?\n)(?<code>[\s\S]*?)```/g;
const FILENAME = 'example-codeblock.ts';

const compilerOptions = {
	lib: ['lib.es2023.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.Node20,
	moduleResolution: ts.ModuleResolutionKind.Node16,
	strict: true,
	noImplicitReturns: true,
	noImplicitOverride: true,
	noUnusedLocals: false, // This is intentionally disabled
	noUnusedParameters: true,
	noFallthroughCasesInSwitch: true,
	noUncheckedIndexedAccess: true,
	noPropertyAccessFromIndexSignature: true,
	noUncheckedSideEffectImports: true,
	useDefineForClassFields: true,
	exactOptionalPropertyTypes: true,
};

const virtualFsMap = new Map();
virtualFsMap.set(FILENAME, '// Can\'t be empty');

const rootDir = path.join(import.meta.dirname, '..');
const system = createFSBackedSystem(virtualFsMap, rootDir, ts);
const env = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, compilerOptions);

export const validateJSDocCodeblocksRule = /** @type {const} */ ({
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Ensures JSDoc example codeblocks don\'t have errors',
		},
		messages: {
			error: '{{message}}',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			TSTypeAliasDeclaration(node) {
				const filename = context.filename.replaceAll('\\', '/');

				// Skip internal files
				if (filename.includes('/internal/')) {
					return {};
				}

				const {parent} = node;

				// Skip if type is not exported or starts with an underscore (private/internal)
				if (parent.type !== 'ExportNamedDeclaration' || node.id.name.startsWith('_')) {
					return;
				}

				const previousNodes = [context.sourceCode.getTokenBefore(parent, {includeComments: true})];

				// Handle JSDoc blocks for options
				if (node.id.name.endsWith('Options') && node.typeAnnotation.type === 'TSTypeLiteral') {
					for (const member of node.typeAnnotation.members) {
						previousNodes.push(context.sourceCode.getTokenBefore(member, {includeComments: true}));
					}
				}

				for (const previousNode of previousNodes) {
					// Skip if previous node is not a JSDoc comment
					if (!previousNode || previousNode.type !== 'Block' || !previousNode.value.startsWith('*')) {
						continue;
					}

					const comment = previousNode.value;

					for (const match of comment.matchAll(CODEBLOCK_REGEX)) {
						const {code, openingFence} = match.groups ?? {};

						// Skip empty code blocks
						if (!code || !openingFence) {
							continue;
						}

						const matchOffset = match.index + openingFence.length + 2; // Add `2` because `comment` doesn't include the starting `/*`
						const codeStartIndex = previousNode.range[0] + matchOffset;

						env.updateFile(FILENAME, code);
						const syntacticDiagnostics = env.languageService.getSyntacticDiagnostics(FILENAME);
						const semanticDiagnostics = env.languageService.getSemanticDiagnostics(FILENAME);
						const diagnostics = syntacticDiagnostics.length > 0 ? syntacticDiagnostics : semanticDiagnostics; // Show semantic errors only if there are no syntactic errors

						for (const diagnostic of diagnostics) {
							// If diagnostic location is not available, report on the entire code block
							const diagnosticStart = codeStartIndex + (diagnostic.start ?? 0);
							const diagnosticEnd = diagnosticStart + (diagnostic.length ?? code.length);

							context.report({
								loc: {
									start: context.sourceCode.getLocFromIndex(diagnosticStart),
									end: context.sourceCode.getLocFromIndex(diagnosticEnd),
								},
								messageId: 'error',
								data: {
									message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
								},
							});
						}
					}
				}
			},
		};
	},
});
