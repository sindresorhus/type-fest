import {expectAssignable, expectNotAssignable} from 'tsd';
import type {StructuredCloneableWeb} from '..';

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
- Object objects: but only plain objects (e.g. from object literals).
- Primitive types, except symbol.
- RegExp: but note that lastIndex is not preserved.
- Set
- String
- TypedArray

## Error types
For Error types, the error name must be one of: Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError (or will be set to "Error").

## Web/API types
 - AudioData
 - Blob
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
 - File
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
expectAssignable<StructuredCloneableWeb>(new Date());
declare const booleanWrapperObject: Boolean;
expectAssignable<StructuredCloneableWeb>(booleanWrapperObject);
declare const numberWrapperObject: Number;
expectAssignable<StructuredCloneableWeb>(numberWrapperObject);
declare const stringWrapperObject: String;
expectAssignable<StructuredCloneableWeb>(stringWrapperObject);

// Primitive types, except symbol.
expectAssignable<StructuredCloneableWeb>(undefined);
expectAssignable<StructuredCloneableWeb>(null);
expectAssignable<StructuredCloneableWeb>(true);
expectAssignable<StructuredCloneableWeb>(1);
expectAssignable<StructuredCloneableWeb>(1n);
expectAssignable<StructuredCloneableWeb>('');
declare const symbolValue: symbol;
expectNotAssignable<StructuredCloneableWeb>(symbolValue);

// RegExp: but note that lastIndex is not preserved.
expectAssignable<StructuredCloneableWeb>(/foo/);

// ArrayBuffer, DataView
expectAssignable<StructuredCloneableWeb>(new ArrayBuffer(10));
expectAssignable<StructuredCloneableWeb>(new DataView(new ArrayBuffer(10)));

// TypedArray
expectAssignable<StructuredCloneableWeb>(new Int8Array(10));
expectAssignable<StructuredCloneableWeb>(new Uint8Array(10));
expectAssignable<StructuredCloneableWeb>(new Uint8ClampedArray(10));
expectAssignable<StructuredCloneableWeb>(new Int16Array(10));
expectAssignable<StructuredCloneableWeb>(new Uint16Array(10));
expectAssignable<StructuredCloneableWeb>(new Int32Array(10));
expectAssignable<StructuredCloneableWeb>(new Uint32Array(10));
expectAssignable<StructuredCloneableWeb>(new Float32Array(10));
expectAssignable<StructuredCloneableWeb>(new Float64Array(10));
expectAssignable<StructuredCloneableWeb>(new BigInt64Array(10));
expectAssignable<StructuredCloneableWeb>(new BigUint64Array(10));

// Error types
declare const error: Error;
expectAssignable<StructuredCloneableWeb>(error);
declare const evalError: EvalError;
expectAssignable<StructuredCloneableWeb>(evalError);
declare const rangeError: RangeError;
expectAssignable<StructuredCloneableWeb>(rangeError);
declare const referenceError: ReferenceError;
expectAssignable<StructuredCloneableWeb>(referenceError);
declare const syntaxError: SyntaxError;
expectAssignable<StructuredCloneableWeb>(syntaxError);
declare const typeError: TypeError;
expectAssignable<StructuredCloneableWeb>(typeError);
declare const uriError: URIError;
expectAssignable<StructuredCloneableWeb>(uriError);

// Object objects: but only plain objects (e.g. from object literals).
expectAssignable<StructuredCloneableWeb>({});
expectAssignable<StructuredCloneableWeb>({x: 10});
expectAssignable<StructuredCloneableWeb>({x: {y: 10}});
expectAssignable<StructuredCloneableWeb>({x: 10} as const);
class CustomType {}
expectNotAssignable<StructuredCloneableWeb>(new CustomType());

// Array
expectAssignable<StructuredCloneableWeb>([]);
expectAssignable<StructuredCloneableWeb>([1, 2, 3]);
expectAssignable<StructuredCloneableWeb>([1, 2, 3] as const);
expectAssignable<StructuredCloneableWeb>([[1, 2], [3, 4]]);
expectAssignable<StructuredCloneableWeb>([{x: 1}, {x: 2}]);

// Map
expectAssignable<StructuredCloneableWeb>(new Map<string, Date>());
expectAssignable<StructuredCloneableWeb>(new Map<Date, string[]>());
expectAssignable<StructuredCloneableWeb>(new Map<Date, Map<string, number>>());

// Set
expectAssignable<StructuredCloneableWeb>(new Set<number>());
expectAssignable<StructuredCloneableWeb>(new Set<string[]>());
expectAssignable<StructuredCloneableWeb>(new Set<Set<string>>());

// Web/API types
declare const blob: Blob;
expectAssignable<StructuredCloneableWeb>(blob);
declare const cryptoKey: CryptoKey;
expectAssignable<StructuredCloneableWeb>(cryptoKey);
declare const domException: DOMException;
expectAssignable<StructuredCloneableWeb>(domException);
declare const domMatrix: DOMMatrix;
expectAssignable<StructuredCloneableWeb>(domMatrix);
declare const domMatrixReadOnly: DOMMatrixReadOnly;
expectAssignable<StructuredCloneableWeb>(domMatrixReadOnly);
declare const domPoint: DOMPoint;
expectAssignable<StructuredCloneableWeb>(domPoint);
declare const domPointReadOnly: DOMPointReadOnly;
expectAssignable<StructuredCloneableWeb>(domPointReadOnly);
declare const domQuad: DOMQuad;
expectAssignable<StructuredCloneableWeb>(domQuad);
declare const domRect: DOMRect;
expectAssignable<StructuredCloneableWeb>(domRect);
declare const domRectReadOnly: DOMRectReadOnly;
expectAssignable<StructuredCloneableWeb>(domRectReadOnly);
declare const file: File;
expectAssignable<StructuredCloneableWeb>(file);
declare const fileList: FileList;
expectAssignable<StructuredCloneableWeb>(fileList);
declare const fileSystemDirectoryHandle: FileSystemDirectoryHandle;
expectAssignable<StructuredCloneableWeb>(fileSystemDirectoryHandle);
declare const fileSystemFileHandle: FileSystemFileHandle;
expectAssignable<StructuredCloneableWeb>(fileSystemFileHandle);
declare const fileSystemHandle: FileSystemHandle;
expectAssignable<StructuredCloneableWeb>(fileSystemHandle);
declare const imageBitmap: ImageBitmap;
expectAssignable<StructuredCloneableWeb>(imageBitmap);
declare const imageData: ImageData;
expectAssignable<StructuredCloneableWeb>(imageData);
declare const rtcCertificate: RTCCertificate;
expectAssignable<StructuredCloneableWeb>(rtcCertificate);
declare const videoFrame: VideoFrame;
expectAssignable<StructuredCloneableWeb>(videoFrame);

// Missing types:

/*
declare const audioData: AudioData;
expectAssignable<StructuredCloneableWeb>(audioData);
declare const cropTarget: CropTarget;
expectAssignable<StructuredCloneableWeb>(cropTarget);
declare const gpuCompilationInfo: GPUCompilationInfo;
expectAssignable<StructuredCloneableWeb>(gpuCompilationInfo);
declare const gpuCompilationMessage: GPUCompilationMessage;
expectAssignable<StructuredCloneableWeb>(gpuCompilationMessage);
*/
