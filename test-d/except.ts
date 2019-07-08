import {expectType} from 'tsd';
import {Except} from '..';

declare const except: Except<{a: number; b: string}, 'b'>;
expectType<{a: number}>(except);
