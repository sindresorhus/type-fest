import {expectAssignable, expectNotAssignable} from 'tsd';
import type {MixinClass} from '../index';

type FirstClassInterface = {
	readonly index: number;
};
class FirstClass implements FirstClassInterface {
	static beginning = 'opening';

	readonly index: number;

	constructor(myIndex: number) {
		this.index = myIndex;
	}
}

type SecondClassStaticInterface = {
	middle: string;
};
type SecondClassInterface = {
	isMiddle: boolean;
};

type ThirdClassStaticInterface = {
	readonly ending: string;
};
type ThirdClassInterface = {
	readonly length: number;
};

type SecondClassType = MixinClass<SecondClassStaticInterface, SecondClassInterface, typeof FirstClass>;
class SecondClass extends FirstClass {
	static middle = 'second class';
	isMiddle = true;
}

expectAssignable<SecondClassType>(SecondClass);
expectNotAssignable<SecondClassType>(class extends FirstClass {
	static middle = 'second class';
});
expectNotAssignable<SecondClassType>(class extends FirstClass {
	isMiddle = true;
});
expectAssignable<SecondClassType>(class {
	static middle = 'second class';
	static beginning = 'beginning';

	isMiddle = true;
	index: number;

	constructor(myIndex: number) {
		this.index = myIndex;
	}
});
expectNotAssignable<SecondClassType>(class {
	static beginning = 'beginning';
	isMiddle = true;

	index: number;

	constructor(myIndex: number) {
		this.index = myIndex;
	}
});
expectNotAssignable<SecondClassType>(class {
	static middle = 'second class';
	static beginning = 'beginning';

	index: number;

	constructor(myIndex: number) {
		this.index = myIndex;
	}
});
expectNotAssignable<SecondClassType>(class {
	static middle = 'second class';
	isMiddle = true;

	index: number;

	constructor(myIndex: number) {
		this.index = myIndex;
	}
});
expectNotAssignable<SecondClassType>(class {
	static middle = 'second class';
	static beginning = 'beginning';

	isMiddle = true;

	constructor() {
		if (this.isMiddle) {
			this.isMiddle = false;
		}
	}
});

function buildSecondClass<Middle extends string, IsMiddle extends boolean>(
	middle: Middle,
	isMiddle: IsMiddle,
): SecondClassType {
	return class extends FirstClass {
		static middle = middle;
		isMiddle = isMiddle;
	};
}

expectAssignable<SecondClassType>(buildSecondClass('fake second class', false));

type ThirdClassType = MixinClass<ThirdClassStaticInterface, ThirdClassInterface, SecondClassType>;
expectAssignable<ThirdClassType>(class extends SecondClass {
	static ending: 'this is the end';
	length = 4;
});

function buildThirdClass<Tail extends string, Length extends number>(tail: Tail, length: Length) {
	return class extends buildSecondClass('fake middle class', true) {
		static ending = tail;
		length = length;
	};
}

expectAssignable<ThirdClassType>(buildThirdClass('tail', 16));
