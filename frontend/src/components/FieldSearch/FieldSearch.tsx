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
  onChange?:(value:Option)=>void
};

const FieldSearch = ({
  loadOptions,
  name,
  isRequired = false,
  placeholder,
  label,
  onChange,
}: MultiSelectProps) => {
  return (
    <Field<Value<Option, false>> name={name} isRequired={isRequired} label={label}>
      {({ fieldProps, error }: any) => (
        <Fragment>
          <AsyncSelect
            {...fieldProps}
            placeholder={placeholder}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={onChange}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Fragment>
      )}
    </Field>
  );
};

export default FieldSearch;
