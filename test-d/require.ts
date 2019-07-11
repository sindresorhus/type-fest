import { expectType } from 'tsd';
import { Require } from '..'

// update one required and one optional to required
declare const variation1: Require<{a?: number, b: string, c?: boolean}, 'b' | 'c'>;
expectType<{a?:number, b: string, c: boolean}>(variation1);

// update two optional to required
declare const variation2: Require<{a?: number, b?: string, c?: boolean}, 'a' | 'b'>;
expectType<{a:number, b: string, c?: boolean}>(variation2)

// three required remain required
declare const variation3: Require<{a: number, b:string, c:boolean}, 'a' | 'b' | 'c'>
expectType<{a: number, b:string, c:boolean}>(variation3)