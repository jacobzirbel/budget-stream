import { JPrompter, JUtilities } from 'jazzapp';
import { App } from '../classes/app';
import { SpreadsheetService } from '../classes/spreadsheet-service';
import { ConsoleInput } from '../classes/console-input';
import { CurrentHeader } from '../config';

new App(true).run(async app => {
  const ci = await app.getDependency(ConsoleInput);
  await ci.getExpenses();
  return true;
});
