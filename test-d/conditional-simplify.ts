import {expectTypeOf} from 'expect-type';
import type {ConditionalSimplify, ConditionalSimplifyDeep} from '../source/conditional-simplify';

type Position = {top: number; left: number};
type Size = {width: number; height: number};

// In your editor, hovering over `PositionAndSizeSimplified` will show a simplified object with all the properties.
type PositionAndSizeIntersection = Position & Size;
type PositionAndSizeSimplified = ConditionalSimplify<PositionAndSizeIntersection>;

const position = {top: 120, left: 240};
const size = {width: 480, height: 600};
const positionAndSize = {...position, ...size};
expectTypeOf(positionAndSize).toEqualTypeOf<PositionAndSizeSimplified>();

// Exclude function type to be simplified.
type SomeFunction = (type: string) => string;
type SimplifiedFunctionFail = ConditionalSimplify<SomeFunction>; // Return '{}'
type SimplifiedFunctionPass = ConditionalSimplify<SomeFunction, Function>; // Return '(type: string) => string'

declare const simplifiedFunctionFail: SimplifiedFunctionFail;
declare const simplifiedFunctionPass: SimplifiedFunctionPass;

expectTypeOf(simplifiedFunctionFail).not.toMatchTypeOf<SomeFunction>();
expectTypeOf(simplifiedFunctionPass).toEqualTypeOf<SomeFunction>();

// Should simplify interface deeply.
type SomeNode = {
	parent: PositionAndSizeIntersection;
	childs: Array<{parent: PositionAndSizeIntersection}>;
};

// In your editor, hovering over `SomeNodeSimplified` will show a simplified object with all the properties.
type SomeNodeSimplified = ConditionalSimplifyDeep<SomeNode>;

const someNode = {parent: positionAndSize, childs: [{parent: positionAndSize}, {parent: positionAndSize}]};
expectTypeOf(someNode).toEqualTypeOf<SomeNodeSimplified>();

// Should simplify interface deeply excluding Function type.
// TODO: Convert this to a `type`.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface MovablePosition extends Position {
	move(position: Position): Position;
}

type MovableCollection = {
	position: MovablePosition;
	top: {position: MovablePosition; size: Size};
	left: {position: MovablePosition; size: Size};
};

type MovableNodeSimplifiedFail = ConditionalSimplifyDeep<MovableCollection>;
type MovableNodeSimplifiedPass = ConditionalSimplifyDeep<MovableCollection, Function>;

declare const movableNodeSimplifiedFail: MovableNodeSimplifiedFail;
declare const movableNodeSimplifiedPass: MovableNodeSimplifiedPass;

expectTypeOf(movableNodeSimplifiedFail).not.toMatchTypeOf<MovableCollection>();
expectTypeOf(movableNodeSimplifiedPass).toEqualTypeOf<MovableCollection>();

const movablePosition = {
	top: 42,
	left: 42,
	move(position: Position) {
		return position;
	},
};

const movableNode = {
	position: movablePosition,
	top: {position: movablePosition, size},
	left: {position: movablePosition, size},
};

expectTypeOf(movableNode).toEqualTypeOf<MovableNodeSimplifiedPass>();

// Should exclude `Function` and `Size` type (mainly visual, mouse over the statement).
type ExcludeFunctionAndSize1 = ConditionalSimplifyDeep<MovableCollection, Function | Size>;
expectTypeOf(movableNode).toEqualTypeOf<ExcludeFunctionAndSize1>();

// Same as above but using `IncludeType` parameter (mainly visual, mouse over the statement).
type ExcludeFunctionAndSize2 = ConditionalSimplifyDeep<MovableCollection, Function, MovableCollection | Position>;
expectTypeOf(movableNode).toEqualTypeOf<ExcludeFunctionAndSize2>();
