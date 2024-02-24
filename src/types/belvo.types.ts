export type InstitutionType = {
  id: number;
  name: string;
  type: string;
  code: string;
  website: null;
  display_name: string;
  country_code: string;
  country_codes: string[];
  primary_color: string;
  logo: string;
  icon_logo: string;
  text_logo: string;
  form_fields: FormField[];
  features: Feature[];
  integration_type: string;
  status: string;
  resources: string[];
  openbanking_information: null;
};

export type Feature = {
  name: string;
  description: string;
};

export type FormField = {
  name: string;
  type: string;
  label: string;
  validation: string;
  placeholder?: string;
  validation_message: string;
  length?: string;
  optional?: boolean;
};

export type InstitutionResponse = {
  count: 4;
  next: string | null;
  previous: string | null;
  results: InstitutionType[];
};

export type TransactionResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TransactionType[] | null;
};

export type TransactionType = {
  id: string;
  account: Account;
  created_at: Date;
  category: string;
  subcategory: null | string;
  merchant: Merchant;
  type: ResultType;
  amount: number;
  status: Status;
  balance: number;
  currency: Currency;
  reference: string;
  value_date: Date;
  description: string;
  collected_at: Date;
  observations: null;
  accounting_date: Date;
  internal_identification: string;
};

export type Account = {
  id: string;
  link: string;
  institution: Institution;
  created_at: Date;
  name: string;
  type: AccountType;
  agency: string;
  number: string;
  balance: Balance;
  category: Category;
  currency: Currency;
  loan_data: LoanData | null;
  credit_data: CreditData | null;
  balance_type: BalanceType;
  collected_at: Date;
  bank_product_id: string;
  last_accessed_at: Date;
  internal_identification: string;
  public_identification_name: PublicIdentificationName;
  public_identification_value: string;
};

export type Balance = {
  current: number;
  available: number;
};

export enum BalanceType {
  Asset = "ASSET",
  Liability = "LIABILITY",
}

export enum Category {
  CheckingAccount = "CHECKING_ACCOUNT",
  CreditCard = "CREDIT_CARD",
  LoanAccount = "LOAN_ACCOUNT",
}

export type CreditData = {
  collected_at: Date;
  credit_limit: number;
  cutting_date: Date;
  interest_rate: number;
  minimum_payment: number;
  monthly_payment: number;
  last_payment_date: Date;
  next_payment_date: Date;
  last_period_balance: number;
  no_interest_payment: number;
};

export enum Currency {
  Mxn = "MXN",
}

export type Institution = {
  name: Name;
  type: TypeOfInstitution;
};

export enum Name {
  EreborMXRetail = "erebor_mx_retail",
}

export enum TypeOfInstitution {
  Bank = "bank",
}

export type LoanData = {
  fees: null;
  limit_day: string;
  loan_type: null;
  principal: null;
  limit_date: Date;
  cutting_day: string;
  collected_at: Date;
  credit_limit: number;
  cutting_date: Date;
  interest_rate: null;
  interest_rates: null;
  contract_number: null;
  monthly_payment: null;
  payment_due_day: null;
  last_payment_date: Date;
  next_payment_date: Date;
  contract_start_date: null;
  last_period_balance: null;
  no_interest_payment: null;
  outstanding_balance: null;
  outstanding_principal: null;
  number_of_installments_total: null;
  number_of_installments_outstanding: null;
};

export enum PublicIdentificationName {
  AccountNumber = "ACCOUNT_NUMBER",
  Clabe = "CLABE",
  CreditCardNumber = "CREDIT_CARD_NUMBER",
}

export enum AccountType {
  Créditos = "Créditos",
  CuentasDeEfectivo = "Cuentas de efectivo",
}

export type Merchant = {
  logo: string;
  name: string;
  website: string;
};

export enum Status {
  Pending = "PENDING",
  Processed = "PROCESSED",
}

export enum ResultType {
  Inflow = "INFLOW",
  Outflow = "OUTFLOW",
}

export type AccountResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AccountResponseType[];
};

export type AccountResponseType = {
  id: string;
  link: string;
  institution: Institution;
  created_at: Date;
  name: string;
  type: string;
  agency: string;
  number: string;
  balance: Balance;
  category: string;
  currency: string;
  loan_data: LoanData | null;
  credit_data: CreditData | null;
  balance_type: string;
  collected_at: Date;
  bank_product_id: string;
  last_accessed_at: Date;
  internal_identification: string;
  public_identification_name: string;
  public_identification_value: string;
};
