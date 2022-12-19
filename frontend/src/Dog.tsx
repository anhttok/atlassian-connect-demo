import { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

declare let AP: any;
const DogPage = () => {
  useLayoutEffect(() => {
    AP.require('request', (request: any) => {
      request({
        url: '/dog',
        success(data: any) {
          console.log('data :>> ', data);
        },
      });
    });
  });
  return <div>DogPagasfasfase jhjh</div>;
};

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  ReactDOM.render(<DogPage />, wrapper);
});
