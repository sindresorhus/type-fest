export interface NextAble {
	next: NextAble;
}

export interface Constant<T> {
	next: this;
	value: T;
}

/**
 * Call ["next"] 10 times
 */
type GetNext10<T extends NextAble> =
	T["next"]["next"]["next"]["next"]["next"]["next"]["next"]["next"]["next"]["next"];

/**
 * Call ["next"] 100 times
 */
type GetNext100<T extends NextAble> = GetNext10<
	GetNext10<
		GetNext10<
			GetNext10<
				GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<T>>>>>>
			>
		>
	>
>;

/**
 * Call ["next"] 1000 times
 */
export type GetNext1000<T extends NextAble> = GetNext100<
	GetNext100<
		GetNext100<
			GetNext100<
				GetNext100<
					GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<T>>>>>
				>
			>
		>
	>
>;

/**
 * Call ["next"] 10000 times
 */
export type GetNext10000<T extends NextAble> = 
    GetNext1000<T> extends infer Res1 extends NextAble
        ? GetNext1000<Res1> extends infer Res2 extends NextAble
            ? GetNext1000<Res2> extends infer Res3 extends NextAble
                ? GetNext1000<Res3> extends infer Res4 extends NextAble
                    ? GetNext1000<Res4> extends infer Res5 extends NextAble
                        ? GetNext1000<Res5> extends infer Res6 extends NextAble
                            ? GetNext1000<Res6> extends infer Res7 extends NextAble
                                ? GetNext1000<Res7> extends infer Res8 extends NextAble
                                    ? GetNext1000<Res8> extends infer Res9 extends NextAble
                                        ? GetNext1000<Res9> extends infer Res10 extends NextAble
                                            ? Res10
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
export type GetNext100000<T extends NextAble> = 
    GetNext10000<T> extends infer Res1 extends NextAble
        ? GetNext10000<Res1> extends infer Res2 extends NextAble
            ? GetNext10000<Res2> extends infer Res3 extends NextAble
                ? GetNext10000<Res3> extends infer Res4 extends NextAble
                    ? GetNext10000<Res4> extends infer Res5 extends NextAble
                        ? GetNext10000<Res5> extends infer Res6 extends NextAble
                            ? GetNext10000<Res6> extends infer Res7 extends NextAble
                                ? GetNext10000<Res7> extends infer Res8 extends NextAble
                                    ? GetNext10000<Res8> extends infer Res9 extends NextAble
                                        ? GetNext10000<Res9> extends infer Res10 extends NextAble
                                            ? Res10
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