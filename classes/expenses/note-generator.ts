import { JDependency, JPrompter } from 'jazzapp';
import { ExpenseContext, ExpensePart, ExpensePartWithNote } from '../../models/expense.model';
import { singleton } from 'tsyringe';
import { CategoryOption } from '../../header-enums';
import { noteConfig } from '../../config/note-config';

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

  async generateNote(expense: ExpensePart, context?: ExpenseContext): Promise<ExpensePartWithNote> {
    const notePosition = this.notePositionByCategory.get(expense.category);

    if (notePosition) {
      return {
        ...expense,
        note: context && this.getNoteFromConfig(context) || await this.getNoteFromCli(expense),
        notePosition
      };
    } else {
      return expense;
    }
  }

  getNoteFromConfig(context: ExpenseContext): string | undefined {
    const infoUpper = context.info?.toUpperCase();
    for (const entry of noteConfig) {
      if (entry.keywords.some(keyword => infoUpper?.includes(keyword.toUpperCase()))) {
        return entry.note;
      }
    }
  }

  getNoteFromCli(expense: ExpensePart) {
    return this.prompter.question(`Enter a note for ${expense.category}:`)
  }
}