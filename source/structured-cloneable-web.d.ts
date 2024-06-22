import type {TypedArray} from './typed-array';

type StructuredCloneableWebValue =
	| Blob
	| CryptoKey
	| DOMException
	| DOMMatrix
	| DOMMatrixReadOnly
	| DOMPoint
	| DOMPointReadOnly
	| DOMQuad
	| DOMRect
	| DOMRectReadOnly
	| File
	| FileList
	| FileSystemDirectoryHandle
	| FileSystemFileHandle
	| FileSystemHandle
	| ImageBitmap
	| ImageData
	| RTCCertificate
	| VideoFrame;
// Missing types:
//	| AudioData
//	| CropTarget
//	| GPUCompilationInfo
//	| GPUCompilationMessage

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
	| TypedArray;

type StructuredCloneableCollection =
	| readonly StructuredCloneableWeb[]
	| {readonly [k: string]: StructuredCloneableWeb; readonly [k: number]: StructuredCloneableWeb}
	| ReadonlyMap<StructuredCloneableWeb, StructuredCloneableWeb>
	| ReadonlySet<StructuredCloneableWeb>;

/**
Matches a value that can be losslessly cloned using `structuredClone` (includes web types like `Blob` and `DOMRect`).

Can be used to type values that you expect to pass to `structuredClone`.

Note:
- Custom error types will be cloned as the base `Error` type
- This variant includes web-specific cloneable types (e.g. `Blob` and `DOMRect`)

@see `StructuredCloneable` for a version that doesn't include web types

@example
```
import type {StructuredCloneableWeb} from 'type-fest';

class CustomClass {}

// @ts-expect-error
const error: StructuredCloneableWeb = {
    custom: new CustomClass(),
};

structuredClone(error);
//=> {custom: {}}

const good: StructuredCloneableWeb = {
    blob: new Blob(["<div></div>"], { type: "text/html" }),
    date: new Date(),
    map: new Map<string, number>(),
}
good.map.set("key", 1)

structuredClone(good);
//=> {blob: Blob {size: 11, type: "text/html"}, date: Date(2022-10-17 22:22:35.920), map: Map {"key" -> 1}}
```

@category Structured clone
 */
export type StructuredCloneableWeb = StructuredCloneableWebValue | StructuredCloneablePrimitive | StructuredCloneableData | StructuredCloneableCollection;
