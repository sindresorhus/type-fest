import {expectType, expectError} from 'tsd';
import type {StrictEventTarget} from '../index.d.ts';

class MyEmitter extends EventTarget implements StrictEventTarget<{
	foo: 'null',
}> {
}

const emitter = new MyEmitter();

emitter.addEventListener('foo', event => {
	// expectType<CustomEvent<'null'>>(event);
	expectType<'null'>(event.detail);
});
//
// // @ts-expect-error
// emitter.addEventListener('bar', event => {
// 	expectType<Event>(event);
// });
//
// emitter.dispatchEvent(new CustomEvent('foo', { detail: 'null' }));
//
// // @ts-expect-error
// emitter.dispatchEvent(new CustomEvent('foo', { detail: 123 }));
//
// // @ts-expect-error
// emitter.dispatchEvent(new Event('foo'));
//
// // The following tests are to ensure that the untyped overloads are not present
//
// // @ts-expect-error
// emitter.addEventListener('foo', null);
//
// // @ts-expect-error
// emitter.addEventListener('foo', () => {}, { capture: true, passive: true, unknownOption: true });
//
// // @ts-expect-error
// emitter.removeEventListener('foo', null);
//
// // @ts-expect-error
// emitter.removeEventListener('foo', () => {}, { capture: true, unknownOption: true });
//
// // @ts-expect-error
// emitter.dispatchEvent({ type: 'foo'
// }
