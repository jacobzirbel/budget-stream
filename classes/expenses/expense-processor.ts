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
    console.log('CONSTRUCT PROCESSOR')
  }

  async processExpense(rawExpense: IRawExpense): Promise<ExpenseReadyForUpload> {
    let expenseParts: ExpensePartWithNote[];
    
    let category = await this.categoryDeterminer.determineCategory(rawExpense.context);
    
    if (category === null) {
      expenseParts = await this.expenseSplitter.splitExpense(rawExpense);
    } else {
      const x = await this.noteGenerator.generateNote({
        amount: rawExpense.amount,
        category,
      });
      expenseParts = [x];
    }

    return {
      ...rawExpense,
      expenseParts: expenseParts
    }
  }
}
