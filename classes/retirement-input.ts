import { JDependency, JPrompter } from 'jazzapp';
import { singleton } from 'tsyringe';
import { SpreadsheetService } from './spreadsheets/spreadsheet-service';
import { MoneyOption, Sheet } from '../header-enums';
import { AnswerValidator } from 'jazzapp/lib/interfaces/answer-validator.model';
import { ISpreadsheetInstruction } from '../models/expense.model';

@singleton()
export class RetirementInput extends JDependency {
  toInput = [
    { account: MoneyOption.HSA, min: 1000, max: 50000 },
    { account: MoneyOption.SRoth, min: 1000, max: 50000 },
    { account: MoneyOption.STrad, min: 1000, max: 50000 },
    { account: MoneyOption.SSave, min: 1000, max: 50000 },
    { account: MoneyOption.Baird, min: 1000, max: 50000 },
    { account: MoneyOption.Four, min: 1000, max: 50000 },
  ]
  constructor(
    private spreadsheetService: SpreadsheetService,
    private prompter: JPrompter
  ) {
    super();
  }

  validator = (min: number, max: number): AnswerValidator<number | null> => {
    let unconfirmedValue: number | null = null;

    return (ans: string) => {
      const res = Number(ans.replace(/[^0-9.-]+/g, ""));
      if (isNaN(res)) {
        return null;

      } else if ((!!unconfirmedValue || unconfirmedValue === 0) && unconfirmedValue === res) {
        unconfirmedValue = null;
        return res;
      } else if (res > max || res < min) {
        console.info('You entered an invalid amount. Are you sure?');
        unconfirmedValue = res;
        return null;
      }

      return res;
    }
  }

  async run() {
    const instructions: ISpreadsheetInstruction[] = [];
    for (const input of this.toInput) {
      const { account, min, max } = input;
      let amount = 0;
      if (account === MoneyOption.HSA) {
        amount = await this.handleHsa();
      } else {
        amount = await this.prompter.question(account, this.validator(min, max));
      }

      const instruction = {
        sheetName: Sheet.Money,
        header: account,
        data: [amount],
        allowOverwrite: true,
        offsetY: -4,
      };
      instructions.push(instruction);

      this.spreadsheetService.addDataToColumnByHeaderQueue([instruction]);
    }
  }

  private async handleHsa(): Promise<number> {
    const num1 = await this.prompter.question('HSA First', this.validator(0, Infinity));
    const num2 = await this.prompter.question('HSA Second', this.validator(0, Infinity));
    return num1 + num2;
  }
}