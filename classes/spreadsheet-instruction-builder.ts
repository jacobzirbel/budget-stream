import { JDependency } from "jazzapp";
import { IProcessedExpense, ISpreadsheetInstruction } from "../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class SpreadsheetInstructionBuilder extends JDependency {
    buildInstruction(expenseData: IProcessedExpense): ISpreadsheetInstruction {
        // Build and return ISpreadsheetInstruction
        return {} as any;
    }
}