import Form, { ErrorMessage, Field } from '@atlaskit/form';
import Select, { ValueType as Value } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import debounce from 'lodash/debounce';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import FieldSearchPage from '../../components/FieldSearchPage/FieldSearchPage';
import { excerptHtmlToOptions, mapPageToOption } from '../../helpers';
import { Option } from '../../types/Option';
import './styles.scss';
type Props = {};
type FormSubmitMacroIdPageId = {
  excerpt: Option;
  pageId: string;
  page: Option;
};
type DefaultFormValueType = {
  page: Option;
  excerpt: Option;
};
declare let AP: any;
const MultiExcerptIncludeEditor = (props: Props) => {
  const [page, setPage] = useState<Option>();
  const [excerpts, setExcerpts] = useState<Option[]>([]);
  const [defaultFormValue, setDefaultFormValues] = useState<DefaultFormValueType>();
  const btnSubmitRef = useRef(null);

  const getSearchPageWithName = debounce((name: string, callback: any) => {
    const cql = `title~%22${name}~%22%20OR%20title~%22${name}~%22%20OR%20title~%22${name}~%22%20AND%20(type=page%20OR%20type=blogpost)&expand=content.body.storage,content.body.styled_view`;
    AP.request(`/rest/api/search?cql=${cql}`)
      .then((data: any) => {
        const pages = JSON.parse(data.body).results || [];
        callback(mapPageToOption(pages));
      })
      .catch((e: any) => console.log(e.err));
  }, 500);

  useEffect(() => {
    let cancelled = false;
    if (!cancelled && page) {
      const pageBody = JSON.parse(page.value);
      const excerpts = excerptHtmlToOptions(pageBody.body);
      setExcerpts(excerpts);
    }

    return () => {
      cancelled = true;
    };
  }, [page]);
  useEffect(() => {
    const onDialogSubmit = () => {
      btnSubmitRef && btnSubmitRef.current.click();
    };
    AP.dialog.disableCloseOnSubmit();
    AP.dialog.getButton('submit').bind(onDialogSubmit);
  }, []);
  useEffect(() => {
    AP.confluence.getMacroData(function (data: any) {
      console.log('data', data);
      // if (data) {
      //   const defaultValue = { page: data.pageOption, excerpt: data.excerptOption };
      //   setDefaultFormValues(defaultValue);
      // }
    });
  }, [AP]);

  const onSubmit = useCallback((data: FormSubmitMacroIdPageId) => {
    console.log('data', data);
    const pageId = data.pageId;
    const macroId = data.excerpt.value;
    AP.confluence.saveMacro({
      pageOption: data.page,
      excerptOption: data.excerpt,
      pageId,
      macroId,
    });
    AP.confluence.closeMacroEditor();
  }, []);
  const pageId = page ? JSON.parse(page.value).id : '';
  console.log('defaultFormValue :>> ', defaultFormValue);
  return (
    <div className={'MultiExcerptIncludeEditor'}>
      <div className="formFindExcerpts">
        <Form onSubmit={onSubmit}>
          {({ formProps }: any) => (
            <form {...formProps} className="pageMacroForm">
              <Field name="pageId" defaultValue={pageId}>
                {({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} hidden />}
              </Field>
              <FieldSearchPage
                isRequired
                defaultValue={defaultFormValue?.page}
                loadOptions={getSearchPageWithName}
                name="page"
                label="Page"
                onChange={(value) => setPage(value)}
              />
              <Field<Value<Option>>
                name={'excerpt'}
                isRequired={true}
                label={'Excerpt'}
                defaultValue={defaultFormValue?.excerpt}
                validate={(value) => (value ? undefined : 'Please select excerpt')}>
                {({ fieldProps, error }) => (
                  <Fragment>
                    <Select {...fieldProps} options={excerpts} placeholder={'Select excerpt'} />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
              <button hidden ref={btnSubmitRef} type="submit"></button>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default MultiExcerptIncludeEditor;
