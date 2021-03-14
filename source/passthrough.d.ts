/**
A passthrough type that allows some types to be used to extend an interface, which originally can't.

@example
```
import {Passthrough} from 'type-fest';

// Syntax Error
interface EnhancedAnchorProps extends JSX.IntrinsicElements["a"] { ... }

// Valid Syntax
interface EnhancedAnchorProps extends Passthrough<JSX.IntrinsicElements["a"]> { ... }
```
*/
export type Passthrough<Type> = Type;
