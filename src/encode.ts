

// TODO describe this
// TODO this needs to be tested significantly
export class BitWriter {
  arr: Array<number> = [];
  writeBit: number = 0;

  writeBits(bitsRemaining: number, value: number) {
    if (bitsRemaining > 8) {
      throw new RangeError(`For now, the number of bits must be at most 8.  You gave ${bitsRemaining}.`);
    }

    if (2**bitsRemaining <= value) {
      throw new RangeError(`The given value is too large.
It must be between 0 and 2^${bitsRemaining} (the first argument) - 1.
In this case, that is 0..${(2**bitsRemaining) - 1}.  You gave ${value}.`);
    }

    if (this.writeBit === 0)
      this.arr.push(0);

    const bitsAvailable = 8 - this.writeBit;

    if (bitsRemaining <= bitsAvailable) {
      const diff = bitsAvailable - bitsRemaining;
      const shifted = value << diff;
      this.arr[this.arr.length-1] += shifted;
      this.writeBit = (this.writeBit + bitsRemaining) % 8;
      return;
    }

    // bitsRemaining > bitsAvailable
    const diff = bitsRemaining - bitsAvailable;

    const mask = (2**diff) - 1;
    const remainder = value & mask;

    const shifted = value >>> diff;
    this.arr[this.arr.length-1] += shifted;
    this.writeBit = 0;
    this.writeBits(diff, remainder);
  }
}

const magic = 'S!';
const version = 'v1';

export const encodeBoard = (board: Array<[number, number]>): string => {
  const writer = new BitWriter();

  for (const [cell, value] of board) {
    // Write 7 bits as the maximum value here is 81
    // the binary log of which is within 7...8
    writer.writeBits(7, cell);
    // Write 4 bits as the maximum value here is 9
    // the binary log of which is within 3...4
    writer.writeBits(4, value);
  }

  const uint8arr = new Uint8Array(writer.arr);

  // String starts with magic number for sanity check and version for backwards compat
  let str = `${magic}${version}`;
  for (const u8 of uint8arr)
    str += String.fromCharCode(u8);

  return btoa(str);
}
