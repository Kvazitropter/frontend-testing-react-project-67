import axios from 'axios';
import * as fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import 'axios-debug-log';
import debug from 'debug';
import formatName from './formatName.js';

const log = debug('page-loader');

const loadSources = async (htmlData, outputDirpath, htmlUrlOrigin) => {
  const $ = cheerio.load(htmlData);
  const images = $('img').toArray();
  const links = $('link').toArray();
  const scripts = $('script').toArray();

  const load = (sources, attrib, responseType = 'json', ext = '') => sources.map(async (elem) => {
    const sourcePath = $(elem).attr(attrib);
    const url = new URL(sourcePath, htmlUrlOrigin);

    if (url.origin !== htmlUrlOrigin || !sourcePath) {
      return;
    }

    const extension = ext || path.extname(sourcePath) || '.html';
    const filename = formatName(url.toString(), extension);
    const filepath = path.join(outputDirpath, filename);
    const shortFilepath = path.join(path.basename(outputDirpath), filename);

    try {
      const { data } = await axios.get(url, { responseType });
      await fsp.writeFile(filepath, data);
      $(elem).attr(attrib, shortFilepath);
      log(`Item was successfuly loaded from ${url.toString()}`);
    } catch {
      log(`Failed to load from source: ${url.toString()}`);
    }
  });

  await Promise.all(load(images, 'src', 'arraybuffer', '.png'));
  await Promise.all(load(links, 'href'));
  await Promise.all(load(scripts, 'src'));

  return $.root().html();
};

export default async (link, outputDirpath = process.cwd()) => {
  log(`Loading page ${link} to ${outputDirpath}`);
  await fsp.access(outputDirpath);
  log('Output directory exists');
  const htmlFilename = formatName(link, '.html');
  const htmlFilepath = path.join(outputDirpath, htmlFilename);
  const sourcesDirname = formatName(link, '_files');
  const sourcesDirpath = path.join(outputDirpath, sourcesDirname);
  const { origin } = new URL(link);

  try {
    const { data } = await axios.get(link);
    log('Successfully got data from source');
    await fsp.mkdir(sourcesDirpath, { recursive: true });
    log(`Directory ${sourcesDirname} was successfully created or exists`);
    const newHtmlData = await loadSources(data, sourcesDirpath, origin);
    log('Data was loaded to local directory from sources');
    await fsp.writeFile(htmlFilepath, newHtmlData);
    log('Html data was successfuly loaded');
  } catch (e) {
    throw new Error(e.message);
  }

  return { filepath: htmlFilepath };
};
