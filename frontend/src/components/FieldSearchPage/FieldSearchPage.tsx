import { ErrorMessage, Field } from '@atlaskit/form';
import { AsyncSelect, ValueType as Value } from '@atlaskit/select';

import { Fragment } from 'react';

import { Option } from '../../types/Option';
type MultiSelectProps = {
  placeholder?: string;
  loadOptions: any;
  name: string;
  label: string;
  isRequired?: boolean;
  onChange?: (value: Option) => void;
};

const FieldSearchPage = ({
  loadOptions,
  name,
  isRequired = false,
  placeholder,
  label,
  onChange,
}: MultiSelectProps) => {
  return (
    <Field<Value<Option>>
      name={name}
      isRequired={isRequired}
      label={label}
      validate={(value) => (value ? undefined : 'Please select page')}>
      {({ fieldProps, error }: any) => (
        <Fragment>
          <AsyncSelect
            {...fieldProps}
            placeholder={placeholder}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={(value: Option) => {
              onChange(value);
              fieldProps.onChange(value);
            }}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Fragment>
      )}
    </Field>
  );
};

export default FieldSearchPage;
