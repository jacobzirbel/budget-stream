import { JDependency } from "jazzapp";

export class InputController implements JDependency {
  test() {
    console.log("InputController.test()");
  }

  destroy?: (() => void) | undefined;
}