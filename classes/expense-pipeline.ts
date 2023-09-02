import { JDependency } from 'jazzapp';
import { IRawExpense } from '../models/expense.model';
import { SpreadsheetInstructionBuilder } from './spreadsheets/spreadsheet-instruction-builder';
import { SpreadsheetService } from './spreadsheets/spreadsheet-service';
import { singleton } from 'tsyringe';
import { ExpenseProcessor } from './expenses/expense-processor';

@singleton()
export class ExpensePipeline extends JDependency {
  constructor(
    private expenseProcessor: ExpenseProcessor,
    private spreadsheetInstructionBuilder: SpreadsheetInstructionBuilder,
    private spreadsheetService: SpreadsheetService,
  ) {
    super();
  }

  async run(rawExpense: IRawExpense) {
    // process the data
    const processedExpense = await this.expenseProcessor.processExpense(rawExpense);

    // build the instructions
    const instructions = this.spreadsheetInstructionBuilder.buildInstructions(processedExpense);

    // send the instructions to the spreadsheet service
    // todo batch update
    instructions.forEach(instruction => {
      const { sheetName, header, data, extraOffset } = instruction;
      this.spreadsheetService.addDataToColumnByHeader(sheetName, header, data, extraOffset);
    });
  }
}