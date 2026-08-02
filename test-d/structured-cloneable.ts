import {expectAssignable, expectNotAssignable} from 'tsd';
import type {StructuredCloneable} from '../index.d.ts';

/*
Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

# Supported types
## JavaScript types
- Array
- ArrayBuffer
- Boolean
- DataView
- Date
- Error types (but see Error types below).
- Map
- Number
- Object: but only plain objects (e.g. from object literals).
- Primitive types, except symbol.
- RegExp: but note that lastIndex is not preserved.
- Set
- String
- TypedArray

## Error types
For Error types, the error name must be one of: Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError (or will be set to "Error").

## Web/API types
 - Blob
 - File

## DOM exclusive types (not included)
 - AudioData
 - CropTarget
 - CryptoKey
 - DOMException: browsers must serialize the properties name and message. Other attributes may also be serialized/cloned.
 - DOMMatrix
 - DOMMatrixReadOnly
 - DOMPoint
 - DOMPointReadOnly
 - DOMQuad
 - DOMRect
 - DOMRectReadOnly
 - FileList
 - FileSystemDirectoryHandle
 - FileSystemFileHandle
 - FileSystemHandle
 - GPUCompilationInfo
 - GPUCompilationMessage
 - ImageBitmap
 - ImageData
 - RTCCertificate
 - VideoFrame
*/

// Date, Boolean, Number, String
expectAssignable<StructuredCloneable>(new Date());
declare const booleanWrapperObject: Boolean;
expectAssignable<StructuredCloneable>(booleanWrapperObject);
declare const numberWrapperObject: Number;
expectAssignable<StructuredCloneable>(numberWrapperObject);
declare const stringWrapperObject: String;
expectAssignable<StructuredCloneable>(stringWrapperObject);

// Primitive types, except symbol.
expectAssignable<StructuredCloneable>(undefined);
expectAssignable<StructuredCloneable>(null);
expectAssignable<StructuredCloneable>(true);
expectAssignable<StructuredCloneable>(1);
expectAssignable<StructuredCloneable>(1n);
expectAssignable<StructuredCloneable>('');
declare const symbolValue: symbol;
expectNotAssignable<StructuredCloneable>(symbolValue);

// RegExp: but note that lastIndex is not preserved.
expectAssignable<StructuredCloneable>(/foo/);

// ArrayBuffer, DataView
expectAssignable<StructuredCloneable>(new ArrayBuffer(10));
expectAssignable<StructuredCloneable>(new DataView(new ArrayBuffer(10)));

// TypedArray
expectAssignable<StructuredCloneable>(new Int8Array(10));
expectAssignable<StructuredCloneable>(new Uint8Array(10));
expectAssignable<StructuredCloneable>(new Uint8ClampedArray(10));
expectAssignable<StructuredCloneable>(new Int16Array(10));
expectAssignable<StructuredCloneable>(new Uint16Array(10));
expectAssignable<StructuredCloneable>(new Int32Array(10));
expectAssignable<StructuredCloneable>(new Uint32Array(10));
expectAssignable<StructuredCloneable>(new Float32Array(10));
expectAssignable<StructuredCloneable>(new Float64Array(10));
expectAssignable<StructuredCloneable>(new BigInt64Array(10));
expectAssignable<StructuredCloneable>(new BigUint64Array(10));

// Error types
declare const error: Error;
expectAssignable<StructuredCloneable>(error);
declare const evalError: EvalError;
expectAssignable<StructuredCloneable>(evalError);
declare const rangeError: RangeError;
expectAssignable<StructuredCloneable>(rangeError);
declare const referenceError: ReferenceError;
expectAssignable<StructuredCloneable>(referenceError);
declare const syntaxError: SyntaxError;
expectAssignable<StructuredCloneable>(syntaxError);
declare const typeError: TypeError;
expectAssignable<StructuredCloneable>(typeError);
declare const uriError: URIError;
expectAssignable<StructuredCloneable>(uriError);

// Object: but only plain objects (e.g. from object literals).
expectAssignable<StructuredCloneable>({});
expectAssignable<StructuredCloneable>({x: 10});
expectAssignable<StructuredCloneable>({x: {y: 10}});
expectAssignable<StructuredCloneable>({x: 10} as const);
class CustomType {}
expectNotAssignable<StructuredCloneable>(new CustomType());
class CustomTypeWithProperties {
	foo = 'wow';
	bar = 1;
}
expectNotAssignable<StructuredCloneable>(new CustomTypeWithProperties());

// Array
expectAssignable<StructuredCloneable>([]);
expectAssignable<StructuredCloneable>([1, 2, 3]);
expectAssignable<StructuredCloneable>([1, 2, 3] as const);
expectAssignable<StructuredCloneable>([[1, 2], [3, 4]]);
expectAssignable<StructuredCloneable>([{x: 1}, {x: 2}]);

// Map
expectAssignable<StructuredCloneable>(new Map<string, Date>());
expectAssignable<StructuredCloneable>(new Map<Date, string[]>());
expectAssignable<StructuredCloneable>(new Map<Date, Map<string, number>>());

// Set
expectAssignable<StructuredCloneable>(new Set<number>());
expectAssignable<StructuredCloneable>(new Set<string[]>());
expectAssignable<StructuredCloneable>(new Set<Set<string>>());

// Web/API types

// @ts-ignore Requires dom or @types/node@>=20
declare const blob: Blob;
expectAssignable<StructuredCloneable>(blob);

// @ts-ignore Requires dom or @types/node@>=20
declare const file: File;
expectAssignable<StructuredCloneable>(file);
