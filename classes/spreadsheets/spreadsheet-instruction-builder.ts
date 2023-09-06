import { JDependency } from 'jazzapp';
import { singleton } from 'tsyringe';
import { CategoryOption, Sheet, getCurrentColumnOffsetX } from '../../header-enums';
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

      if (note !== undefined && note !== null) {
        notePosition === 'pre' ? data.unshift(note) : data.push(note);
      }
  
      const instruction = {
        sheetName: Sheet.Current,
        header: category,
        data,
        offsetX: getCurrentColumnOffsetX(category),
        offsetY: category === CategoryOption.Phone ? -1 : 0,
      };
      return instruction;
    });

    // Build and return ISpreadsheetInstruction
    return [moneyInstruction, ...otherInstructions];
  }
}