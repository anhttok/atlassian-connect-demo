import Form, { ErrorMessage, Field } from '@atlaskit/form';
import Select, { ValueType as Value } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import debounce from 'lodash/debounce';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import FieldSearchPage from '../../components/FieldSearchPage/FieldSearchPage';
import { Option } from '../../types/Option';
import './styles.scss';
type Props = {};
type FormSubmitMacroIdPageId = {
  excerpt: Option;
  pageId: string;
  page: Option;
};
declare let AP: any;
const MultiExcerptIncludeEditor = (props: Props) => {
  const [page, setPage] = useState<Option>();
  const [excerpts, setExcerpts] = useState<Option[]>([]);

  const btnSubmitRef = useRef(null);
  const mapPageToOption = (pages: any[]) => {
    const options: Option[] = (pages || []).map((page) => ({
      label: page.content.title,
      value: JSON.stringify({ id: page.content.id, body: page.content.body.storage.value }),
    }));
    return options;
  };
  const getSearchPageWithName = debounce((name: string, callback: any) => {
    const cql = `title~%22${name}~%22%20OR%20title~%22${name}~%22%20OR%20title~%22${name}~%22%20AND%20(type=page%20OR%20type=blogpost)&expand=content.body.storage,content.body.styled_view`;
    AP.request(`/rest/api/search?cql=${cql}`)
      .then((data: any) => {
        const pages = JSON.parse(data.body).results || [];
        callback(mapPageToOption(pages));
      })
      .catch((e: any) => console.log(e.err));
  }, 500);

  const stringToHTML = function (str: string) {
    const dom = document.createElement('div');
    dom.innerHTML = str;
    return dom;
  };
  const htmlStringToOptions = (htmlString: string) => {
    if (!htmlString) {
      return;
    }
    const dom = stringToHTML(htmlString);
    const excerpts = [];
    const structuredMacros = dom.getElementsByTagName('ac:structured-macro');
    for (const structuredMacro of structuredMacros) {
      const attrNameMultiExcerpt = structuredMacro.getAttribute('ac:name');
      if (attrNameMultiExcerpt === 'multi-excerpt-dynamic-content') {
        const $parameter = structuredMacro.getElementsByTagName('ac:parameter')[0];
        const attrName = $parameter.getAttribute('ac:name');
        if (attrName === 'name') {
          const macroId = structuredMacro.getAttribute('ac:macro-id');
          const excerptOption: Option = {
            label: $parameter.textContent,
            value: macroId,
          };
          excerpts.push(excerptOption);
        }
      }
    }
    setExcerpts(excerpts);
  };

  useEffect(() => {
    let cancelled = false;
    if (!cancelled && page) {
      const pageBody = JSON.parse(page.value);
      htmlStringToOptions(pageBody.body);
    }
    return () => {
      cancelled = true;
    };
  }, [page]);
  useEffect(() => {
    // Store the form response
    const onDialogSubmit = () => {
      btnSubmitRef && btnSubmitRef.current.click();
    };
    AP.dialog.disableCloseOnSubmit();
    AP.dialog.getButton('submit').bind(onDialogSubmit);
  }, []);
  AP.confluence.getMacroData(function (body: any) {
    console.log('body', body);
  });
  const onSubmit = useCallback((data: FormSubmitMacroIdPageId) => {
    console.log('data', data);
    const pageId = data.pageId;
    const macroId = data.excerpt.value;
    AP.confluence.saveMacro({
      pageId,
      macroId,
    });
    AP.confluence.closeMacroEditor();
  }, []);
  const pageId = page ? JSON.parse(page.value).id : '';
  console.log('pageId', pageId);
  return (
    <div className={'MultiExcerptIncludeEditor'}>
      <div className="formFindExcerpts">
        <Form onSubmit={onSubmit}>
          {({ formProps, submitting }: any) => (
            <form {...formProps} className="pageMacroForm">
              <Field name="pageId" defaultValue={pageId}>
                {({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} hidden />}
              </Field>
              <FieldSearchPage
                isRequired
                loadOptions={getSearchPageWithName}
                name="page"
                label="Page"
                onChange={(value) => setPage(value)}
              />
              <Field<Value<Option>>
                name={'excerpt'}
                isRequired={true}
                label={'Excerpt'}
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
