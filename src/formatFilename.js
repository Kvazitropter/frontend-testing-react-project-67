export default (link) => {
  const urlObj = new URL(link);
  const linkWithoutProtocol = link.replace(`${urlObj.protocol}//`, '');
  const filename = linkWithoutProtocol
    .split('')
    .map((char) => {
      if (char.match(/\w/)) {
        return char;
      }
      return '-';
    })
    .join('');

  return `${filename}.html`;
};
