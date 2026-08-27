import { BaseRepository } from './baseRepository';
import { Transaction } from '../types';

class TransactionsRepository extends BaseRepository<Transaction> {
  constructor() {
    super('Transactions');
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    const all = await this.getAll();
    return all.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month; // month is 0-indexed in JS
    });
  }

  async getRecent(limit: number = 10): Promise<Transaction[]> {
    const all = await this.getAll();
    // Sort by date descending
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return all.slice(0, limit);
  }
}

export const transactionsRepo = new TransactionsRepository();
