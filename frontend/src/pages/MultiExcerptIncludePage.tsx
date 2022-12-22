import { createRoot } from 'react-dom/client';
import MultiExcerptInclude from '../modules/MultiExcerptInclude';

window.addEventListener('load', () => {
  const container = document.getElementById('multiExcerptIncludeView');
  const root = createRoot(container!);
  return root.render(<MultiExcerptInclude/>);
});
