import { createRoot } from 'react-dom/client';
import MultiExcerptInclude from '../modules/MultiExcerptInclude';

window.addEventListener('load', () => {
  const container = document.getElementById('multiExcerptInclude');
  console.log('container', container)
  const root = createRoot(container!);
  return root.render(<MultiExcerptInclude/>);
});
