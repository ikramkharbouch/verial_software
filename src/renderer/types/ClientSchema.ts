import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form';
import { z, ZodType } from 'zod'; // Add new import

export type FormData = {
  fileNb: string;
  insuranceDetails: string;
  nif: number;
  firstName: string;
  lastName: string;
  iceo: string;
  taxName: string;
  phone: number;
  province: string;
  location: string;
  postalCode: string;
  phoneOne: number;
  phoneTwo: number;
  phoneThree: number;
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  label: string;
  name: ValidFieldNames;
  register: UseFormRegister<FieldValues>;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames =
  | 'fileNb'
  | 'insuranceDetails'
  | 'nif'
  | 'firstName'
  | 'lastName'
  | 'iceo'
  | 'taxName'
  | 'phone'
  | 'province'
  | 'location'
  | 'postalCode'
  | 'phoneOne'
  | 'phoneTwo'
  | 'phoneThree';

export const ClientSchema: ZodType<any> = z.object({
  fileNb: z
    .number({
      required_error: 'required field',
      invalid_type_error: 'File Number is required',
    }),
  insuranceDetails: z
    .string(),
  nif: z
    .string({
      required_error: 'required field',
      invalid_type_error: 'NIF is required',
    })
    ,
  clientType: z.string(),
  firstName: z
    .string({
      required_error: 'required field',
      invalid_type_error: 'First Name is required',
    })
    ,
  lastName: z
    .string({
      required_error: 'required field',
      invalid_type_error: 'First Name is required',
    })
    ,
  iceo: z
    .string({
      required_error: 'required field',
      invalid_type_error: 'ICEO is required',
    })
    ,
  taxName: z.string({
    required_error: 'required field',
    invalid_type_error: 'TaxName is required',
  }),
  phone: z.number({
    required_error: 'required field',
    invalid_type_error: 'Phone number is required',
  }),
  province: z
    .string({
      required_error: 'required field',
      invalid_type_error: 'Province is required',
    })
   ,
  location: z.string(),
  postalCode: z.string(),
  phoneOne: z.number(),
  phoneTwo: z.number(),
  phoneThree: z.number(),
});
