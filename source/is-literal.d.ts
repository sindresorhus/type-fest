import type {Primitive} from './primitive';
import type {IsNever, IsNotFalse} from './internal';

/** @link https://stackoverflow.com/a/52806744/10292952 */
type LiteralCheck<T, LiteralType extends Primitive> = (
	IsNever<T> extends false // Must be wider than `never`
		? [T] extends [LiteralType] // Must be narrower than `LiteralType`
			? [LiteralType] extends [T] // Cannot be wider than `LiteralType`
				? false
				: true
			: false
		: false
);

type LiteralChecks<T, LiteralUnionType> = (
	// Conditional type to force union distribution
	LiteralUnionType extends Primitive
		? IsNotFalse<LiteralCheck<T, LiteralUnionType>>
		: false
);

export type IsStringLiteral<T> = LiteralCheck<T, string>;

export type IsNumericLiteral<T> = IsNotFalse<LiteralCheck<T, number> | LiteralCheck<T, bigint>>;

export type IsBooleanLiteral<T> = LiteralCheck<T, boolean>;

export type IsSymbolLiteral<T> = LiteralCheck<T, symbol>;

type IsLiteralUnion<T> =
	| IsStringLiteral<T>
	| IsNumericLiteral<T>
	| IsBooleanLiteral<T>
	| IsSymbolLiteral<T>;

export type IsLiteral<T extends Primitive> = IsNotFalse<IsLiteralUnion<T>>;
