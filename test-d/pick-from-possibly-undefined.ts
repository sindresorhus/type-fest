import {expectAssignable, expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {PickFromPossiblyUndefined} from '../index';

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

expectAssignable<CompanyBankAccounts>(bankAccounts);
expectType<string>(bankAccounts.bankAccount);
expectType<string>(bankAccounts.ibanBankAccount);
expectTypeOf(bankAccounts).toMatchTypeOf({
	bankAccount: '123456789',
	ibanBankAccount: '123456789',
});

// Test what happens if type to pick from won't be undefined

type AdminAccount = {
	id: number;
	roleId: number;
	firstName: string;
	lastName: string;
	permissions: string[];
};

type UserAccount = PickFromPossiblyUndefined<AdminAccount, 'id' | 'firstName' | 'lastName'>;

const userAccount: UserAccount = {
	id: 1234,
	firstName: 'Foo',
	lastName: 'Bar',
};

expectAssignable<UserAccount>(userAccount);
expectType<string>(userAccount.firstName);
expectType<string>(userAccount.lastName);
expectTypeOf(userAccount).toMatchTypeOf({
	id: 1234,
	firstName: 'Foo',
	lastName: 'Bar',
});
