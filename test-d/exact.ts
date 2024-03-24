import type {Exact, Opaque} from '../index';

{ // Spec - string type
	type Type = string;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept string
		const input = '';
		function_(input);
	}

	{ // It should reject number
		const input = 1;
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject object
		const input = {};
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - array
	type Type = Array<{code: string; name?: string}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept array with required property only
		const input = [{code: ''}];
		function_(input);
	}

	{ // It should reject readonly array
		const input = [{code: ''}] as ReadonlyArray<{code: string}>;
		// @ts-expect-error
		function_(input);
	}

	{ // It should accept array with optional property
		const input = [{code: '', name: ''}];
		function_(input);
	}

	{ // It should reject array with excess property
		const input = [{code: '', name: '', excessProperty: ''}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - readonly array
	type Type = ReadonlyArray<{code: string; name?: string}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept array with required property only
		const input = [{code: ''}];
		function_(input);
	}

	{ // It should accept readonly array
		const input = [{code: ''}] as ReadonlyArray<{code: string}>;
		function_(input);
	}

	{ // It should accept array with optional property
		const input = [{code: '', name: ''}];
		function_(input);
	}

	{ // It should reject array with excess property
		const input = [{code: '', name: '', excessProperty: ''}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - object
	type Type = {code: string; name?: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept object with required property only
		const input = {code: ''};
		function_(input);
	}

	{ // It should accept object with optional property
		const input = {code: '', name: ''};
		function_(input);
	}

	{ // It should reject object with excess property
		const input = {code: '', name: '', excessProperty: ''};
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - object with optional outer object @see https://github.com/sindresorhus/type-fest/pull/546#issuecomment-1385620838
	type Type = {
		outer?: {
			inner: {
				field: string;
			};
		};
	};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;
	function_({
		outer: {
			inner: {
				field: 'foo',
			},
		},
	});
}

{ // Spec - union - only object
	type Type = {code: string} | {name: string};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept type a
		const input = {code: ''};
		function_(input);
	}

	{ // It should accept type b
		const input = {name: ''};
		function_(input);
	}

	{ // It should reject intersection
		const input = {name: '', code: ''};
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - union - mixture object/primitive
	type Type = {code: string} | string;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept type a
		const input = {code: ''};
		function_(input);
	}

	{ // It should accept type b
		const input = '';
		function_(input);
	}

	{ // It should reject intersection
		const input = {name: '', code: ''};
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - jsonschema2ts generated request type with additionalProperties: true
	type Type = {
		body: {
			[k: string]: unknown;
			code: string;
			name?: string;
		};
	};
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept input with required property only
		const input = {body: {code: ''}};
		function_(input);
	}

	{ // It should accept input with optional property
		const input = {body: {code: '', name: ''}};
		function_(input);
	}

	{ // It should allow input with excess property
		const input = {body: {code: '', name: '', excessProperty: ''}};
		function_(input);
	}
}

{ // Spec - union of array
	type Type = Array<{x: string}> & Array<{z: number}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
		}];
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject incorrect type
		const input = [{
			x: 1,
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			y: '',
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - union of readonly array + non readonly array
	type Type = ReadonlyArray<{x: string}> & Array<{z: number}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
		}];
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject incorrect type
		const input = [{
			x: 1,
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			y: '',
			z: 1,
		}];
		// @ts-expect-error
		function_(input);
	}
}

{ // Spec - union of array with nested fields
	type Type = Array<{x: string}> & Array<{z: number; d: {e: string; f: boolean}}>;
	const function_ = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: true,
			},
		}];
		function_(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: true,
				g: '', // Excess field
			},
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				// Missing f: boolean
			},
		}];
		// @ts-expect-error
		function_(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: '', // Type mismatch
			},
		}];
		// @ts-expect-error
		function_(input);
	}
}

// Spec - special test case for Opaque types
// @see https://github.com/sindresorhus/type-fest/issues/508
{
	type SpecialName = Opaque<string, 'special name'>;

	type OnlyAcceptName = {
		name: SpecialName;
	};

	const onlyAcceptNameImproved = <T extends Exact<OnlyAcceptName, T>>(arguments_: T) => arguments_;

	onlyAcceptNameImproved({
		// The error before the workaround:
		// Error: Type 'SpecialName' is not assignable to type 'never'
		name: 'name' as SpecialName,
	});
}

// Spec - special test case for Opaque type
// @see https://github.com/sindresorhus/type-fest/issues/508
{
	// Test for number Opaque type
	type SpecialName = Opaque<number, 'special name'>;

	type OnlyAcceptName = {
		name: SpecialName;
	};

	const function_ = <T extends Exact<OnlyAcceptName, T>>(arguments_: T) => arguments_;

	function_({
		// The error before the workaround:
		// Error: Type 'SpecialName' is not assignable to type 'never'
		name: 1 as SpecialName,
	});
}

// Spec - test the above for tagged types too.
{
	type TaggedNumber = Opaque<number, 'tag'>;

	const function_ = <T extends Exact<{a: TaggedNumber}, T>>(arguments_: T) => arguments_;

	function_({a: 1 as TaggedNumber});
	// @ts-expect-error
	function_({a: 1 as TaggedNumber, b: true});
}

// Spec - special test case for deep optional union
// https://github.com/sindresorhus/type-fest/issues/545
{
	type ParameterType = {
		outer?: {
			inner?: {
				union: 'foo' | 'bar';
			};
		};
	};

	const function_ = <InputT extends Exact<ParameterType, InputT>>(arguments_: InputT) => arguments_;

	// Test input with declared type
	type Input = {
		outer?: {
			inner?: {
				union: 'foo' | 'bar';
			};
		};
	};
	const variableWithDeclaredType: Input = {
		outer: {
			inner: {
				union: 'foo',
			},
		},
	};
	function_(variableWithDeclaredType);

	// Test input without declared type
	const variableWithoutDeclaredType = {
		outer: {
			inner: {
				union: 'foo' as const,
			},
		},
	};
	function_(variableWithoutDeclaredType);

	// Test input with plain object
	function_({
		outer: {
			inner: {
				union: 'foo',
			},
		},
	});
}
