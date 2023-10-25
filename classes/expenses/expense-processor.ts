import { singleton } from 'tsyringe';
import { NoteGenerator } from './note-generator';
import { CategoryDeterminer } from './category-determiner';
import { JDependency, JPrompter, validCurrency } from 'jazzapp';
import { ExpensePart, ExpensePartWithNote, ExpenseReadyForUpload, IProcessedExpense, IRawExpense } from '../../models/expense.model';
import { ExpenseSplitter } from './expense-splitter';
import { CategoryOption } from '../../header-enums';

@singleton()
export class ExpenseProcessor extends JDependency {
  constructor(
    private noteGenerator: NoteGenerator,
    private categoryDeterminer: CategoryDeterminer,
    private expenseSplitter: ExpenseSplitter,
    private prompter: JPrompter,
  ) {
    super();
  }

  async processExpense(rawExpense: IRawExpense): Promise<ExpenseReadyForUpload | null> {
    let expenseParts: ExpensePartWithNote[];

    const category = await this.categoryDeterminer.determineCategory(rawExpense);

    if (category === CategoryOption.Split) {
      expenseParts = await this.splitExpense(rawExpense);
    } else if (category === CategoryOption.Skip) {
      return null;
    } else {
      const x = await this.noteGenerator.generateNote({
        amount: rawExpense.amount,
        category,
      }, rawExpense.context);
      expenseParts = [x];
    }

    return {
      ...rawExpense,
      expenseParts: expenseParts
    };
  }

  async splitExpense(rawExpense: IRawExpense): Promise<ExpensePartWithNote[]> {
    throw new Error('Not implemented');
    let remainingAmount = rawExpense.amount;
    const expenseParts: ExpensePartWithNote[] = [];

    while (remainingAmount !== 0) {
      const amountToProcess = await this.getSubAmount(remainingAmount);
      remainingAmount -= amountToProcess;
      const category = await this.categoryDeterminer.determineCategory(rawExpense);

      if (category === null) {
        throw new Error('Category is null');
      }


      // Generate note based on this partial expense
      const partialExpense: ExpensePart = { amount: amountToProcess, category: category || CategoryOption.Misc };
      const expenseWithNoteAndCategory = await this.noteGenerator.generateNote(partialExpense);

      expenseParts.push(expenseWithNoteAndCategory);
    }

    return expenseParts;
  }

  async getSubAmount(remainingAmount: number): Promise<number> {
    return this.prompter.question(`How much of the ${remainingAmount} expense would you like to process?`, validCurrency(true));
  }
}
