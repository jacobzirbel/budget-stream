import { App } from '../classes/app';
import { CategoryDeterminer } from '../classes/expenses/category-determiner';
import { ConsoleExpenseGenerator } from '../classes/expenses/console-expense-generator';
import { ExpensePipeline } from '../classes/expense-pipeline';
import { NoteGenerator } from '../classes/expenses/note-generator';
import { SpreadsheetInstructionBuilder } from '../classes/spreadsheets/spreadsheet-instruction-builder';
import { SpreadsheetService } from '../classes/spreadsheets/spreadsheet-service';
import { IExpenseGenerator } from '../models/expense.model';

new App().run(async app => {
  const expenseGenerator: IExpenseGenerator = await app.getDependency(ConsoleExpenseGenerator);

  const dataPipeline = new ExpensePipeline(
    await app.getDependency(NoteGenerator),
    await app.getDependency(CategoryDeterminer),
    await app.getDependency(SpreadsheetInstructionBuilder),
    await app.getDependency(SpreadsheetService),
  );

  expenseGenerator.forEachExpense(dataPipeline.run);
});
