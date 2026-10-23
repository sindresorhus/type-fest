import {expectTypeOf} from 'nz';
import type {ConditionalSimplifyDeep, JsonValue} from '../index.d.ts';

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
expectTypeOf(someNode).toBe<SomeNodeSimplified>();

// Should simplify deeply excluding Function type.
type MovablePosition = {
	top: number;
	left: number;
	move(position: Position): Position;
};

type MovableCollection = {
	position: MovablePosition;
	top: {position: MovablePosition; size: Size};
	left: {position: MovablePosition; size: Size};
};

type MovableNodeSimplifiedFail = ConditionalSimplifyDeep<MovableCollection>;
type MovableNodeSimplifiedPass = ConditionalSimplifyDeep<MovableCollection, Function>;

declare const movableNodeSimplifiedFail: MovableNodeSimplifiedFail;
declare const movableNodeSimplifiedPass: MovableNodeSimplifiedPass;

expectTypeOf(movableNodeSimplifiedFail).not.toBeAssignableTo<MovableCollection>();
expectTypeOf(movableNodeSimplifiedPass).toBe<MovableCollection>();

const movablePosition = {
	top: 42,
	left: 42,
	move(newPosition: Position) {
		return newPosition;
	},
};

const movableNode = {
	position: movablePosition,
	top: {position: movablePosition, size},
	left: {position: movablePosition, size},
};

expectTypeOf(movableNode).toBe<MovableNodeSimplifiedPass>();

// Should exclude `Function` and `Size` type (mainly visual, mouse over the statement).
type ExcludeFunctionAndSize1 = ConditionalSimplifyDeep<MovableCollection, Function | Size>;
expectTypeOf(movableNode).toBe<ExcludeFunctionAndSize1>();

// Same as above but using `IncludeType` parameter (mainly visual, mouse over the statement).
type ExcludeFunctionAndSize2 = ConditionalSimplifyDeep<MovableCollection, Function, MovableCollection | Position>;
expectTypeOf(movableNode).toBe<ExcludeFunctionAndSize2>();

// The default `IncludeType` is `unknown`, so the recursion reaches everything, and a function or a built-in comes back as an object of its own members with `{}` types. A function is then not callable at all. `ExcludeType` is the way out, and the test above shows the same for a method. See the note in the docs.
declare const functionMember: ConditionalSimplifyDeep<{a: () => void}>;
expectTypeOf(functionMember).toBe<{a: {}}>();

declare const dateMember: ConditionalSimplifyDeep<{a: Date}>['a'];
expectTypeOf(dateMember).not.toBe<Date>();

declare const withFunctionsExcluded: ConditionalSimplifyDeep<{a: () => void}, Function>;
expectTypeOf(withFunctionsExcluded).toBe<{a: () => void}>();

declare const withDateExcluded: ConditionalSimplifyDeep<{a: Date}, Date>;
expectTypeOf(withDateExcluded).toBe<{a: Date}>();

declare const withBuiltInsExcluded: ConditionalSimplifyDeep<{a: Date; b: () => void}, Date | Function>;
expectTypeOf(withBuiltInsExcluded).toBe<{a: Date; b: () => void}>();

// A plain object is still simplified, which is the type's job.
declare const plainObject: ConditionalSimplifyDeep<{a: {b: string} & {c: number}}>;
expectTypeOf(plainObject).toBe<{a: {b: string; c: number}}>();

// Recursive JSON arrays must not expand through a mapped type indefinitely.
expectTypeOf<ConditionalSimplifyDeep<JsonValue>>().toBeAssignableTo<JsonValue>();
expectTypeOf<JsonValue>().toBeAssignableTo<ConditionalSimplifyDeep<JsonValue>>();

expectTypeOf<ConditionalSimplifyDeep<JsonValue, never, object>>().toBeAssignableTo<JsonValue>();
expectTypeOf<JsonValue>().toBeAssignableTo<ConditionalSimplifyDeep<JsonValue, never, object>>();
type RecursiveData = string | readonly RecursiveData[];
expectTypeOf<ConditionalSimplifyDeep<RecursiveData>>().toBeAssignableTo<RecursiveData>();
expectTypeOf<RecursiveData>().toBeAssignableTo<ConditionalSimplifyDeep<RecursiveData>>();
type Part = {left: string} & {right: number};
expectTypeOf<ConditionalSimplifyDeep<Part[], never, object>>().toBe<Array<{left: string; right: number}>>();
expectTypeOf<ConditionalSimplifyDeep<readonly Part[], never, object>>().toBe<ReadonlyArray<{left: string; right: number}>>();
expectTypeOf<ConditionalSimplifyDeep<readonly [Part?, ...Part[]], never, object>>().toBe<readonly [{left: string; right: number}?, ...Array<{left: string; right: number}>]>();
expectTypeOf<ConditionalSimplifyDeep<readonly [...Part[], Part], never, object>>().toBeAssignableTo<readonly [...Array<{left: string; right: number}>, {left: string; right: number}]>();
expectTypeOf<readonly [...Array<{left: string; right: number}>, {left: string; right: number}]>().toBeAssignableTo<ConditionalSimplifyDeep<readonly [...Part[], Part], never, object>>();
expectTypeOf<ConditionalSimplifyDeep<readonly [Part?, ...Part[]], Part, object>>().toBe<readonly [Part?, ...Part[]]>();
expectTypeOf<ConditionalSimplifyDeep<readonly Part[], readonly unknown[], object>>().toBe<readonly Part[]>();
expectTypeOf<ConditionalSimplifyDeep<Part[], never, Part>>().toBe<Part[]>();
expectTypeOf<ConditionalSimplifyDeep<unknown>>().toBe<{}>();
expectTypeOf<ConditionalSimplifyDeep<unknown[]>>().toBe<Array<{}>>();
expectTypeOf<ConditionalSimplifyDeep<never[]>>().toBe<never[]>();
expectTypeOf<ConditionalSimplifyDeep<never>>().toBe<never>();
expectTypeOf<ConditionalSimplifyDeep<any[], any>>().toBe<any[]>();
