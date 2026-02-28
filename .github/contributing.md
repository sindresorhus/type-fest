# Contributing guidelines

## Submitting a new type

- One type addition per pull request, unless they are connected.
- **Please help review the other open pull requests.**
	- If there are no open pull requests, provide some feedback on some of the open issues.
- [Example of a type contribution.](https://github.com/sindresorhus/type-fest/commit/5374588a88ee643893784f66367bc26b8e6509ec)
- Create a new file in the `test-d` directory and write at least one type test.
	- See the other tests for inspiration.
	- If it makes sense, also write a negative test using [`expectNotAssignable()`](https://github.com/SamVerschueren/tsd#expectnotassignabletexpression-any) or, to test other diagnostics, [`expectError()`](https://github.com/SamVerschueren/tsd#expecterrort--anyexpression-t).
- Don't use one-character type names like `T` and `U`. Use descriptive names. See the existing types for inspiration.
- Follow the existing code style, even in documentation code examples.
	- Don't prefix each line in documentation comments with `*`.
- Write a good documentation comment that includes:
	- Write a short and clear description of what the type does.
		- The first line should match the description in the readme.
	- Write about some real-world use-cases where it can be useful. (It can be hard sometimes for users to see where they would use something)
	- Example code block with a realistic example.
	- At the bottom, explain how the type works. Some types can be quite advanced and hard to understand. We can use this opportunity to teach users.
	- If there has been any discussion somewhere about this type, include a link to it. For example, a discussion on the TypeScript issue tracker.
	- Add relevant `@category` tags. See other types for examples.
- If you add any internal helper types, they should still be properly documented and tested.
- Add the type to the readme.
- Make sure the file in the `source` directory uses a `.d.ts` extension and not `.ts`.
- **Use AI (like ChatGPT) to catch type bugs, improve docs, spot typos, validate examples, and suggest more tests.** Include all relevant code (type, tests, helpers, etc.) in the prompt, and also provide a couple of existing types as examples of how it's done. Try this prompt: “Review this TypeScript type for correctness, edge cases, naming, docs, and test coverage. Suggest improvements and realistic succinct examples.”
- Run `$ npm test` before submitting and make sure it passes.
- Name the pull request ```Add `TypeName` type```.
