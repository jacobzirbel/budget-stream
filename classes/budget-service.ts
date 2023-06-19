import { JDependency } from "jazzapp";

export class BudgetService extends JDependency {
  test() {
    console.log("BudgetService.test()");
  }

  destroy?: (() => void) | undefined;
}