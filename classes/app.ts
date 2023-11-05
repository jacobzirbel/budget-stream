import { BASE_INIT_ARGS, JApp } from 'jazzapp';
import { ConsoleInput } from './console-input';
import { GoogleAuthenticator } from './spreadsheets/google-authenticator';
import { SpreadsheetService } from './spreadsheets/spreadsheet-service';
import { SheetsApi } from './spreadsheets/sheets-api';
import { SpreadsheetInstructionBuilder } from './spreadsheets/spreadsheet-instruction-builder';
import { CategoryDeterminer } from './expenses/category-determiner';
import { NoteGenerator } from './expenses/note-generator';
import { ConsoleExpenseGenerator } from './expenses/console-expense-generator';
import { ExpensePipeline } from './expense-pipeline';
import { ExpenseProcessor } from './expenses/expense-processor';
import { ExpenseSplitter } from './expenses/expense-splitter';
import { CsvExpenseGenerator } from './expenses/csv-expense-generator';
import { RetirementInput } from './retirement-input';

export class App extends JApp {
  constructor() {
    super();
    // get first arg from command line
    const baseArgs: BASE_INIT_ARGS = {
      isTesting: process.argv[2] !== 'real',
    };

    this.extendedDependencies = [
      { class: ConsoleInput, initArgs: baseArgs },
      { class: GoogleAuthenticator, initArgs: baseArgs },
      { class: SpreadsheetService, initArgs: baseArgs },
      { class: SpreadsheetInstructionBuilder, initArgs: baseArgs },
      { class: SheetsApi, initArgs: baseArgs },
      { class: CategoryDeterminer, initArgs: baseArgs },
      { class: NoteGenerator, initArgs: baseArgs },
      { class: ConsoleExpenseGenerator, initArgs: baseArgs },
      { class: CsvExpenseGenerator, initArgs: baseArgs },
      { class: ExpensePipeline, initArgs: baseArgs },
      { class: ExpenseProcessor, initArgs: baseArgs },
      { class: ExpenseSplitter, initArgs: baseArgs },
      { class: RetirementInput, initArgs: baseArgs }
    ];

    this.registerDependencies(this.extendedDependencies);
  }
}