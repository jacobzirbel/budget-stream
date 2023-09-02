import { App } from '../classes/app';
import { ExpensePipeline } from '../classes/expense-pipeline';
import { ConsoleExpenseGenerator } from '../classes/expenses/console-expense-generator';

new App().run(async app => {
  const expenseGenerator = await app.getDependency(ConsoleExpenseGenerator);
  const dataPipeline = await app.getDependency(ExpensePipeline);
  
  expenseGenerator.forEachExpense(x => dataPipeline.run(x));
});
