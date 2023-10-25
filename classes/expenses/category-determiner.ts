import { JDependency, JPrompter } from 'jazzapp';
import { CategoryOption } from '../../header-enums';
import { ExpenseContext, ExpenseDataSourceType, IRawExpense } from '../../models/expense.model';
import { singleton } from 'tsyringe';
import { categoryConfig } from '../../config/category-config';

@singleton()
export class CategoryDeterminer extends JDependency {
  categories: CategoryOption[] = [
    CategoryOption.Fast,
    CategoryOption.Grocery,
    CategoryOption.Travel,
    CategoryOption.Misc,
    CategoryOption.Rent,
    CategoryOption.Phone,
    CategoryOption.Health,
    CategoryOption.Car,
    CategoryOption.Drugs,
    CategoryOption.Gift,
    CategoryOption.Split,
    CategoryOption.Skip,
    CategoryOption.Exit,
  ];

  constructor(
    private prompter: JPrompter,
  ) {
    super();
  }

  async determineCategory(expense: IRawExpense): Promise<CategoryOption> {
    this.displayRelevantContext(expense);
    let category: CategoryOption | null = null;

    category = await this.determineCategoryByContext(expense.context);
    if (category) {
      console.info(`Inferred category: ${category}`);
      return category;
    }

    category = await this.getCategoryFromConsole();

    return category;
  }

  private async getCategoryFromConsole(): Promise<CategoryOption> {
    const selectedCategory = await this.prompter.multi(this.categories, 'Category?') as CategoryOption;
    return selectedCategory;
  }

  private async determineCategoryByContext(context: ExpenseContext): Promise<CategoryOption | null> {
    let category = null;
    const infoUpper = context.info?.toUpperCase();
    for (const entry of categoryConfig) {
      if (entry.keywords.some(keyword => infoUpper?.includes(keyword.toUpperCase()))) {
        category = entry.category;
        break;
      }
    }

    return category;
  }

  private displayRelevantContext(expense: IRawExpense) {
    if (expense.context.from === ExpenseDataSourceType.Csv) {
      console.info(expense.context.info, expense.amount);
    }
  }
}