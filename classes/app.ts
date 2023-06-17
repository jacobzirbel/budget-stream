import { JApp } from "jazzapp";
import { BudgetService } from "./budget-service";
import { ConsoleInput } from "./console-input";
import { GoogleAuthenticator } from "./google-authenticator";
import { InputController } from "./input-controller";
import { SpreadsheetService } from "./spreadsheet-service";
import { Validator } from "./validator";

export class App extends JApp {
  constructor() {
    super();
    this.extendedDependencies = [
      { class: BudgetService },
      { class: ConsoleInput },
      { class: GoogleAuthenticator },
      { class: InputController },
      { class: SpreadsheetService },
      { class: Validator },
    ]

    this.registerDependencies(this.extendedDependencies);
  }
}