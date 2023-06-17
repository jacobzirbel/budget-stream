import { JDependency } from "jazzapp";

export class SpreadsheetService implements JDependency {
  test() {
    console.log("SpreadsheetService.test()");
  }

  destroy?: (() => void) | undefined;
}