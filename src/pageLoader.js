import axios from 'axios';
import * as fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import formatFilename from './formatFilename.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (link, outputDir = __dirname) => {
  const outputFile = formatFilename(link);
  const outputPath = path.join(outputDir, outputFile);

  const { data } = await axios.get(link)
    .catch(() => {
      throw new Error('This page doesn\'t exist.');
    });

  await fsp.writeFile(outputPath, data)
    .catch(() => {
      throw new Error('Download fail: specified directory doesn\'t exist.');
    });

  return { filepath: outputPath };
};
