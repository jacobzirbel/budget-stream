import { App } from '../classes/app';
import { ExpensePipeline } from '../classes/expense-pipeline';
import { ConsoleExpenseGenerator } from '../classes/expenses/console-expense-generator';
import { CsvExpenseGenerator } from '../classes/expenses/csv-expense-generator';

new App().run(async app => {
  // const expenseGenerator = await app.getDependency(ConsoleExpenseGenerator);
  const expenseGenerator = await app.getDependency(CsvExpenseGenerator);
  const dataPipeline = await app.getDependency(ExpensePipeline);
  
  await expenseGenerator.forEachExpense(x => {
    return dataPipeline.run(x);
  });
});
