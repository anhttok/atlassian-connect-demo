import { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { getDog } from './services/dog.services';

const DogPage = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const a = async () => {
    const res = await getDog();
    setImageUrl(res.data.imageUrl || '');
  };
  useLayoutEffect(() => {
    a();
  }, []);
  console.log('imageUrl :>> ', imageUrl);
  return (
    <div>
      <img
        src={imageUrl}
        alt='Dog'
      />
    </div>
  );
};

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  return ReactDOM.render(<DogPage />, wrapper);
});
