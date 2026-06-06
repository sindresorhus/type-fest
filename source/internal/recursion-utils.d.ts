/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface NextAble {
	next: NextAble;
}
/**
 * using this interface is required here as it stops typescript from creating more intermediate types and use already existing this type
 */

export interface Constant<T> {
	next: this;
	value: T;
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */
/**
 * Call ["next"] 10 times
 */
type GetNext10<CurrentState extends NextAble> =
	CurrentState['next']['next']['next']['next']['next']['next']['next']['next']['next']['next'];

/**
 * Call ["next"] 100 times
 */
type GetNext100<CurrentState extends NextAble> =
	CurrentState extends Constant<any>
		? CurrentState
		: GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<CurrentState>>>>>>>>>>;

/**
 * Call ["next"] 1000 times
 */
export type GetNext1000<CurrentState extends NextAble> =
	CurrentState extends Constant<any>
		? CurrentState
		: GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<CurrentState>>>>>>>>>>;

/**
 * Call ["next"] 10000 times
 */
export type GetNext10000<CurrentState extends NextAble> =
	CurrentState extends Constant<any>
		? CurrentState
		: GetNext1000<CurrentState> extends infer Result1 extends NextAble
			? Result1 extends Constant<any> ? Result1
				: GetNext1000<Result1> extends infer Result2 extends NextAble
					? Result2 extends Constant<any> ? Result2
						: GetNext1000<Result2> extends infer Result3 extends NextAble
							? Result3 extends Constant<any> ? Result3
								: GetNext1000<Result3> extends infer Result4 extends NextAble
									? Result4 extends Constant<any> ? Result4
										: GetNext1000<Result4> extends infer Result5 extends NextAble
											? Result5 extends Constant<any> ? Result5
												: GetNext1000<Result5> extends infer Result6 extends NextAble
													? Result6 extends Constant<any> ? Result6
														: GetNext1000<Result6> extends infer Result7 extends NextAble
															? Result7 extends Constant<any> ? Result7
																: GetNext1000<Result7> extends infer Result8 extends NextAble
																	? Result8 extends Constant<any> ? Result8
																		: GetNext1000<Result8> extends infer Result9 extends NextAble
																			? Result9 extends Constant<any> ? Result9
																				: GetNext1000<Result9> extends infer Result10 extends NextAble
																					? Result10
																					: never
																			: never
																	: never
															: never
													: never
											: never
									: never
							: never
					: never
			: never;

/**
 * Call ["next"] 100000 times
 */
export type GetNext100000<CurrentState extends NextAble> =
	CurrentState extends Constant<any>
		? CurrentState
		: GetNext10000<CurrentState> extends infer Result1 extends NextAble
			? Result1 extends Constant<any> ? Result1
				: GetNext10000<Result1> extends infer Result2 extends NextAble
					? Result2 extends Constant<any> ? Result2
						: GetNext10000<Result2> extends infer Result3 extends NextAble
							? Result3 extends Constant<any> ? Result3
								: GetNext10000<Result3> extends infer Result4 extends NextAble
									? Result4 extends Constant<any> ? Result4
										: GetNext10000<Result4> extends infer Result5 extends NextAble
											? Result5 extends Constant<any> ? Result5
												: GetNext10000<Result5> extends infer Result6 extends NextAble
													? Result6 extends Constant<any> ? Result6
														: GetNext10000<Result6> extends infer Result7 extends NextAble
															? Result7 extends Constant<any> ? Result7
																: GetNext10000<Result7> extends infer Result8 extends NextAble
																	? Result8 extends Constant<any> ? Result8
																		: GetNext10000<Result8> extends infer Result9 extends NextAble
																			? Result9 extends Constant<any> ? Result9
																				: GetNext10000<Result9> extends infer Result10 extends NextAble
																					? Result10
																					: never
																			: never
																	: never
															: never
													: never
											: never
									: never
							: never
					: never
			: never;

export {};
