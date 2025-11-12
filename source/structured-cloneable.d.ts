import type {TypedArray} from './typed-array.d.ts';
import type {FindGlobalInstanceType} from './find-global-type.d.ts';

type StructuredCloneablePrimitive =
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| Boolean
	| Number
	| String;

type StructuredCloneableData =
	| ArrayBuffer
	| DataView
	| Date
	| Error
	| RegExp
	| TypedArray
	| FindGlobalInstanceType<
	// DOM or Node types
		| 'Blob'
		| 'File'
	// DOM exclusive types
		| 'AudioData'
		| 'CropTarget'
		| 'CryptoKey'
		| 'DOMException'
		| 'DOMMatrix'
		| 'DOMMatrixReadOnly'
		| 'DOMPoint'
		| 'DOMPointReadOnly'
		| 'DOMQuad'
		| 'DOMRect'
		| 'DOMRectReadOnly'
		| 'FileList'
		| 'FileSystemDirectoryHandle'
		| 'FileSystemFileHandle'
		| 'FileSystemHandle'
		| 'GPUCompilationInfo'
		| 'GPUCompilationMessage'
		| 'ImageBitmap'
		| 'ImageData'
		| 'RTCCertificate'
		| 'VideoFrame'
	>;

type StructuredCloneableCollection =
	| readonly StructuredCloneable[]
	| {readonly [key: string]: StructuredCloneable; readonly [key: number]: StructuredCloneable}
	| ReadonlyMap<StructuredCloneable, StructuredCloneable>
	| ReadonlySet<StructuredCloneable>;

/**
Matches a value that can be losslessly cloned using `structuredClone`.

Note:
- Custom error types will be cloned as the base `Error` type

@see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

@example
```
import type {StructuredCloneable} from 'type-fest';

class CustomClass {}

const error = {
	custom: new CustomClass(),
	// @ts-expect-error
} satisfies StructuredCloneable;

const good = {
	number: 3,
	date: new Date(),
	map: new Map<string, number>(),
} satisfies StructuredCloneable;

const clonedGood = structuredClone(good);
//=> {number: number; date: Date; map: Map<string, number>}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZRlArgYxlyhQBMBhAGwgDsUBDAI0pQF84AzKCEOAciSoAtBxQBnGHwDcAKBn5K9MWLjlcEnlSUr0rOfloS4KKNyhwAvBhkBIfOpg8AXHDoB3VQ82LlACgCUADS2APQhcAACMGJCKAAeqISxptAy7GL0MMBiHMDicNh4hMRkVLQMzCiy8obwAOYQEKSW1jY0uCCMJi4AzME2pJkoLu5wACJDAf0g9GAjKB4AsrMAPBJQwDR1ga4dXVAAfFNpcBlZOXkqhQREJBTUdEws1QY0RgrlpADijc1W6zcSvdyr4Gk1-LIwhYDhh2p1urt4VApHBBjBhuMhiiZnM4MswGscJttoj9gdWEA)

@category Structured clone
*/
export type StructuredCloneable = StructuredCloneablePrimitive | StructuredCloneableData | StructuredCloneableCollection;

export {};
