import { singleton } from "tsyringe";
import { NoteGenerator } from "./note-generator";
import { CategoryDeterminer } from "./category-determiner";
import { JDependency } from "jazzapp";
import { ExpensePart, ExpensePartWithNote, ExpenseReadyForUpload, IProcessedExpense, IRawExpense } from "../../models/expense.model";
import { ExpenseSplitter } from "./expense-splitter";

@singleton()
export class ExpenseProcessor extends JDependency {
  constructor(
    private noteGenerator: NoteGenerator,
    private categoryDeterminer: CategoryDeterminer,
    private expenseSplitter: ExpenseSplitter,
  ) {
    super();
  }

  processExpense(rawExpense: IRawExpense): ExpenseReadyForUpload {
    let category = this.categoryDeterminer.determineCategory('test');

    if (category === null) { // Handle splitting
      return this.expenseSplitter.splitExpense(rawExpense);
    } else {
      return {
        ...rawExpense,
        expenseParts: [
          this.noteGenerator.generateNote({
            amount: rawExpense.amount,
            category,
          })]
      }
    }
  }

  getSubAmount(remainingAmount: number) {
    return remainingAmount < 1 ? remainingAmount : remainingAmount / 2;;
  }
}
