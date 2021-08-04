

const magic = 'S!';
const version = 'v0';

export const encodeBoard = (board: Array<[number, number]>): string => {
  const uint8arr = new Uint8Array(board.length * 2);
  for (let i = 0; i< board.length; i++) {
    uint8arr[i*2] = board[i][0];
    uint8arr[(i*2)+1] = board[i][1];
  }

  // String starts with magic number for sanity check and version for backwards compat
  let str = `${magic}${version}`;
  for (const u8 of uint8arr)
    str += String.fromCharCode(u8);

  return btoa(str);
}
