import { App } from '../classes/app';
import { ConsoleInput } from '../classes/console-input';

new App(true).run(async app => {
  const ci = await app.getDependency(ConsoleInput);
  await ci.getExpenses();
  return true;
});
