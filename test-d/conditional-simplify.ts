import {expectNotAssignable, expectType} from 'tsd';
import type {ConditionalSimplify} from '../index.d.ts';

type Position = {top: number; left: number};
type Size = {width: number; height: number};

// In your editor, hovering over `PositionAndSizeSimplified` will show a simplified object with all the properties.
type PositionAndSizeIntersection = Position & Size;
type PositionAndSizeSimplified = ConditionalSimplify<PositionAndSizeIntersection>;

const position = {top: 120, left: 240};
const size = {width: 480, height: 600};
const positionAndSize = {...position, ...size};
expectType<PositionAndSizeSimplified>(positionAndSize);

// Exclude function type to be simplified.
type SomeFunction = (type: string) => string;
type SimplifiedFunctionFail = ConditionalSimplify<SomeFunction>; // Return '{}'
type SimplifiedFunctionPass = ConditionalSimplify<SomeFunction, Function>; // Return '(type: string) => string'

declare const simplifiedFunctionFail: SimplifiedFunctionFail;
declare const simplifiedFunctionPass: SimplifiedFunctionPass;

expectNotAssignable<SomeFunction>(simplifiedFunctionFail);
expectType<SomeFunction>(simplifiedFunctionPass);

declare const sym: unique symbol;

type Sym = typeof sym;

type Union1 = 'a' | Sym | null | ['b', 5];
type Union2 = 2 | void | string | SomeFunction;

type UnSimplifiedUnion = Union1 | Union2;
type UnSimplifiedObject = {prop: UnSimplifiedUnion}; // Hovering over `prop` dont show it's types
type SimplifiedObject = {prop: ConditionalSimplify<UnSimplifiedUnion>}; // Hovering over `prop` show it's types

const unSimpleObject: UnSimplifiedObject = {prop: 'a'}; // Hovering over object or `prop` dont show it's types

// Shoud simplify the union members (mainly visual, mouse over the statement).
const simpleObject: SimplifiedObject = {prop: 'a'}; // Hovering over object or `prop` show it's types
