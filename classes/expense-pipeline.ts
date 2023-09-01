import { JDependency } from "jazzapp";
import { ICategoryDeterminer, INoteGenerator, IRawExpense } from "../models/expense.model";
import { SpreadsheetInstructionBuilder } from "./spreadsheets/spreadsheet-instruction-builder";
import { SpreadsheetService } from "./spreadsheets/spreadsheet-service";
import { singleton } from "tsyringe";
import { ExpenseProcessor } from "./expenses/expense-processor";

@singleton()
export class ExpensePipeline extends JDependency {
  constructor(
    private expenseProcessor: ExpenseProcessor,
    private spreadsheetInstructionBuilder: SpreadsheetInstructionBuilder,
    private spreadsheetService: SpreadsheetService,
  ) {
    super();
  }

  run(rawExpense: IRawExpense) {
    // process the data
    const processedExpenses = this.expenseProcessor.processExpense(rawExpense);

    
    // build the instructions
    const instruction = this.spreadsheetInstructionBuilder.buildInstruction(processedExpense);

    // send the instructions to the spreadsheet service
    const { sheetName, header, data, extraOffset } = instruction;
    this.spreadsheetService.addDataToColumnByHeader(sheetName, header, data, extraOffset);
  }
}