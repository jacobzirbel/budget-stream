import { App } from '../classes/app';
import { BasicCategoryDeterminer } from '../classes/basic-strategy/basic-category-determiner';
import { ConsoleExpenseGenerator } from '../classes/basic-strategy/console-expense-generator';
import { ExpensePipeline } from '../classes/expense-pipeline';
import { BasicNoteGenerator } from '../classes/basic-strategy/basic-note-generator';
import { SpreadsheetInstructionBuilder } from '../classes/spreadsheets/spreadsheet-instruction-builder';
import { SpreadsheetService } from '../classes/spreadsheets/spreadsheet-service';
import { IExpenseGenerator } from '../models/expense.model';

new App().run(async app => {
  const expenseGenerator: IExpenseGenerator = await app.getDependency(ConsoleExpenseGenerator);

  const dataPipeline = new ExpensePipeline(
    await app.getDependency(BasicNoteGenerator),
    await app.getDependency(BasicCategoryDeterminer),
    await app.getDependency(SpreadsheetInstructionBuilder),
    await app.getDependency(SpreadsheetService),
  );

  expenseGenerator.forEachExpense(dataPipeline.run);
});
