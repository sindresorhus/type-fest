import {expectType} from 'tsd';
import {Except} from '../index';

declare const except: Except<{a: number; b: string}, 'b'>;
expectType<{a: number}>(except);
