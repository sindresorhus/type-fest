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
