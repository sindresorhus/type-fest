# type-fest

TypeScript utility types library. Pure type-level programming—no runtime code.

**Read `.github/contributing.md` for complete guidelines.**

## Commands

```bash
npm test         # MUST pass before committing (runs all below)
npm run test:tsc # TypeScript compiler
npm run test:nz  # Type tests (nz)
npm run test:xo  # Linter
```

## File Structure

```text
source/type-name.d.ts → Type definition (.d.ts REQUIRED)
test-d/type-name.ts   → Tests (nz)
index.d.ts            → Export (MUST add, lint enforces)
readme.md             → API docs (add to category)
source/internal/      → Shared helpers (not exported)
```

## Code Patterns

````ts
// ✅ CORRECT
import type {IsNever} from './is-never.d.ts';  // Include .d.ts
export type MyType<Value extends string> = ... // Descriptive names (not T/U)
export {};                                      // REQUIRED at end

// ❌ WRONG
import type {IsNever} from './is-never';       // Missing .d.ts
export type MyType<T> = ...;                   // Single-letter

/**
Creates a tuple type of specified length with elements of specified type.

Use-cases:
- Define fixed-length arrays with specific types

@example
```
import type {TupleOf} from 'type-fest';
type RGB = TupleOf<3, number>; //=> [number, number, number]
```

@category Array
*/
export type TupleOf<Length extends number, Fill = unknown> = ...;
export {};
````

Type params: `Value`, `Target`, `Item`, `Length`, `Element`, `Key` (not `T`, `U`, `V`, `K`)
Docs: No `*` prefix. First line → readme. Include use-cases, examples, `@category`.

## Testing

**ALWAYS test edge cases** (`any`, `never`, `unknown`).

```ts
expectTypeOf<MyType<'foo'>>().toBe<string>();                       // Basic
expectTypeOf<MyType<any>>().toBe<any>();                            // any/never/unknown
expectTypeOf<{wrong: true}>().not.toBeAssignableTo<MyType<'foo'>>(); // Negative
// @ts-expect-error                                                 // Should error
type Invalid = MyType<number>;
```

Study: `source/tuple-of.d.ts`, `is-equal.d.ts`, `literal-union.d.ts`, `internal/*.d.ts`

## Workflow

1. Research - Study `source/` similar types + online research
2. Define - `source/type-name.d.ts` with docs
3. Test - `test-d/type-name.ts` with edge cases
4. Export - Add to `index.d.ts` + readme.md
5. Verify - `npm test` must pass
6. Commit - ``Add `TypeName` type`` or ``  `TypeName`: Fix description``

## Critical Rules

1. Import paths MUST include `.d.ts` extension
2. Files MUST end with `export {};`
3. Types MUST be exported from `index.d.ts`
4. Type params MUST use descriptive names (not `T`/`U`)
5. MUST test `any`, `never`, `unknown` edge cases
6. First doc line MUST be concise (goes in readme)
7. Use realistic examples with `//=>` comments
8. Include `@category` tags
9. Fix lint issues, don't disable rules

## Type Programming

- Conditionals: `T extends U ? X : Y`
- Recursion: `type Loop<T, Acc> = ... Loop<...> ...`
- Extract: `infer Item`
- Distribute: `T extends any ? ... : never`
- Count via tuple `['length']`
- Union distribution is tricky—test it
- Path autocomplete: use `LiteralUnion<Paths<T, {maxRecursionDepth: 2}>, string | number>`, never full-depth `Paths<T>`. Deeper `Paths` in a constraint can take minutes on large union-heavy types (#954), and `number` keeps a generic `Paths<T>` valid.

## Philosophy

- Correctness > cleverness
- Real problems only
- Docs teach how, not what
- Edge cases mandatory
- One concept per PR
- Descriptive names > brevity
- No unrelated changes

## Troubleshooting

- Tests fail? Check `.d.ts` imports, `export {};`, edge cases (`any`, `never`, `unknown`)
- Lint errors? Add to `index.d.ts`, fix issues (don't disable rules)
