/*
 * @jest-environment jsdom
 */
import { BitWriter, encodeBoard } from './encode';

describe('BitWriter', () => {
  test('stores whole bytes', () => {
    const writer = new BitWriter();
    writer.writeBits(8, 67);
    writer.writeBits(8, 32);
    writer.writeBits(8, 51);

    expect(writer.arr.length).toBe(3);
    expect(writer.arr).toEqual([67, 32, 51]);
  });

  test('stores bits (ending on byte boundries)', () => {
    const writer = new BitWriter();
    writer.writeBits(4, 0xA);
    writer.writeBits(4, 0x4);
    writer.writeBits(4, 0x1);
    writer.writeBits(4, 0xF);
    writer.writeBits(4, 0x0);
    writer.writeBits(4, 0xB);

    expect(writer.arr.length).toBe(3);
    expect(writer.arr).toEqual([0xA4, 0x1F, 0x0B]);
  });

  test('stores bits (across byte boundries)', () => {
    const writer = new BitWriter();
    writer.writeBits(4, 0xA);
    writer.writeBits(8, 0x47);
    writer.writeBits(8, 0xA1);
    writer.writeBits(4, 0xB);

    expect(writer.arr.length).toBe(3);
    expect(writer.arr).toEqual([0xA4, 0x7A, 0x1B]);
  });

  test('pads unfinished bytes', () => {
    const writer = new BitWriter();
    writer.writeBits(1, 1);

    expect(writer.arr.length).toBe(1);
    // 0x80 = 0b1000_0000 = 128
    expect(writer.arr).toEqual([0x80]);
  });

  test('throws error if value cannot fit in given bits', () => {
    const writer = new BitWriter();
    // 30 cannot fit in 1 bit
    expect(() => writer.writeBits(1, 30)).toThrowError(RangeError);
  });

  // TODO I may want to change this behavior
  // It isn't ideal but it works for now
  test('throws error if writing more than a byte at once', () => {
    const writer = new BitWriter();
    // 30 cannot fit in 1 bit
    expect(() => writer.writeBits(9, 30)).toThrowError(RangeError);
  });
});

describe('encodeBoard', () => {
  test('starts with magic number', () => {
    const board: Array<[number, number]> = [[1,4], [5, 8], [30, 3]];
    const base64 = encodeBoard(board);
    const boardStr = atob(base64);

    expect(() => boardStr.startsWith('S!'));
  });

  test('has expected version string', () => {
    const board: Array<[number, number]> = [[1,4], [5, 8], [30, 3]];
    const base64 = encodeBoard(board);
    const boardStr = atob(base64);

    expect(boardStr.slice(2, 4)).toEqual('v1');
  });
});

