import {expectType} from 'tsd';
import type {NegativeInfinity, PositiveInfinity, Gt, Gte, Lt, Lte, Add, Subtract} from '../source/math';

declare const never: never;

// Gt
expectType<Gt<1, 2>>(false);
expectType<Gt<2, 1>>(true);
expectType<Gt<10, 2>>(true);
expectType<Gt<10, -2>>(true);
expectType<Gt<2, 2>>(false);
expectType<Gt<-2, -2>>(false);
expectType<Gt<-2, -3>>(true);
expectType<Gt<-2, number>>(never);

expectType<Gt<PositiveInfinity, -999>>(true);
expectType<Gt<PositiveInfinity, 999>>(true);
expectType<Gt<999, PositiveInfinity>>(false);
expectType<Gt<999, NegativeInfinity>>(true);
expectType<Gt<-999, NegativeInfinity>>(true);
expectType<Gt<PositiveInfinity, PositiveInfinity>>(false);
expectType<Gt<NegativeInfinity, NegativeInfinity>>(false);
expectType<Gt<PositiveInfinity, NegativeInfinity>>(true);

// Gte
expectType<Gte<1, 2>>(false);
expectType<Gte<2, 1>>(true);
expectType<Gte<10, 2>>(true);
expectType<Gte<10, -2>>(true);
expectType<Gte<2, 2>>(true);
expectType<Gte<-2, -2>>(true);
expectType<Gte<-2, -3>>(true);
expectType<Gte<-2, number>>(never);

expectType<Gte<PositiveInfinity, -999>>(true);
expectType<Gte<PositiveInfinity, 999>>(true);
expectType<Gte<999, PositiveInfinity>>(false);
expectType<Gte<999, NegativeInfinity>>(true);
expectType<Gte<-999, NegativeInfinity>>(true);
expectType<Gte<PositiveInfinity, PositiveInfinity>>(true);
expectType<Gte<NegativeInfinity, NegativeInfinity>>(true);
expectType<Gte<PositiveInfinity, NegativeInfinity>>(true);

// Lt
expectType<Lt<1, 2>>(true);
expectType<Lt<2, 1>>(false);
expectType<Lt<10, 2>>(false);
expectType<Lt<10, -2>>(false);
expectType<Lt<2, 2>>(false);
expectType<Lt<-2, -2>>(false);
expectType<Lt<-2, -3>>(false);
expectType<Lt<-2, number>>(never);
expectType<Lt<PositiveInfinity, -999>>(false);
expectType<Lt<PositiveInfinity, 999>>(false);
expectType<Lt<999, PositiveInfinity>>(true);
expectType<Lt<999, NegativeInfinity>>(false);
expectType<Lt<-999, NegativeInfinity>>(false);
expectType<Lt<PositiveInfinity, PositiveInfinity>>(false);
expectType<Lt<NegativeInfinity, NegativeInfinity>>(false);
expectType<Lt<PositiveInfinity, NegativeInfinity>>(false);

// Lte
expectType<Lte<1, 2>>(true);
expectType<Lte<2, 1>>(false);
expectType<Lte<10, 2>>(false);
expectType<Lte<10, -2>>(false);
expectType<Lte<2, 2>>(true);
expectType<Lte<-2, -2>>(true);
expectType<Lte<-2, -3>>(false);
expectType<Lte<-2, number>>(never);
expectType<Lte<PositiveInfinity, -999>>(false);
expectType<Lte<PositiveInfinity, 999>>(false);
expectType<Lte<999, PositiveInfinity>>(true);
expectType<Lte<999, NegativeInfinity>>(false);
expectType<Lte<-999, NegativeInfinity>>(false);
expectType<Lte<PositiveInfinity, PositiveInfinity>>(true);
expectType<Lte<NegativeInfinity, NegativeInfinity>>(true);
expectType<Lte<PositiveInfinity, NegativeInfinity>>(false);

// Add
expectType<Add<1, 2>>(3);
expectType<Add<10, -2>>(8);
expectType<Add<2, -2>>(0);

expectType<Add<-1, -2>>(null! as number); // Note: you can only get `number` for now

expectType<Add<PositiveInfinity, -999>>(null! as PositiveInfinity);
expectType<Add<-999, PositiveInfinity>>(null! as PositiveInfinity);
expectType<Add<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Add<999, NegativeInfinity>>(null! as NegativeInfinity);
expectType<Add<NegativeInfinity, PositiveInfinity>>(null! as number);

// Subtract
expectType<Subtract<10, -2>>(12);
expectType<Subtract<2, 2>>(0);
expectType<Subtract<-1, -3>>(2);

expectType<Subtract<1, 2>>(null! as number); // Note: you can only get `number` for now

expectType<Subtract<PositiveInfinity, 999>>(null! as PositiveInfinity);
expectType<Subtract<-999, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Subtract<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Subtract<999, NegativeInfinity>>(null! as PositiveInfinity);
expectType<Subtract<NegativeInfinity, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Subtract<NegativeInfinity, NegativeInfinity>>(null! as number);
expectType<Subtract<PositiveInfinity, PositiveInfinity>>(null! as number);
