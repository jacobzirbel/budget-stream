import { App } from '../classes/app';
import { ConsoleInput } from '../classes/console-input';

new App().run(async app => {
  const ci = await app.getDependency(ConsoleInput);
  await ci.getExpenses();
  return true;
});
