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
