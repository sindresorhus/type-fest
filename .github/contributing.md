# Contributing guidelines

## Submitting a new type

- One type addition per pull request, unless they are connected.
- Create a new file in the `test-d` directory and write at least one type test.
	- See the other tests for inspiration.
	- If it makes sense, also write a negative test using [`expectError()`](https://github.com/SamVerschueren/tsd#expecterrorfunction).
- Don't use one-character type names like `T` and `U`. Use descriptive names. See the existing types for inspiration.
- Write a good documentation comment that includes:
	- Write a short and clear description of what the type does.
	- Write about some real-world use-cases where it can be useful. (It can be hard sometimes for users to see where they would use something)
	- Example code block with a realistic example.
	- At the bottom, explain how the type works. Some types can be quite advanced and hard to understand. We can use this opportunity to teach users.
	- If there has been any discussion somewhere about this type, include a link to it. For example, a discussion on the TypeScript issue tracker.
- If you add any internal helper types, they should still be properly documented and tested.
- Add the type to the readme.
- Run `$ npm test` before submitting and make sure it passes.
- Name the pull request ```Add `TypeName` type```.
