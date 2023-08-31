import { JDependency } from "jazzapp";
import { CategoryOption } from "../header-enums/current-headers.enum";
import { IExpenseWithCategory, IExpenseWithNote, IProcessedExpense, IRawExpense } from "../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class ExpenseProcessor extends JDependency {
  processExpense(expenseData: IRawExpense): IProcessedExpense {
    const expenseWithCategory = this.determineCategory(expenseData);
    const processedExpense = this.determineNote(expenseWithCategory);
    return processedExpense;
  }

  private determineCategory(expenseData: IRawExpense): IExpenseWithCategory {
    // Logic to determine category
    return {
      ...expenseData,
      category: CategoryOption.Travel // Replace with actual logic
    }
  }

  private determineNote(expenseData: IExpenseWithCategory): IProcessedExpense {
    let note = '';
    if (![CategoryOption.Rent, CategoryOption.Misc, CategoryOption.Phone].includes(expenseData.category)) {
      note = ''; // note not allowed
    } else {
      note = 'note from actual logic'
    }

    return {
      ...expenseData,
      note,
      notePosition: 'pre' // Replace with actual logic
    }
  }
}