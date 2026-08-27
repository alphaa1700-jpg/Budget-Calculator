"use server";

import { revalidatePath } from "next/cache";
import * as repos from "@/lib/repositories";

// Generic helper to get the right repository
function getRepo(sheetName: string) {
  const repoMap: Record<string, any> = {
    'Transactions': repos.transactionsRepo,
    'Categories': repos.categoriesRepo,
    'Accounts': repos.accountsRepo,
    'Cards': repos.cardsRepo,
    'Budgets': repos.budgetsRepo,
    'Bills': repos.billsRepo,
    'Goals': repos.goalsRepo,
    'Grocery': repos.groceryRepo,
    'MobilePlans': repos.mobilePlansRepo,
    'FuturePlans': repos.futurePlansRepo,
  };
  return repoMap[sheetName];
}

export async function createRecord(sheetName: string, data: any) {
  try {
    const repo = getRepo(sheetName);
    if (!repo) throw new Error(`Invalid sheet name: ${sheetName}`);
    
    const record = await repo.create(data);
    
    // Revalidate the entire app layout to ensure fresh data everywhere
    revalidatePath("/", "layout");
    
    return { success: true, data: record };
  } catch (error: any) {
    console.error(`Error creating in ${sheetName}:`, error);
    return { success: false, error: error.message || "Failed to create record" };
  }
}

export async function updateRecord(sheetName: string, id: string, data: any) {
  try {
    const repo = getRepo(sheetName);
    if (!repo) throw new Error(`Invalid sheet name: ${sheetName}`);
    
    const success = await repo.update(id, data);
    
    revalidatePath("/", "layout");
    
    return { success };
  } catch (error: any) {
    console.error(`Error updating in ${sheetName}:`, error);
    return { success: false, error: error.message || "Failed to update record" };
  }
}

export async function deleteRecord(sheetName: string, id: string) {
  try {
    const repo = getRepo(sheetName);
    if (!repo) throw new Error(`Invalid sheet name: ${sheetName}`);
    
    const success = await repo.delete(id);
    
    revalidatePath("/", "layout");
    
    return { success };
  } catch (error: any) {
    console.error(`Error deleting from ${sheetName}:`, error);
    return { success: false, error: error.message || "Failed to delete record" };
  }
}

// Backwards compatibility for ExpenseForm
export async function createExpense(data: any) {
  return createRecord('Transactions', data);
}
export async function deleteExpense(id: string) {
  return deleteRecord('Transactions', id);
}
