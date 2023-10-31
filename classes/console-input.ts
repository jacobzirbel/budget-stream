import { JDependency, JPrompter, validCurrency } from 'jazzapp';
import { IInputService } from '../interfaces/input-service.model';
import { singleton } from 'tsyringe';
import { SpreadsheetService } from './spreadsheets/spreadsheet-service';
import { CategoryOption, MoneyOption, Sheet, getCurrentColumnOffsetY, isCredit } from '../header-enums';

@singleton()
export class ConsoleInput extends JDependency implements IInputService {
  categories: string[] = [...Object.values(CategoryOption)];

  constructor(private prompter: JPrompter, private spreadsheetService: SpreadsheetService) {
    super();
    throw new Error('dont use this');
  }

  async getExpenses() {
    while (true) {
      const moneySource = await this.getMoneySource();

      if (moneySource === MoneyOption.Exit) {
        break;
      }

      while (true) {
        const amount = await this.getAmount();

        if (amount === 0) {
          break;
        }

        const category = await this.getCategory();

        if (category === CategoryOption.Exit) {
          break;
        }

        await this.addExpense(category, moneySource, amount);
      }
    }
  }

  async addExpense(category: CategoryOption, moneySource: MoneyOption, amount: number) {
    const categoryOffset = getCurrentColumnOffsetY(category);

    const categoryData = await this.getCategoryData(amount, category);
    const moneySourceData = await this.getMoneySourceData(amount, moneySource);
    // this.spreadsheetService.addDataToColumnByHeader({ sheetName: Sheet.Current, header: category, data: categoryData, offsetY: categoryOffset });
    // this.spreadsheetService.addDataToColumnByHeader({ sheetName: Sheet.Money, header: moneySource, data: moneySourceData, offsetY: 16 });
  }

  async getMoneySource() {
    return await this.prompter.multi(Object.values(MoneyOption), 'Money Source?') as MoneyOption;
  }

  async getAmount(): Promise<number> {
    return await this.prompter.question('Amount?', validCurrency(false));
  }

  async getCategory(): Promise<CategoryOption> {
    const selectedCategory = await this.prompter.multi(this.categories, 'Category?');
    this.categories = this.categories.filter(category => category !== selectedCategory);
    this.categories.unshift(selectedCategory);
    return selectedCategory as CategoryOption;
  }

  private async getCategoryData(amount: number, category: CategoryOption): Promise<(number | string)[]> {
    const ret: (number | string)[] = [amount];
    if ([CategoryOption.Misc, CategoryOption.Rent].includes(category)) {
      const note = await this.prompter.question('Category note?');
      ret.push(note);
    }

    if (category === CategoryOption.Phone) {
      const note = await this.prompter.question('Phone note?');
      ret.unshift(note);
    }

    return ret;
  }

  private async getMoneySourceData(amount: number, moneySource: MoneyOption): Promise<(number | string)[]> {
    const ret: (number | string)[] = [amount * (isCredit(moneySource) ? 1 : -1)];
    if (moneySource === MoneyOption.Other) {
      const note = await this.prompter.question('Other source note?');
      ret.push(note);
    }

    return ret;
  }

  destroy?: (() => void) | undefined;
}