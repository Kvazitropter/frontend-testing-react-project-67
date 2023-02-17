import * as fs from 'fs';
import path from 'path';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import pageLoader from '../src/pageLoader';

nock.disableNetConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFilepath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filepath) => fs.readFileSync(filepath, 'utf-8');

const fixtureFile = getFilepath('expectedHtmlData');
const expectedData = readFile(fixtureFile);
const domain = 'https://ru.hexlet.io';
const path2 = '/pages';
const path1 = `${path2}/about`;
const url = `${domain}${path1}`;
let tempdir;

beforeAll(() => {
  nock(domain)
    .get(path1)
    .reply(200, expectedData)
    .get(path2)
    .reply(404, null);
});

beforeEach(() => {
  tempdir = fs.mkdtempSync(path.join(tmpdir(), 'page-loader-'));
});

test('load to current dir', async () => {
  const expectedFilename = 'ru-hexlet-io-pages-about.html';
  const expectedFilepath = path.join(tempdir, expectedFilename);

  const { filepath } = await pageLoader(url, tempdir);
  const tempdirContains = fs.readdirSync(tempdir);
  const actualData = readFile(filepath);

  expect(filepath).toBe(expectedFilepath);
  expect(tempdirContains).toContain(expectedFilename);
  expect(actualData).toBe(expectedData);
});
