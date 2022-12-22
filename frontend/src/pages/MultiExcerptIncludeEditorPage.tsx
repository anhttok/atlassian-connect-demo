import { createRoot } from 'react-dom/client';
import MultiExcerptIncludeEditor from '../modules/MultiExcerptIncludeEditor';
window.addEventListener('load', () => {
  const container = document.getElementById('multiExcerptIncludeEditor');
  const root = createRoot(container!);
  return root.render(<MultiExcerptIncludeEditor />);
});
