# Contributing guidelines

## Submitting a new type

- One type addition per pull request, unless they are connected.
- Create a new file in the `test` directory and write at least one type test.
	- The tool we use for testing doesn't currently support ["expect error"-kinda tests](https://github.com/SamVerschueren/tsd-check/issues/2), but it would be nice if you could include at least one negative test commented-out. [(Example)](https://github.com/sindresorhus/type-fest/pull/6/files#diff-6758bd513790b0134f1b07f6456260dbR28)
	- You also need to add an import to the test file in the `index.test-d.ts` file.
- Don't use one-character type names like `T` and `U`. Use descriptive names. See the existing types for inspiration.
- Write a good documentation comment that includes:
	- Write a short and clear description of the type does.
	- Write about some real-world use-cases where it can be useful. (It can be hard sometimes for users to see where they would use something)
	- Example code block
	- At the bottom, explain how the type works. Some types can be quite advanced and hard to understand. We can use this opportunity to teach users.
	- If there has been any discussion somewhere about this type, include a link to it. For example, a discussion on the TypeScript issue tracker.
- If you add any internal helper types, they should still be properly documented and tested.
- Add the type to the readme.
- Run `$ npm test` before submitting and make sure it passes.
- Name the pull request ```Add `TypeName` type```.
