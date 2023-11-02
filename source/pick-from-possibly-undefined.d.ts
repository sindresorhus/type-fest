/**
`Pick` properties from type that may be undefined.

@example:
```
import { PickFromPossiblyUndefined } from 'type-fest';

type BillingDetails = {
 taxId: string;
 companyName: string;
 address: string;
 bankAccount: string;
 ibanBankAccount: string;
} | undefined;

type CompanyBankAccounts = PickFromPossiblyUndefined<BillingDetails, 'bankAccount' | 'ibanBankAccount'>;

const bankAccounts: CompanyBankAccounts = {
 bankAccount: '123456789',
 ibanBankAccount: '123456789',
};

await proceedPayment(bankAccounts);
```

@category Object
 **/
export type PickFromPossiblyUndefined<Type, Props extends keyof NonNullable<Type>> = Type extends undefined
	? never
	: NonNullable<Type> extends object
		? Pick<NonNullable<Type>, Props>
		: never;
