import { JDependency, JPrompter, validCurrency } from 'jazzapp';
import { IInputService } from '../interfaces/input-service.model';
import { singleton } from 'tsyringe';
import { CurrentHeader, MoneyHeaders as MoneyHeader, getCurrentColumnOffset, isCredit } from '../config';
import { SpreadsheetService } from './spreadsheet-service';

@singleton()
export class ConsoleInput extends JDependency implements IInputService {
  constructor(private prompter: JPrompter, private spreadsheetService: SpreadsheetService) {
    super();
  }

  async getExpenses() {
    const more = true;
    while (more) {
      const moneySource = await this.getMoneySource();
      let again = true;
      while (again) {
        const amount = await this.getAmount();
        const category = await this.getCategory();
        if (category as string === 'Exit') {
          again = false;
          continue;
        }
        this.addExpense(category, moneySource, amount);
      }
    }
  }
  
  addExpense(category: CurrentHeader, moneySource: MoneyHeader, amount: number) {
    const categoryOffset = getCurrentColumnOffset(category);
    this.spreadsheetService.addDataToColumnByHeader('Current', category, amount, categoryOffset);
    this.spreadsheetService.addDataToColumnByHeader('Money', moneySource, amount * (isCredit(moneySource) ? 1 : -1), 16);
  }

  async getMoneySource() {
    return await this.prompter.multi(Object.values(MoneyHeader), 'Money Source?') as MoneyHeader;
  }

  async getAmount(): Promise<number> {
    return await this.prompter.question('Amount?', validCurrency(false));
  }

  async getCategory(): Promise<CurrentHeader> {
    return await this.prompter.multi([...Object.values(CurrentHeader), 'Exit'], 'Category?') as CurrentHeader;
  }

  destroy?: (() => void) | undefined;
}