import { BaseRepository } from './baseRepository';
import { Category, Transaction } from '../types';

// Additional types
export type Account = { id: string; name: string; type: string; currentBalance: number; [key: string]: any };
export type Card = { id: string; name: string; creditLimit: number; currentOutstanding: number; [key: string]: any };
export type Budget = { id: string; month: string; categoryId: string; budgetAmount: number; [key: string]: any };
export type Bill = { id: string; name: string; amount: number; dueDate: string; [key: string]: any };
export type Goal = { id: string; name: string; targetAmount: number; currentAmount: number; [key: string]: any };

// Export instances of all repositories
export const settingsRepo = new BaseRepository<any>('Settings');
export const categoriesRepo = new BaseRepository<Category>('Categories');
export const transactionsRepo = new BaseRepository<Transaction>('Transactions');
export const incomeRepo = new BaseRepository<any>('Income');
export const accountsRepo = new BaseRepository<Account>('Accounts');
export const cardsRepo = new BaseRepository<Card>('Cards');
export const budgetsRepo = new BaseRepository<Budget>('Budgets');
export const billsRepo = new BaseRepository<Bill>('Bills');
export const recurringExpensesRepo = new BaseRepository<any>('RecurringExpenses');
export const mobilePlansRepo = new BaseRepository<any>('MobilePlans');
export const groceryRepo = new BaseRepository<any>('Grocery');
export const goalsRepo = new BaseRepository<Goal>('Goals');
export const futurePlansRepo = new BaseRepository<any>('FuturePlans');
export const paymentMethodsRepo = new BaseRepository<any>('PaymentMethods');
export const activityLogRepo = new BaseRepository<any>('ActivityLog');
