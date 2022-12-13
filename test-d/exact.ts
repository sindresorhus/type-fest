import type {Exact, Opaque} from '../index';

{ // Spec - string type
	type Type = string;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept string
		const input = '';
		fn(input);
	}

	{ // It should reject number
		const input = 1;
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject object
		const input = {};
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - array
	type Type = Array<{code: string; name?: string}>;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept array with required property only
		const input = [{code: ''}];
		fn(input);
	}

	{ // It should reject readonly array
		const input = [{code: ''}] as ReadonlyArray<{code: string}>;
		// @ts-expect-error
		fn(input);
	}

	{ // It should accept array with optional property
		const input = [{code: '', name: ''}];
		fn(input);
	}

	{ // It should reject array with excess property
		const input = [{code: '', name: '', excessProperty: ''}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - readonly array
	type Type = ReadonlyArray<{code: string; name?: string}>;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept array with required property only
		const input = [{code: ''}];
		fn(input);
	}

	{ // It should accept readonly array
		const input = [{code: ''}] as ReadonlyArray<{code: string}>;
		fn(input);
	}

	{ // It should accept array with optional property
		const input = [{code: '', name: ''}];
		fn(input);
	}

	{ // It should reject array with excess property
		const input = [{code: '', name: '', excessProperty: ''}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - object
	type Type = {code: string; name?: string};
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept object with required property only
		const input = {code: ''};
		fn(input);
	}

	{ // It should accept object with optional property
		const input = {code: '', name: ''};
		fn(input);
	}

	{ // It should reject object with excess property
		const input = {code: '', name: '', excessProperty: ''};
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject invalid type
		const input = '';
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - union - only object
	type Type = {code: string} | {name: string};
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept type a
		const input = {code: ''};
		fn(input);
	}

	{ // It should accept type b
		const input = {name: ''};
		fn(input);
	}

	{ // It should reject intersection
		const input = {name: '', code: ''};
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - union - mixture object/primitive
	type Type = {code: string} | string;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept type a
		const input = {code: ''};
		fn(input);
	}

	{ // It should accept type b
		const input = '';
		fn(input);
	}

	{ // It should reject intersection
		const input = {name: '', code: ''};
		// @ts-expect-error
		fn(input);
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
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept input with required property only
		const input = {body: {code: ''}};
		fn(input);
	}

	{ // It should accept input with optional property
		const input = {body: {code: '', name: ''}};
		fn(input);
	}

	{ // It should allow input with excess property
		const input = {body: {code: '', name: '', excessProperty: ''}};
		fn(input);
	}
}

{ // Spec - union of array
	type Type = Array<{x: string}> & Array<{z: number}>;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
		}];
		fn(input);
	}

	{ // It should reject missing field
		const input = [{
			z: 1,
		}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
		}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject incorrect type
		const input = [{
			x: 1,
			z: 1,
		}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			y: '',
			z: 1,
		}];
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - union of readonly array + non readonly array
	type Type = ReadonlyArray<{x: string}> & Array<{z: number}>;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
		}];
		fn(input);
	}

	{ // It should reject missing field
		const input = [{
			z: 1,
		}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject missing field
		const input = [{
			x: '',
		}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject incorrect type
		const input = [{
			x: 1,
			z: 1,
		}];
		// @ts-expect-error
		fn(input);
	}

	{ // It should reject excess field
		const input = [{
			x: '',
			y: '',
			z: 1,
		}];
		// @ts-expect-error
		fn(input);
	}
}

{ // Spec - union of array with nested fields
	type Type = Array<{x: string}> & Array<{z: number; d: {e: string; f: boolean}}>;
	const fn = <T extends Exact<Type, T>>(arguments_: T) => arguments_;

	{ // It should accept valid input
		const input = [{
			x: '',
			z: 1,
			d: {
				e: 'test',
				f: true,
			},
		}];
		fn(input);
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
		fn(input);
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
		fn(input);
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
		fn(input);
	}
}

// Spec - special test case for Opaque type
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

	const fn = <T extends Exact<OnlyAcceptName, T>>(arguments_: T) => arguments_;

	fn({
		// The error before the workaround:
		// Error: Type 'SpecialName' is not assignable to type 'never'
		name: 1 as SpecialName,
	});
}
