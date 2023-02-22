import path from 'path';

export default (link, extension) => {
  const { protocol } = new URL(link);
  const linkWithoutPrAndExt = link
    .replace(`${protocol}//`, '')
    .replace(path.extname(link), '');

  const filename = linkWithoutPrAndExt
    .split('')
    .map((char) => {
      if (char.match(/\w/)) {
        return char;
      }
      return '-';
    })
    .join('');

  return `${filename}${extension}`;
};
