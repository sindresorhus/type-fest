import type {Exact} from '../index';

{ // Spec - string type
	type Type = string;
	const fn = <T extends Exact<Type, T>>(args: T) => args;

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
	const fn = <T extends Exact<Type, T>>(args: T) => args;

	{ // It should accept array with required property only
		const input = [{code: ''}];
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
	const fn = <T extends Exact<Type, T>>(args: T) => args;

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
	const fn = <T extends Exact<Type, T>>(args: T) => args;

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
	const fn = <T extends Exact<Type, T>>(args: T) => args;

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
	const fn = <T extends Exact<Type, T>>(args: T) => args;

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
