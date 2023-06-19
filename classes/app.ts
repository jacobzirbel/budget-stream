import { BASE_INIT_ARGS, JApp } from "jazzapp";
import { BudgetService } from "./budget-service";
import { ConsoleInput } from "./console-input";
import { GoogleAuthenticator } from "./google-authenticator";
import { InputController } from "./input-controller";
import { SpreadsheetService } from "./spreadsheet-service";
import { Validator } from "./validator";

export class App extends JApp {
  constructor(isTesting: boolean) {
    super();
    const baseArgs: BASE_INIT_ARGS = {
      isTesting
    }
    this.extendedDependencies = [
      { class: BudgetService, initArgs: baseArgs },
      { class: ConsoleInput, initArgs: baseArgs },
      { class: GoogleAuthenticator, initArgs: baseArgs },
      { class: InputController, initArgs: baseArgs },
      { class: SpreadsheetService, initArgs: baseArgs },
      { class: Validator, initArgs: baseArgs },
    ]

    this.registerDependencies(this.extendedDependencies);
  }
}