import axios from 'axios';
import * as fsp from 'fs/promises';
import path from 'path';
import formatName from './formatName.js';
import loadSources from './loadSources.js';

export default async (link, outputDirpath = process.cwd()) => {
  const htmlFilename = formatName(link, '.html');
  const htmlFilepath = path.join(outputDirpath, htmlFilename);
  const sourcesDirname = formatName(link, '_files');
  const sourcesDirpath = path.join(outputDirpath, sourcesDirname);
  const { origin } = new URL(link);

  try {
    const { data } = await axios.get(link);
    await fsp.mkdir(sourcesDirpath);
    const newHtmlData = await loadSources(data, sourcesDirpath, origin);
    await fsp.writeFile(htmlFilepath, newHtmlData);
  } catch (e) {
    throw new Error(e.message);
  }

  return { filepath: htmlFilepath };
};
