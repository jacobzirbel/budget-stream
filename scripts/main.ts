import { JPrompter } from 'jazzapp';
import { App } from '../classes/app';
import { ExpensePipeline } from '../classes/expense-pipeline';
import { ConsoleExpenseGenerator } from '../classes/expenses/console-expense-generator';
import { CsvExpenseGenerator } from '../classes/expenses/csv-expense-generator';


enum Options {
    Csv = 'csv',
    Console = 'console',
    Exit = 'exit',
}

new App().run(async app => {
    const prompter = await app.getDependency(JPrompter);
    while (true) {
        const answer = await prompter.multi(Object.values(Options), 'What do you want to do?');
        console.log(answer);
        switch (answer) {
            case Options.Csv:
                await handleCsvExpenses(app);
                break;
            case Options.Console:
                await handleConsoleExpenses(app);
                break;
            case Options.Exit:
                console.info('Exiting.');
                return;
        }
    }
});

async function handleCsvExpenses(app: App) {
    const expenseGenerator = await app.getDependency(CsvExpenseGenerator);
    const dataPipeline = await app.getDependency(ExpensePipeline);

    await expenseGenerator.forEachExpense(x => {
        return dataPipeline.run(x);
    });
}

async function handleConsoleExpenses(app: App) {
    const expenseGenerator = await app.getDependency(ConsoleExpenseGenerator);
    const dataPipeline = await app.getDependency(ExpensePipeline);

    await expenseGenerator.forEachExpense(x => {
        console.log('start callback from main')
        return dataPipeline.run(x);
    });
}