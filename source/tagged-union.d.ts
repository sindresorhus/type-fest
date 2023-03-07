/**
Utility type to create a tagged union with given tag

Use-case: A shorter way to declare tagged unions with multiple members.

@example
```
import type {TaggedUnion} from 'type-fest';

type EventMessage = TaggedUnion<
  'tag',
  {
    NavigationStateChanged: {
      state: 'AllowBack' | 'AllowClose'
      navigation?: string
    }
    OpenExternalUrl: {
      url: string
    }
    ButtonVisibilityToggled: {
      visible: boolean
    }
    WebshopPurchaseButtonPressed: { price: string }
  }
>

// Example usage
const message: EventMessage = {
  tag: 'NavigationStateChanged',
  state: 'AllowClose',
};
```

@category Utilities
*/
export type TaggedUnion<
	TagKey extends string,
	UnionMembers extends Record<string, Record<string, unknown>>,
> = {
	[Name in keyof UnionMembers]: {[Key in TagKey]: Name} & UnionMembers[Name];
}[keyof UnionMembers];
