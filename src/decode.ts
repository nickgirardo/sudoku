
const magic = 'S!';

const decodeV0 = (param: string): (Array<[number, number]> | null) => {
  const rawArr = new Uint8Array(param.length);
  for (let i = 0; i < param.length; i++) {
    rawArr[i] = param.charCodeAt(i);
  }

  const decodedBoard: [number, number][] = [];
  for (let i = 0; i < rawArr.length; i += 2)
    decodedBoard.push([rawArr[i], rawArr[i+1]]);

  return decodedBoard;
};

const versions = new Map([['v0', decodeV0]]);

export const decodeBoard = (param: string): (Array<[number, number]> | null) => {
  const byteString = atob(param);
  if (!byteString.startsWith(magic)) {
    console.error('The given level does not start with the magic string "S!". It may be corrupted');
    return null;
  }

  const givenVersion = byteString.slice(2, 4);
  if (!Array.from(versions.keys()).includes(givenVersion)) {
    console.error(`The given level does not have a recognized version.
Expected one of ${ Array.from(versions.keys()).join() }, received ${givenVersion}.`);
    return null;
  }

  // Now that we've finished checking the magic number and the version we can decode
  const boardString = byteString.slice(4);

  const decoder = versions.get(givenVersion);
  if (!decoder) {
    console.error(`Unable to find relevant decoder.  This error should not occur.`);
    return null;
  }

  return decoder(boardString);
};

