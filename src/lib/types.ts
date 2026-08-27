export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = BaseEntity & {
  name: string;
  type: 'EXPENSE' | 'INCOME' | 'BOTH';
  icon?: string;
  color?: string;
  description?: string;
  isDefault?: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
};

export type Transaction = BaseEntity & {
  date: string; // ISO date string
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER' | 'REFUND';
  amount: number;
  categoryId: string;
  accountId: string;
  paymentMethodId?: string;
  description?: string;
  notes?: string;
  merchant?: string;
  tags?: string;
  isRecurring?: boolean;
  recurringExpenseId?: string;
  status?: string;
};

// ... More types will be added as needed
