import Form from '@atlaskit/form';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import FieldSearch from '../../components/FieldSearch/FieldSearch';
import { Option } from '../../types/Option';
import './styles.scss';
type Props = {};
declare let AP: any;
const MultiExcerptIncludeEditor = (props: Props) => {
  const [macro, setMacro] = useState<any>();
  const [excerpts, setExcerpts] = useState<Option[]>([]);
  const mapPageToOption = (pages: any[]) => {
    const options: Option[] = (pages || []).map((page) => ({
      label: page.content.title,
      value: page.content.body.storage.value,
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
          const excerptOption: Option = {
            label: $parameter.textContent,
            value: structuredMacro.outerHTML,
          };
          excerpts.push(excerptOption);
        }
      }
    }
    setExcerpts(excerpts);
  };

  useEffect(() => {
    let cancelled = false;
    if (!cancelled && macro) {
      htmlStringToOptions(macro.value);
    }
    return () => {
      cancelled = true;
    };
  }, [macro]);
  useEffect(() => {
    // Store the form response

    const onDialogSubmit = (event: any) => {
      // AP.confluence.saveMacro({}, '<div>ok</div>');
      let pageId = 5046309;
      AP.context.getContext(function (response: any) {
        pageId = response.pageId;
      });

      console.log('pageId :>> ', pageId);
      const newKey = 'appkey_macro_' + new Date().getTime();
      const jsonData = {
        key: newKey,
        version: {
          number: 1,
        },
        value: {
          response_value: 'ok',
        },
      };
      AP.request({
        url: '/rest/api/content/' + pageId + '/property/' + newKey,
        type: 'PUT',
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        headers: {
          Accept: 'application/json',
        },
        success: function () {
          console.log('Stored the form submission!');
        },
        error: function () {
          console.log('Error storing the form submission!');
        },
      });
      AP.confluence.closeMacroEditor();
    };
    AP.dialog.disableCloseOnSubmit();
    AP.dialog.getButton('submit').bind(onDialogSubmit);
  }, []);
  const a = AP.confluence.getMacroBody(function (bodys: any) {
    // console.log('body', bodys);
    const body = `<p>asfgas</p>
<ac:image
  ac:align="center"
  ac:layout="center"
  ac:original-height="354"
  ac:original-width="1248"
  ><ri:attachment
    ri:filename="Screen Shot 2022-12-07 at 11.15.34.png"
    ri:version-at-save="1" /></ac:image
><ac:image
  ac:align="center"
  ac:layout="center"
  ac:original-height="720"
  ac:original-width="1280"
  ><ri:attachment
    ri:filename="big_buck_bunny_720p_1mb.mp4"
    ri:version-at-save="1"
/></ac:image>
<p />
`;
    const convertStorageToHtml = async (contentAsStorage: string) => {
      const convertResponse = await AP.request({
        url: '/rest/api/contentbody/convert/styled_view?expand=webresource.superbatch.uris.css',
        type: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Atlassian-Token': 'nocheck',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          value: contentAsStorage,
          representation: 'storage',
        }),
      });
      console.log('convertResponse', convertResponse);
      return JSON.parse(convertResponse.body);
    };

    convertStorageToHtml(body).then((converted) => {
      console.log('macroBody', converted.value);
      console.log('superBatchUri', converted.webresource.superbatch.uris.css); // You must load this css file to style your content
    });
  });

  return (
    <div className={'MultiExcerptIncludeEditor'}>
      <div className="formFindExcerpts">
        <Form
          onSubmit={(data: any) => {
            console.log('form data', data);
          }}>
          {({ formProps, submitting }: any) => (
            <form {...formProps}>
              <FieldSearch
                isRequired
                loadOptions={getSearchPageWithName}
                name="page"
                label="Page"
                onChange={(value) => setMacro(value)}
              />
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default MultiExcerptIncludeEditor;
