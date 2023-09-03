import { JDependency } from 'jazzapp';
import { singleton } from 'tsyringe';
import { Sheet, getCurrentColumnOffset } from '../../header-enums';
import { ExpenseReadyForUpload, ISpreadsheetInstruction } from '../../models/expense.model';

@singleton()
export class SpreadsheetInstructionBuilder extends JDependency {
  buildInstructions(expenseData: ExpenseReadyForUpload): ISpreadsheetInstruction[] {
    const moneyInstruction = {
      sheetName: Sheet.Money,
      header: expenseData.source,
      data: [expenseData.amount],
      offsetX: 16,
    };

    const otherInstructions = expenseData.expenseParts.map(expensePart => {
      const { amount, note, notePosition, category } = expensePart;
      const data: (string | number)[] = [amount];

      if (note) {
        notePosition === 'pre' ? data.unshift(note) : data.push(note);
      }

      return {
        sheetName: Sheet.Current,
        header: category,
        data,
        offsetX: getCurrentColumnOffset(category),
      };
    });

    // Build and return ISpreadsheetInstruction
    return [moneyInstruction, ...otherInstructions];
  }
}