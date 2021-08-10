declare module 'boolean-sat' {
  // Note that as the first variable (0) is unused (it cannot be negated)
  // so the first element in the array is always null
  export type SATSolution = [null, ...boolean[]];

  // Returns a solution if satisfiable or false if unsatisfiable
  function satSolve(
    size: number,
    clauses: Array<Array<number>>
  ): (SATSolution | false);

  export = satSolve;
}
