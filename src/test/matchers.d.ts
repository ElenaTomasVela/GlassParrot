interface ApproxMatchers {
  /**
   * Test if a number is approximately equal to another within a given tolerance.
   *
   * @param epsilon The maximum difference between actual and expected,
   **/
  toBeApprox(expected: number, epsilon: number): void;
}

declare module "bun:test" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Matchers<number> extends ApproxMatchers {}
}
