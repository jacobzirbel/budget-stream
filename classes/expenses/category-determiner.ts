import { JDependency, JPrompter } from 'jazzapp';
import { CategoryOption } from '../../header-enums';
import { ExpenseContext, ExpenseDataSourceType, IRawExpense } from '../../models/expense.model';
import { singleton } from 'tsyringe';
import { info } from 'console';

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

  async determineCategory(context: ExpenseContext): Promise<CategoryOption> {
    this.displayRelevantContext(context);
    let category: CategoryOption | null = null;

    if (context.from === ExpenseDataSourceType.Csv) {
      category = await this.determineCategoryByContext(context);
      if (category) {
        console.info(`Inferred category: ${category}`);
        return category;
      }
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

    if (context.info?.includes('amazon')) {
      category = CategoryOption.Misc;
    }

    return category;
  }

  private displayRelevantContext(context: ExpenseContext) {
    if (context.from === ExpenseDataSourceType.Csv) {
      console.info(context.info);
    }
  }
}