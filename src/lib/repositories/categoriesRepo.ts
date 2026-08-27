import { BaseRepository } from './baseRepository';
import { Category } from '../types';

class CategoriesRepository extends BaseRepository<Category> {
  constructor() {
    super('Categories');
  }

  // You can add category-specific queries here
  async getActiveCategories(): Promise<Category[]> {
    const all = await this.getAll();
    return all.filter(c => c.status !== 'ARCHIVED');
  }

  async getExpenseCategories(): Promise<Category[]> {
    const all = await this.getActiveCategories();
    return all.filter(c => c.type === 'EXPENSE' || c.type === 'BOTH');
  }

  async getIncomeCategories(): Promise<Category[]> {
    const all = await this.getActiveCategories();
    return all.filter(c => c.type === 'INCOME' || c.type === 'BOTH');
  }
}

export const categoriesRepo = new CategoriesRepository();
