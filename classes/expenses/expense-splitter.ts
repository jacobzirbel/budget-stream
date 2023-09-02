import { singleton } from "tsyringe";
import { NoteGenerator } from "./note-generator";
import { CategoryDeterminer } from "./category-determiner";
import { JDependency, JPrompter, validCurrency } from "jazzapp";
import { ExpensePart, ExpensePartWithNote, ExpenseReadyForUpload, IProcessedExpense, IRawExpense } from "../../models/expense.model";

@singleton()
export class ExpenseSplitter extends JDependency {
  private noteGenerator: NoteGenerator
  private categoryDeterminer: CategoryDeterminer
  private prompter: JPrompter
  constructor(
    // private noteGenerator: NoteGenerator,
    // private categoryDeterminer: CategoryDeterminer,
    // private prompter: JPrompter,
  ) {
    super();
  }

  async splitExpense(rawExpense: IRawExpense): Promise<ExpensePartWithNote[]> {
    throw new Error('Not Implemented');
    let remainingAmount = rawExpense.amount;
    let expenseParts: ExpensePartWithNote[] = [];

    while (remainingAmount !== 0) {
      let amountToProcess = await this.getSubAmount(remainingAmount);
      let category = await this.categoryDeterminer.determineCategory('test');

      if (category === null) {
        throw new Error('Category is null');
      }

      remainingAmount -= amountToProcess;
      if (remainingAmount < 0) {
        amountToProcess += remainingAmount;  // adjust this part's amount
        remainingAmount = 0;  // set remainingAmount to 0 to stop loop
      }

      // Generate note based on this partial expense
      const partialExpense: ExpensePart = { amount: amountToProcess, category: category as any };
      const expenseWithNoteAndCategory = await this.noteGenerator.generateNote(partialExpense);

      expenseParts.push(expenseWithNoteAndCategory);
    }

    return expenseParts
  }

  async getSubAmount(remainingAmount: number): Promise<number> {
    return this.prompter.question(`How much of the ${remainingAmount} expense would you like to process?`, validCurrency(true));
  }
}
