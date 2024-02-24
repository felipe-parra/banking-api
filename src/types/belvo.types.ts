export type ResultInstitutionType = {
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
  next: null;
  previous: null;
  results: ResultInstitutionType[];
};
