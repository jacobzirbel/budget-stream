import { JDependency, JPrompter } from 'jazzapp';
import { ExpensePart, ExpensePartWithNote } from '../../models/expense.model';
import { singleton } from 'tsyringe';
import { CategoryOption } from '../../header-enums';

@singleton()
export class NoteGenerator extends JDependency {
  notePositionByCategory: Map<CategoryOption, 'pre' | 'post'> = new Map([
    [CategoryOption.Misc, 'post'],
    [CategoryOption.Rent, 'post'],
    [CategoryOption.Phone, 'pre'],
  ]);

  constructor(
    private prompter: JPrompter,
  ) {
    super();
  }
  async generateNote(expense: ExpensePart): Promise<ExpensePartWithNote> {
    const notePosition = this.notePositionByCategory.get(expense.category);

    if (notePosition) {
      return {
        ...expense,
        note: await this.prompter.question(`Enter a note for ${expense.category}:`),
        notePosition
      };
    } else {
      return expense;
    }
  }
}