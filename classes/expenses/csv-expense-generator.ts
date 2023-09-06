import { JDependency, JPrompter, validCurrency } from 'jazzapp';
import { MoneyOption } from '../../header-enums';
import { ExpenseDataSourceType, IExpenseGenerator, IRawExpense } from '../../models/expense.model';
import { singleton } from 'tsyringe';
import { readFileSync, readdirSync } from 'fs';
import * as Papa from 'papaparse';

@singleton()
export class CsvExpenseGenerator extends JDependency implements IExpenseGenerator {
  constructor(
        private prompter: JPrompter,
  ) {
    super();
  }

  async forEachExpense(callback: (expense: IRawExpense) => Promise<void>): Promise<void> {
    const filePath = await this.selectFile();
    const moneySource = await this.getMoneySource(filePath);
    const csvExpenses = await this.getCsvContents(filePath);
    for (const csvExpense of csvExpenses) {
      const expense: IRawExpense = {
        amount: csvExpense.amount,
        context: {
          from: ExpenseDataSourceType.Csv,
          info: csvExpense.description,
        },
        source: moneySource,
      };
      const shouldSkip = await this.prompter.yn(`Skip ${csvExpense.amount} - ${csvExpense.description}?`, false);
      if (!shouldSkip) {
        await callback(expense);
      }
    }
  }

  async selectFile(): Promise<string> {
    const possibleFiles = readdirSync('./csvs');
    const answer = await this.prompter.multi(possibleFiles, 'File Path?');
    return `./csvs/${answer}`;
  }

  async getMoneySource(filePath: string): Promise<MoneyOption> {
    if (filePath.toLowerCase().includes('chase')) {
      return MoneyOption.Chase;
    } else if (filePath.toLowerCase().includes('verizon') || filePath === './csvs/Transaction') {
      return MoneyOption.Verizon;
    } else {
      return this.prompter.multi(Object.values(MoneyOption), 'Money Source?') as unknown as MoneyOption;
    }
  }

  async getCsvContents(filePath: string): Promise<RawCsvExpense[]> {
    const csvFile = readFileSync(filePath, 'utf8');
    // parse with papaparse
    return new Promise<RawCsvExpense[]>((resolve, reject) => {
      Papa.parse<CsvExpense>(csvFile, {
        header: true,
        complete: (results) => {
          if (!results.meta.fields?.includes('Amount') || !results.meta.fields?.includes('Description')) {
            throw new Error('Invalid csv columns');
          }

          resolve(results.data.map((d) => ({
            amount: +d.Amount * -1,
            description: d.Description,
          })).reverse().filter(x => !!x.amount));
        }
      });
    });
  }
}

interface RawCsvExpense {
    amount: number;
    description: string;
}

interface CsvExpense {
    Amount: number;
    Description: string;
}
