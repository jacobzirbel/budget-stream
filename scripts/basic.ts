import { datapipelines } from 'googleapis/build/src/apis/datapipelines';
import { App } from '../classes/app';
import { BasicCategoryDeterminer } from '../classes/category-determiner';
import { ConsoleExpenseGenerator } from '../classes/console-expense-generator';
import { ConsoleInput } from '../classes/console-input';
import { DataPipeline } from '../classes/data-pipeline';
import { BasicNoteGenerator } from '../classes/note-generator';
import { SpreadsheetInstructionBuilder } from '../classes/spreadsheet-instruction-builder';
import { SpreadsheetService } from '../classes/spreadsheet-service';
import { IExpenseGenerator } from '../models/expense.model';

new App(true).run(async app => {
  const expenseGenerator: IExpenseGenerator = await app.getDependency(ConsoleExpenseGenerator);

  const dataPipeline = new DataPipeline(
    await app.getDependency(BasicNoteGenerator),
    await app.getDependency(BasicCategoryDeterminer),
    await app.getDependency(SpreadsheetInstructionBuilder),
    await app.getDependency(SpreadsheetService),
  );

  expenseGenerator.forEachExpense(dataPipeline.run);
});
