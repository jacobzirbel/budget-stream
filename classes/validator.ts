import { JDependency } from "jazzapp";

export class Validator implements JDependency {
  test() {
    console.log("Validator.test()");
  }

  destroy?: (() => void) | undefined;
}