type InternalPaths<TObject, Parent extends (string | number)> = TObject extends any[]
	? {
			[Key in (keyof TObject) & number]: (
				| (Parent extends '' ? `${Key}` : `${Parent}.${Key}`)
				| InternalPaths<TObject[Key], Parent extends '' ? `${Key}` : `${Parent}.${Key}`>
			)
		}[(keyof TObject) & number]
	: TObject extends object
		? {
				[Key in (keyof TObject) & (string | number)]: (
					| (Parent extends '' ? `${Key}` : `${Parent}.${Key}`)
					| InternalPaths<TObject[Key], Parent extends '' ? `${Key}` : `${Parent}.${Key}`>
				)
			}[(keyof TObject) & (string | number)]
		: never;

/**
Create a type that represents all the possible paths to properties in the object. It fully supports nested arrays and objects.

@example
```
interface User {
	id: number;
	name: {
		first: string;
		last: string;
	};
	friends: Array<{
		id: number;
		name: string;
	}>;
}

type UserPaths = Paths<User>;
// | 'id'
// | 'name'
// | 'name.first'
// | 'name.last'
// | 'friends'
// | `friends.${number}`
// | `friends.${number}.id`
// | `friends.${number}.name`
```
*/
export type Paths<ObjectType> = InternalPaths<ObjectType, ''>;
