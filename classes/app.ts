import { BASE_INIT_ARGS, JApp } from 'jazzapp';
import { ConsoleInput } from './console-input';
import { GoogleAuthenticator } from './spreadsheets/google-authenticator';
import { SpreadsheetService } from './spreadsheets/spreadsheet-service';
import { SheetsApi } from './spreadsheets/sheets-api';
import { SpreadsheetInstructionBuilder } from './spreadsheets/spreadsheet-instruction-builder';
import { BasicCategoryDeterminer } from './basic-strategy/basic-category-determiner';
import { BasicNoteGenerator } from './basic-strategy/basic-note-generator';

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
      { class: BasicCategoryDeterminer, initArgs: baseArgs },
      { class: BasicNoteGenerator, initArgs: baseArgs },
    ];

    this.registerDependencies(this.extendedDependencies);
  }
}