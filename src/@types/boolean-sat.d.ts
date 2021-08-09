declare module 'boolean-sat' {
  // Note that as the first variable (0) is unused (it cannot be negated)
  // so the first element in the array is always null
  export type SATSolution = Array<boolean | null>;

  // Returns a solution
  // Returns false if unsatisfyable
  function satSolve(
    size: number,
    clauses: Array<Array<number>>
  ): (SATSolution | false);

  export = satSolve;
}
