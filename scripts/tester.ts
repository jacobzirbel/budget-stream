import { JPrompter, JUtilities } from "jazzapp";
import { App } from "../classes/app";
import { SpreadsheetService } from "../classes/spreadsheet-service";
import { ConsoleInput } from "../classes/console-input";
import { CurrentHeaders } from "../config";

new App(true).run(async app => {
  const ci = await app.getDependency(SpreadsheetService);

  // console.log(await ci.getColumnData('Current', CurrentHeaders.Rent));
  // console.log(await ci.addDataToColumnByHeader('Current', CurrentHeaders.Rent, 'UPDAdddTED'));

  return true;
})
