import { Option } from './types/Option';

export const mapPageToOption = (pages: any[]) => {
  const options: Option[] = (pages || []).map((page) => ({
    label: page.content.title,
    value: JSON.stringify({ id: page.content.id, body: page.content.body.storage.value }),
  }));
  return options;
};
const stringToHTML = function (str: string) {
  const dom = document.createElement('div');
  dom.innerHTML = str;
  return dom;
};
export const excerptHtmlToOptions = (htmlString: string) => {
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
  return excerpts;
};
