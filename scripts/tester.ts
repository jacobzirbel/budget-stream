import { App } from "../classes/app";
import { ConsoleInput } from "../classes/console-input";

new App().run(async app => {
  console.log('doadfdfne');
  const ci = await app.getDependency(ConsoleInput);
  await ci.test();
  return true;
})