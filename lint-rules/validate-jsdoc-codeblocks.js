import ts from 'typescript';
import {createFSBackedSystem, createVirtualTypeScriptEnvironment} from '@typescript/vfs';

const CODEBLOCK_REGEX = /(?<openingFence>```(?:ts|typescript)?\n)(?<code>[\s\S]*?)```/g;
const FILENAME = 'example-codeblock.ts';

const compilerOptions = {
	lib: ['lib.es2023.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
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
		const allComments = context.sourceCode.getAllComments();

		const virtualFsMap = new Map();
		const system = createFSBackedSystem(virtualFsMap, context.cwd, ts);

		return {
			Program() {
				for (const comment of allComments) {
					// Skip non-block comments
					if (comment.type !== 'Block') {
						continue;
					}

					// Skip non-JSDoc comments
					if (!comment.value.startsWith('*')) {
						continue;
					}

					for (const match of comment.value.matchAll(CODEBLOCK_REGEX)) {
						const {code, openingFence} = match.groups ?? {};

						// Skip empty code blocks
						if (!code || !openingFence) {
							continue;
						}

						const matchOffset = match.index + openingFence.length + 2; // Add `2` because `comment.value` doesn't include the starting `/*`
						const codeStartIndex = comment.range[0] + matchOffset;

						virtualFsMap.set(FILENAME, code);
						const env = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, compilerOptions);
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
