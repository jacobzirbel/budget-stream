import { JDependency, JPrompter, validCurrency } from 'jazzapp';
import { MoneyOption } from '../../header-enums';
import { ExpenseDataSourceType, IExpenseGenerator, IRawExpense } from '../../models/expense.model';
import { singleton } from 'tsyringe';

@singleton()
export class ConsoleExpenseGenerator extends JDependency implements IExpenseGenerator {
  constructor(
    private prompter: JPrompter,
  ) {
    super();
  }

  async forEachExpense(callback: (expense: IRawExpense) => Promise<void>): Promise<void> {
    while (true) {
      const moneySource = await this.getMoneySourceFromConsole();
      if (!moneySource || moneySource === MoneyOption.Exit) return;

      while (true) {
        const amount = await this.getAmountFromConsole(moneySource);
        if (!amount) {
          console.info('no amount, exiting');
          return;
        }

        const expense: IRawExpense = {
          amount,
          context: {
            from: ExpenseDataSourceType.Console,
          },
          source: moneySource,
        };

        await callback(expense);
      }
    }
  }

  private async getMoneySourceFromConsole(): Promise<MoneyOption | null> {
    return await this.prompter.multi(Object.values(MoneyOption), 'Money Source?') as MoneyOption;
  }

  private async getAmountFromConsole(moneySource: string): Promise<number | null> {
    return await this.prompter.question('Amount?', validCurrency(false));
  }
}
