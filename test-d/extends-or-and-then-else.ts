import {expectType} from 'tsd';
import {ExtendsOr, ExtendsAnd, ExtendsThenElse} from '../index';

declare const bool: boolean;
declare const string: string;

expectType<ExtendsOr<typeof bool, boolean, string>>(bool); // Passthru match
expectType<ExtendsOr<typeof bool, Function, string>>(string); // Fallback/short-circuit non-match

expectType<ExtendsAnd<typeof bool, boolean, string>>(string); // Coerce match
expectType<ExtendsAnd<typeof bool, Function, string>>(bool); // Passthru non-match

expectType<ExtendsThenElse<typeof bool, boolean, string, never>>(string); // Then
expectType<ExtendsThenElse<typeof bool, Function, never, string>>(string); // Else
