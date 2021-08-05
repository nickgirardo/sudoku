/*
 * @jest-environment jsdom
 */
import { BitReader } from './decode';

describe('BitReader', () => {
  describe('basic reading behavior', () => {
    test('reads whole bytes', () => {
      const data = [0xFA, 0xFC];
      const reader = new BitReader(new Uint8Array(data));
      
      const result = [reader.getBits(8), reader.getBits(8)];

      expect(result).toEqual(data);
    });

    test('reads bits (ending on byte boundries)', () => {
      const data = [0xFA, 0xF9];
      const reader = new BitReader(new Uint8Array(data));

      const expected = [
        0xF,
        0xA,
        0b1111_10,
        0b01,
      ];
      
      let result = [
        reader.getBits(4),
        reader.getBits(4),
        reader.getBits(6),
        reader.getBits(2),
      ];

      expect(result).toEqual(expected);
    });

    test('reads bits (across byte boundries)', () => {
      const data = [0xFA, 0xF9, 0xCC];
      const reader = new BitReader(new Uint8Array(data));

      // Underscores here every 4 bits
      const expected = [
        0b1111_10,
        0b10_1111,
        0b1001_1,
      ];
      
      let result = [
        reader.getBits(6),
        reader.getBits(6),
        reader.getBits(5),
      ];

      expect(result).toEqual(expected);
    });

    test('throws an error if read past the end of the buffer', () => {
      {
        const reader = new BitReader(new Uint8Array([]));
        expect(() => reader.getBits(1)).toThrow();
      }

      {
        const reader = new BitReader(new Uint8Array([0, 1]));
        // We've got two bytes in the buffer
        expect(() => reader.getBits(8)).not.toThrow();
        expect(() => reader.getBits(8)).not.toThrow();

        // Our buffer is out now of data
        expect(() => reader.getBits(8)).toThrow();
      }
    });
  });

  describe('hasBitsRemaining', () => {
    test('an empty buffer has no bits remaining', () => {
      const reader = new BitReader(new Uint8Array([]));

      expect(reader.hasBitsRemaining(1)).toEqual(false);
      expect(reader.hasBitsRemaining(0)).toEqual(true);
    });

    test('bits remaining decreases as values are read', () => {
      const reader = new BitReader(new Uint8Array([1, 2, 3]));

      expect(reader.hasBitsRemaining(24)).toEqual(true);

      reader.getBits(8);
      expect(reader.hasBitsRemaining(24)).toEqual(false);
      expect(reader.hasBitsRemaining(16)).toEqual(true);

      reader.getBits(8);
      expect(reader.hasBitsRemaining(16)).toEqual(false);
      expect(reader.hasBitsRemaining(8)).toEqual(true);

      reader.getBits(8);
      expect(reader.hasBitsRemaining(8)).toEqual(false);
      expect(reader.hasBitsRemaining(0)).toEqual(true);
    });

    test('can read until exhausted', () => {
      const expected = [0, 1, 2, 3, 4, 5, 6, 7];
      const reader = new BitReader(new Uint8Array([0x01, 0x23, 0x45, 0x67]));

      let result = [];

      while (reader.hasBitsRemaining(4))
        result.push(reader.getBits(4));

      expect(result).toEqual(expected);
    });
  });

  describe('getBitsRemaining', () => {
    test('an empty buffer has no bits remaining', () => {
      const reader = new BitReader(new Uint8Array([]));

      expect(reader.getBitsRemaining()).toEqual(0);
    });

    test('bits remaining decreases as values are read', () => {
      const reader = new BitReader(new Uint8Array([1, 2, 3]));

      expect(reader.getBitsRemaining()).toEqual(24);

      reader.getBits(8);
      expect(reader.getBitsRemaining()).toEqual(16);

      reader.getBits(8);
      expect(reader.getBitsRemaining()).toEqual(8);

      reader.getBits(8);
      expect(reader.getBitsRemaining()).toEqual(0);
    });
  });

  describe('reset', () => {
    test('returns to the start of the buffer', () => {
      const reader = new BitReader(new Uint8Array([1, 2, 3]));

      const firstReads = [reader.getBits(8), reader.getBits(8)];
      reader.reset();
      const secondReads = [reader.getBits(8), reader.getBits(8)];

      expect(firstReads).toEqual(secondReads);
    });

    test('getBitsRemaining is updated', () => {
      const reader = new BitReader(new Uint8Array([1, 2, 3]));

      expect(reader.getBitsRemaining()).toEqual(24);

      reader.getBits(8);
      expect(reader.getBitsRemaining()).toEqual(16);

      reader.reset();
      expect(reader.getBitsRemaining()).toEqual(24);
    });

    test('hasBitsRemaining is updated', () => {
      const reader = new BitReader(new Uint8Array([1, 2, 3]));

      expect(reader.hasBitsRemaining(24)).toEqual(true);
      expect(reader.hasBitsRemaining(25)).toEqual(false);

      reader.getBits(8);
      expect(reader.hasBitsRemaining(24)).toEqual(false);

      reader.reset();
      expect(reader.hasBitsRemaining(24)).toEqual(true);
    });
  });
});

