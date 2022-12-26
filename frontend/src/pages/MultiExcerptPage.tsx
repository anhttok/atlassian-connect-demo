import { createRoot } from 'react-dom/client';
import MultiExcerpt from '../modules/MultiExcerpt';

window.addEventListener('load', () => {
  const container = document.getElementById('multiExcerpt');
  const root = createRoot(container!);
  return root.render(<MultiExcerpt />);
});
