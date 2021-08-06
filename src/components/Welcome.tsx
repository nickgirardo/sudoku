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
  'player.html?play=UyF2MQDA3CMHMUwxxrEHJsUIqRZy7mHMmbI4R0jxHyQOhdKSZk7qHUkqJWa517MXZOzJoTUm7uWdM7N4z1n7wziHFeM0dpByTnOA',
  'TODO',
  'TODO',
  'TODO',
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
