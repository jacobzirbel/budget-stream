import { JDependency } from "jazzapp";
import { ExpensePart, ExpensePartWithNote, IExpenseWithCategory, IExpenseWithNoteAndCategory, INoteGenerator } from "../../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class NoteGenerator extends JDependency implements INoteGenerator {
  constructor() {
    super();
  }
  generateNote(expense: ExpensePart): ExpensePartWithNote {
    return {
      ...expense,
      note: 'note from actual logic',
      notePosition: 'pre'
    }
  }

  tester() {
    console.log('basic note generator')
  }
}