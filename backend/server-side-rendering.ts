import express from 'express';
import path from 'path';

export function addServerSideRendering(app: any, handlebarsEngine: any) {
  const viewsDir = path.join(__dirname, '..', 'views');
  console.log('viewsDir', viewsDir);
  app.use(express.static(viewsDir));
}
