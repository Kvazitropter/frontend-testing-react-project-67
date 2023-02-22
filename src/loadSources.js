import path from 'path';
import * as fsp from 'fs/promises';
import axios from 'axios';
import * as cheerio from 'cheerio';
import formatName from './formatName';

export default async (htmlData, outputDirpath, htmlUrlOrigin) => {
  const $ = cheerio.load(htmlData);
  const images = $('img').toArray();
  const links = $('link').toArray();
  const scripts = $('script').toArray();

  const load = (sources, attrib, responseType = 'json') => sources.map(async (elem) => {
    const sourcePath = $(elem).attr(attrib);
    const url = new URL(sourcePath, htmlUrlOrigin);

    if (url.origin !== htmlUrlOrigin) {
      return;
    }

    const extension = path.extname(sourcePath) || '.html';
    const filename = formatName(url.toString(), extension);
    const filepath = path.join(outputDirpath, filename);
    const shortFilepath = path.join(path.basename(outputDirpath), filename);

    try {
      const { data } = await axios.get(url, { responseType });
      await fsp.writeFile(filepath, data);
      $(elem).attr(attrib, shortFilepath);
    } catch (e) {
      throw new Error(e.message);
    }
  });

  await Promise.all(load(images, 'src', 'arraybuffer'));
  await Promise.all(load(links, 'href'));
  await Promise.all(load(scripts, 'src'));

  return $.root().html();
};
