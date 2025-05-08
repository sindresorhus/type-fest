import {expectNotAssignable, expectType} from 'tsd';
import type {ConditionalSimplifyDeep} from '../index.d.ts';

type Position = {top: number; left: number};
type Size = {width: number; height: number};

// In your editor, hovering over `PositionAndSizeSimplified` will show a simplified object with all the properties.
type PositionAndSizeIntersection = Position & Size;

const position = {top: 120, left: 240};
const size = {width: 480, height: 600};
const positionAndSize = {...position, ...size};

// Should simplify interface deeply.
type SomeNode = {
	parent: PositionAndSizeIntersection;
	childs: Array<{parent: PositionAndSizeIntersection}>;
};

// In your editor, hovering over `SomeNodeSimplified` will show a simplified object with all the properties.
type SomeNodeSimplified = ConditionalSimplifyDeep<SomeNode>;

const someNode = {parent: positionAndSize, childs: [{parent: positionAndSize}, {parent: positionAndSize}]};
expectType<SomeNodeSimplified>(someNode);

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

expectNotAssignable<MovableCollection>(movableNodeSimplifiedFail);
expectType<MovableCollection>(movableNodeSimplifiedPass);

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

expectType<MovableNodeSimplifiedPass>(movableNode);

// Should exclude `Function` and `Size` type (mainly visual, mouse over the statement).
type ExcludeFunctionAndSize1 = ConditionalSimplifyDeep<MovableCollection, Function | Size>;
expectType<ExcludeFunctionAndSize1>(movableNode);

// Same as above but using `IncludeType` parameter (mainly visual, mouse over the statement).
type ExcludeFunctionAndSize2 = ConditionalSimplifyDeep<MovableCollection, Function, MovableCollection | Position>;
expectType<ExcludeFunctionAndSize2>(movableNode);
