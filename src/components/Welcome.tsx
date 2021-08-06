import { relativeToAbsolute } from '../util';

interface LinkProps {
  link: string,
}

const ExampleLink = ({ link }: LinkProps) => (
  <a className='example' href={ link } target='_blank'>
    { relativeToAbsolute(link) }
  </a>
);

// TODO example puzzles
const examplePuzzles = [
  'player.html?play=UyF2MQRhyECJQWIySCkiKoXU+yAUcJiTwoVTKoVqsHYm5V3D54DxCitHWQclJ0g=',
  'player.html?play=UyF2MQxjGHGQQnBVC0mBNEdc8R9UDJFTIqhYLCGIskZk2RwTpnYvZgTCOIUpQA==',
  'player.html?play=UyF2MQSgzDMHgSYqBcjBJOaM/CA0TpVTEqNWi52DMSbK+GIUWYyx0knKeaM6AA==',
  'player.html?play=UyF2MQShGEsOUehCCploMyaY3BxDzISSsrde7KGjNUbC3N0rt4DwShDHiZM4QA==',
];

export const Welcome = () => (
  <div className="welcome">
    <h2>Sudoku Player</h2>
    <p>
      A sudoku player where all of the puzzles are defined by the query string.
      This is just a static page; no database is required to store the puzzles.
    </p>
    <p>
      Here are some example puzzles:
    </p>
    <ul>
      {
        examplePuzzles.map(ex => <li><ExampleLink key={ ex } link={ ex } /></li>)
      }
    </ul>
    <p>
      You can build your own puzzles&nbsp;
        <a href={ relativeToAbsolute('builder.html') } target='_blank'>here</a>.
      Click "share" to get a link to your puzzle which you can share with your friends.
    </p>
  </div>
);
