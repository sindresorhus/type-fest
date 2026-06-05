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
type GetNext10<CurrentState extends NextAble> =
	CurrentState["next"]["next"]["next"]["next"]["next"]["next"]["next"]["next"]["next"]["next"];

/**
 * Call ["next"] 100 times
 */
type GetNext100<CurrentState extends NextAble> = 
    CurrentState extends Constant<any>
    ? CurrentState
    : GetNext10<
        GetNext10<
            GetNext10<
                GetNext10<
                    GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<GetNext10<CurrentState>>>>>>
                >
            >
        >
    >;

/**
 * Call ["next"] 1000 times
 */
export type GetNext1000<CurrentState extends NextAble> = 
    CurrentState extends Constant<any>
    ? CurrentState
    : GetNext100<
        GetNext100<
            GetNext100<
                GetNext100<
                    GetNext100<
                        GetNext100<GetNext100<GetNext100<GetNext100<GetNext100<CurrentState>>>>>
                    >
                >
            >
        >
    >;

/**
 * Call ["next"] 10000 times
 */
export type GetNext10000<CurrentState extends NextAble> = 
    CurrentState extends Constant<any>
    ? CurrentState
    : GetNext1000<CurrentState> extends infer Res1 extends NextAble
        ? Res1 extends Constant<any> ? Res1
        : GetNext1000<Res1> extends infer Res2 extends NextAble
            ? Res2 extends Constant<any> ? Res2
            : GetNext1000<Res2> extends infer Res3 extends NextAble
                ? Res3 extends Constant<any> ? Res3
                : GetNext1000<Res3> extends infer Res4 extends NextAble
                    ? Res4 extends Constant<any> ? Res4
                    : GetNext1000<Res4> extends infer Res5 extends NextAble
                        ? Res5 extends Constant<any> ? Res5
                        : GetNext1000<Res5> extends infer Res6 extends NextAble
                            ? Res6 extends Constant<any> ? Res6
                            : GetNext1000<Res6> extends infer Res7 extends NextAble
                                ? Res7 extends Constant<any> ? Res7
                                : GetNext1000<Res7> extends infer Res8 extends NextAble
                                    ? Res8 extends Constant<any> ? Res8
                                    : GetNext1000<Res8> extends infer Res9 extends NextAble
                                        ? Res9 extends Constant<any> ? Res9
                                        : GetNext1000<Res9> extends infer Res10 extends NextAble
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
export type GetNext100000<CurrentState extends NextAble> = 
    CurrentState extends Constant<any>
    ? CurrentState
    : GetNext10000<CurrentState> extends infer Res1 extends NextAble
        ? Res1 extends Constant<any> ? Res1
        : GetNext10000<Res1> extends infer Res2 extends NextAble
            ? Res2 extends Constant<any> ? Res2
            : GetNext10000<Res2> extends infer Res3 extends NextAble
                ? Res3 extends Constant<any> ? Res3
                : GetNext10000<Res3> extends infer Res4 extends NextAble
                    ? Res4 extends Constant<any> ? Res4
                    : GetNext10000<Res4> extends infer Res5 extends NextAble
                        ? Res5 extends Constant<any> ? Res5
                        : GetNext10000<Res5> extends infer Res6 extends NextAble
                            ? Res6 extends Constant<any> ? Res6
                            : GetNext10000<Res6> extends infer Res7 extends NextAble
                                ? Res7 extends Constant<any> ? Res7
                                : GetNext10000<Res7> extends infer Res8 extends NextAble
                                    ? Res8 extends Constant<any> ? Res8
                                    : GetNext10000<Res8> extends infer Res9 extends NextAble
                                        ? Res9 extends Constant<any> ? Res9
                                        : GetNext10000<Res9> extends infer Res10 extends NextAble
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