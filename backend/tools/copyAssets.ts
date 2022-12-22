import * as shell from 'shelljs';

const assets = ['views', 'public', 'credentials.json'];

assets.forEach((a) => {
  // Copy all the view templates
  shell.cp('-R', a, 'dist/');
});
