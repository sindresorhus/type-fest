import {IterableElement, AsyncIterableElement} from "../source/iterable"
import {expectType} from 'tsd';

declare const iterableElement: IterableElement<Iterable<string>>;
expectType<string>(iterableElement);

declare const asyncIterableElement: AsyncIterableElement<AsyncIterable<string>>;
expectType<string>(asyncIterableElement);
