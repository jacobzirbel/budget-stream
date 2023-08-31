import { JDependency } from "jazzapp";
import { MoneyOption } from "../header-enums";
import { IExpenseGenerator, IRawExpense } from "../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class ConsoleExpenseGenerator extends JDependency implements IExpenseGenerator {
  constructor() {
    super();
  }

  async forEachExpense(callback: (expense: IRawExpense) => void): Promise<void> {
    while (true) {
      const moneySource = await this.getMoneySourceFromConsole();
      if (!moneySource) break;

      while (true) {
        const amount = await this.getAmountFromConsole(moneySource);
        if (!amount) break;

        const expense: IRawExpense = {
          amount,
          context: '',
          source: moneySource,
        }
        callback(expense);
      }
    }
  }

  private async getMoneySourceFromConsole(): Promise<MoneyOption | null> {
    return MoneyOption.Cash;
  }

  private async getAmountFromConsole(moneySource: string): Promise<number | null> {
    return 0;
  }
}
