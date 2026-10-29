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
Link other types with `{@link Simplify}`, and `import type` the linked type with a ``// For `@link` `` comment so the link resolves in editors. The `type-fest/jsdoc-link-imports` lint rule enforces this, and `npx xo --fix` adds the imports, except in a file that has no imports and starts with a line comment (for example a triple-slash directive). Add the import by hand there.

## Testing

Only `exactOptionalPropertyTypes: true` is supported. Do not add fixes, tests, compiler configurations, or compatibility logic for `exactOptionalPropertyTypes: false`.

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
6. Commit - See *Commit titles* below

## Commit titles

- New type: ``Add `TypeName` type``. Several new types: ``Add `MapKey` and `MapValue` types``.
- Any change to existing types (fix, docs, tests, readme entry, alternative name) MUST start with the type names and a colon: `` `TypeName`: Fix description ``.
- Several existing types: list them all, separated by commas: `` `TypeA`, `TypeB`, `TypeC`: Fix docs ``.
- Never start the title with "Add" when you change an existing type, even when you add something to it. Write `` `AllUnionFields`: Document `MergeUnion` as an alternative name ``, not ``Add `MergeUnion` as an alternative name for `AllUnionFields` ``.
- Only changes that are not about specific types (tooling, dependencies, general docs) use a plain title, like `Update dependencies`.

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
- Do not add entries to the readme "Declined types" section. The issue or pull request thread keeps the reason.

## Unsupported

These cases cost performance and consistency for few users. Do not add handling for them. Document them as limitations instead.

- Key matching beyond TypeScript's own rules (`keyof`, `Pick`, `Omit`): enum fields selected by plain strings, noncanonical numeric strings (`'00'`, `'1e3'`), and reading every union member at the keys of all members. The one supported alias is `0` vs `'0'`. Use `ExactKey` from `source/internal/keys.d.ts` for it. `KeySelector` also maps enum members to their values, and some existing types match more (for example through `KeyAliases` or `NormalizedKeys`). Do not grow that or extend it to other types, and do not add another matcher.
- A union of option values (for example `{recurseIntoArrays: boolean}`), a union of option objects, or a `never` option value. Do not compute a union of strategies. The result uses one strategy, usually the default.
- Extreme edge cases that real code does not hit, such as exponent-notation numbers (`1e21`), huge lengths, or fractional indexes. Handling one usually breaks another.

## Troubleshooting

- Tests fail? Check `.d.ts` imports, `export {};`, edge cases (`any`, `never`, `unknown`)
- Lint errors? Add to `index.d.ts`, fix issues (don't disable rules)
