import * as fs from 'fs';
import * as fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import pageLoader from '../src/pageLoader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixtureFilepath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename, encoding = 'utf-8') => fsp.readFile(getFixtureFilepath(filename), encoding);
const readWrittenFile = (filepath, encoding = 'utf-8') => fsp.readFile(filepath, encoding);

const domain = 'https://ru.hexlet.io';
const htmlPage = {
  path: '/courses',
  url: `${domain}/courses`,
  replyFixtureName: 'pageData.html',
  expectedFilename: 'ru-hexlet-io-courses.html',
  expectedDataFixture: 'expectedData.html',
};
const requestPathesToSources = ['/assets/professions/nodejs.png', '/assets/application.css', '/packs/js/runtime.js'];
const fixtureFilenames = ['nodejs-image.png', 'style.css', 'script.js'];
const expectedFilenames = [
  'ru-hexlet-io-assets-professions-nodejs.png',
  'ru-hexlet-io-assets-application.css',
  'ru-hexlet-io-packs-js-runtime.js',
];
const expectedDirname = 'ru-hexlet-io-courses_files';
const sourcesData = fixtureFilenames.map((fixtureFilename, inx) => ({
  requestPath: requestPathesToSources[inx],
  fixtureFilename,
  dataType: path.extname(fixtureFilename) === 'png' ? 'binary' : 'utf-8',
  expectedFilename: expectedFilenames[inx],
}));
let scope;
let tempdir;

beforeAll(async () => {
  nock.disableNetConnect();

  scope = nock(domain)
    .persist()
    .get(htmlPage.path)
    .reply(200, await readFixtureFile(htmlPage.replyFixtureName));

  await Promise.all(sourcesData.map(async ({ requestPath, fixtureFilename, dataType }) => {
    scope
      .get(requestPath)
      .reply(200, await readFixtureFile(fixtureFilename, dataType));
  }));

  htmlPage.expectedData = await readFixtureFile(htmlPage.expectedDataFixture);
});

afterAll(() => {
  nock.cleanAll();
});

beforeEach(() => {
  tempdir = fs.mkdtempSync(path.join(tmpdir(), 'page-loader-'));
});

describe('succesful downloads', () => {
  test('specified dir', async () => {
    const { filepath } = await pageLoader(htmlPage.url, tempdir);

    const actualData = await readWrittenFile(filepath);

    expect(actualData).toBe(htmlPage.expectedData);
  });

  test('do not specify dir', async () => {
    process.chdir(tempdir);

    const { filepath } = await pageLoader(htmlPage.url);

    const actualData = await readWrittenFile(filepath);

    expect(actualData).toBe(htmlPage.expectedData);
  });

  test.each(sourcesData)('check written data in $expectedFilename', async ({
    fixtureFilename, dataType, expectedFilename,
  }) => {
    const fixtureData = await readFixtureFile(fixtureFilename, dataType);

    await pageLoader(htmlPage.url, tempdir);

    const actualData = await readWrittenFile(
      path.join(tempdir, expectedDirname, expectedFilename),
      dataType,
    );
    expect(actualData).toBe(fixtureData);
  });
});

describe('not successdul download', () => {
  test('nonexist page', async () => {
    const nonexistPage = '/somePath';
    scope
      .get(nonexistPage)
      .reply(404, null);

    const url = `${domain}${nonexistPage}`;
    await expect(pageLoader(url, tempdir)).rejects.toThrow('Request failed with status code 404');
  });

  test('nonexist dir', async () => {
    await expect(pageLoader(htmlPage.url, '/someDir')).rejects.toThrow('ENOENT: no such file or directory');
  });

  test('try write into exist file', async () => {
    const filepath = path.join(tempdir, 'someFile.txt');
    await fsp.writeFile(filepath, '');

    await expect(pageLoader(htmlPage.url, filepath)).rejects.toThrow('ENOTDIR: not a directory');
  });
});
