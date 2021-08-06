
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

// TODO describe this
// TODO this needs to be tested significantly
export class BitReader {
  raw: Uint8Array;
  readIndex: number = 0;

  constructor(raw: Uint8Array) {
    this.raw = raw;
  }

  reset() {
    this.readIndex = 0;
  }

  getBitsRemaining(): number {
    return (this.raw.length * 8) - this.readIndex;
  }
  hasBitsRemaining(count:number): boolean {
    const endingIndex = this.readIndex + count;
    return endingIndex <= this.raw.length * 8;
  }

  getBits(count: number): number {
    // Make sure we don't read beyond the array bounds
    const endingIndex = this.readIndex + count;
    if (endingIndex > this.raw.length * 8) {
      throw new Error('read to far');
    }

    let bitsRemaining = count;
    let result = 0;
    while (bitsRemaining > 0) {
      const currentByte = Math.floor(this.readIndex / 8);
      // How many bits can be read from the current byte?
      const bitsAvailable = 8 - (this.readIndex % 8);

      if (bitsRemaining <= bitsAvailable) {
        const diff = bitsAvailable - bitsRemaining;
        const mask = (2**bitsAvailable) - 1;
        const data = (this.raw[currentByte] & mask) >>> diff;

        result = (result << bitsRemaining) + data;
        break;
      } else {
        // bitsRemaining > bitsAvailable
        const mask = (2**bitsAvailable) - 1;
        const data = this.raw[currentByte] & mask;
        result = (result << bitsAvailable) + data;

        this.readIndex += bitsAvailable;
        bitsRemaining -= bitsAvailable;
      }
    }

    this.readIndex = endingIndex;
    return result;
  }
}
const decodeV1 = (param: string): (Array<[number, number]> | null) => {
  const raw = new Uint8Array(param.length);
  for (let i = 0; i < param.length; i++) {
    raw[i] = param.charCodeAt(i);
  }
  const reader = new BitReader(raw);
  const board: Array<[number, number]> = [];

  while(reader.hasBitsRemaining(11)) {
    board.push([reader.getBits(7), reader.getBits(4)]);
  }

  return board;
};

const versions = new Map([['v0', decodeV0], ['v1', decodeV1]]);

// Simple wrapper to have atob return null instead of throwing
const _atob = (param: string): (string | null) => {
  try {
    return atob(param);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const decodeBoard = (param: string): (Array<[number, number]> | null) => {
  // NOTE when getting query parameters, + is often replaced with a space character
  // For ergonomics, we will just change them all back here
  // This is easier then depending on the caller to handle this
  const byteString = _atob(param.replaceAll(' ', '+'));

  // If unable to parse the _atob wrapper will have already logged an error
  if (!byteString)
    return null;

  if (!byteString.startsWith(magic)) {
    console.error('The given level does not start with the magic string "S!". It may be corrupted');
    return null;
  }

  const givenVersion = byteString.slice(2, 4);
  const decoder = versions.get(givenVersion);
  if (!decoder) {
    console.error(`The given level does not have a recognized version.
Expected one of ${ Array.from(versions.keys()).join() }, received ${givenVersion}.`);
    return null;
  }

  // Now that we've finished checking the magic number and the version we can decode
  const boardString = byteString.slice(4);

  return decoder(boardString);
};

