import { JDependency } from "jazzapp";
import { ExpenseReadyForUpload, IProcessedExpense, ISpreadsheetInstruction } from "../../models/expense.model";
import { singleton } from "tsyringe";
import { MoneyOption, Sheet } from "../../header-enums";

@singleton()
export class SpreadsheetInstructionBuilder extends JDependency {
    buildInstructions(expenseData: ExpenseReadyForUpload): ISpreadsheetInstruction[] {
        // money part
        const moneyInstruction = {
            sheetName: Sheet.MONEY,
            header: expenseData.source,
            data: [expenseData.amount],
        };

        const otherInstructions = expenseData.expenseParts.map(expensePart => {
            const { amount, note, notePosition, category } = expensePart;
            const data: (string | number)[] = [amount];
          
            if (note) {
              notePosition === 'pre' ? data.unshift(note) : data.push(note);
            }
          
            return {
              sheetName: Sheet.CURRENT,
              header: category,
              data
            };
          });
          
        // Build and return ISpreadsheetInstruction
        return [moneyInstruction, ...otherInstructions];
    }
}