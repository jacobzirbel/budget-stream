import { JDependency, JPrompter, validCurrency } from 'jazzapp';
import { IInputService } from '../interfaces/input-service.model';
import { singleton } from 'tsyringe';
import { CategoryOption, MoneyOption, getCurrentColumnOffset, isCredit } from '../config';
import { SpreadsheetService } from './spreadsheet-service';

@singleton()
export class ConsoleInput extends JDependency implements IInputService {
  constructor(private prompter: JPrompter, private spreadsheetService: SpreadsheetService) {
    super();
  }

  async getExpenses() {
    while (true) {
      const moneySource = await this.getMoneySource();

      if (moneySource === MoneyOption.Exit) {
        break;
      }

      while (true) {
        const amount = await this.getAmount();
        const category = await this.getCategory();
        let note: string;

        if (category === CategoryOption.Exit) {
          break;
        }

        await this.addExpense(category, moneySource, amount);
      }
    }
  }

  async addExpense(category: CategoryOption, moneySource: MoneyOption, amount: number) {
    const categoryOffset = getCurrentColumnOffset(category);

    const categoryData = await this.getCategoryData(amount, category);
    const moneySourceData = await this.getMoneySourceData(amount, moneySource);
    this.spreadsheetService.addDataToColumnByHeader('Current', category, categoryData, categoryOffset);
    this.spreadsheetService.addDataToColumnByHeader('Money', moneySource, moneySourceData, 16);
  }

  async getMoneySource() {
    return await this.prompter.multi(Object.values(MoneyOption), 'Money Source?') as MoneyOption;
  }

  async getAmount(): Promise<number> {
    return await this.prompter.question('Amount?', validCurrency(false));
  }

  async getCategory(): Promise<CategoryOption> {
    return await this.prompter.multi(Object.values(CategoryOption), 'Category?') as CategoryOption;
  }

  private async getCategoryData(amount: number, category: CategoryOption): Promise<(number | string)[]> {
    let ret: (number | string)[] = [amount];
    if (category === CategoryOption.Misc) {
      const note = await this.prompter.question('Note?');
      ret.push(note);
    }

    return ret;
  }

  private async getMoneySourceData(amount: number, moneySource: MoneyOption): Promise<(number | string)[]> {
    let ret: (number | string)[] = [amount * (isCredit(moneySource) ? 1 : -1)];
    if (moneySource === MoneyOption.Other) {
      const note = await this.prompter.question('Note?');
      ret.push(note);
    }

    return ret;
  }

  destroy?: (() => void) | undefined;
}