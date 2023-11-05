import { JDependency, JPrompter } from 'jazzapp';
import { singleton } from 'tsyringe';
import { SpreadsheetService } from './spreadsheets/spreadsheet-service';
import { MoneyOption } from '../header-enums';

@singleton()
export class RetirementInput extends JDependency {
  toInput = [
    MoneyOption.SRoth,
    MoneyOption.STrad,
    MoneyOption.SSave,
    MoneyOption.Baird,
    MoneyOption.Four,
    MoneyOption.HSA,
    MoneyOption.Crypto,
  ]
  constructor(
    spreadsheetService: SpreadsheetService,
    prompter: JPrompter
  ) {
    super();
  }

  run() {
    
  }
}