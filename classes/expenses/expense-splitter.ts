import { singleton } from "tsyringe";
import { NoteGenerator } from "./note-generator";
import { CategoryDeterminer } from "./category-determiner";
import { JDependency } from "jazzapp";
import { ExpensePart, ExpensePartWithNote, ExpenseReadyForUpload, IProcessedExpense, IRawExpense } from "../../models/expense.model";

@singleton()
export class ExpenseSplitter extends JDependency {
  constructor(
    private noteGenerator: NoteGenerator,
    private categoryDeterminer: CategoryDeterminer,
  ) {
    super();
  }

  splitExpense(rawExpense: IRawExpense): ExpenseReadyForUpload {
    let remainingAmount = rawExpense.amount;
    let expenseParts: ExpensePartWithNote[] = [];

    while (remainingAmount !== 0) {
      let amountToProcess = this.getSubAmount(remainingAmount);
      let category = this.categoryDeterminer.determineCategory('test');

      if (category === null) {
        throw new Error('Category is null');
      }

      remainingAmount -= amountToProcess;
      if (remainingAmount < 0) {
        amountToProcess += remainingAmount;  // adjust this part's amount
        remainingAmount = 0;  // set remainingAmount to 0 to stop loop
      }

      // Generate note based on this partial expense
      const partialExpense: ExpensePart = { amount: amountToProcess, category };
      const expenseWithNoteAndCategory = this.noteGenerator.generateNote(partialExpense);

      expenseParts.push(expenseWithNoteAndCategory);
    }

    return {
      ...rawExpense,
      expenseParts,
    };
  }

  getSubAmount(remainingAmount: number) {
    return remainingAmount < 1 ? remainingAmount : remainingAmount / 2;
  }
}
