const fs = require('fs');
const path = require('path');

function processForms() {
  const formsDir = 'src/components/forms';
  const formFiles = fs.readdirSync(formsDir).filter(f => f.endsWith('.tsx'));
  
  formFiles.forEach(f => {
    const fullPath = path.join(formsDir, f);
    let c = fs.readFileSync(fullPath, 'utf8');

    // Make sure we have updateRecord imported
    if (!c.includes('updateRecord')) {
      c = c.replace(/createRecord[a-zA-Z,]*/g, match => match + ', updateRecord');
    }

    // Replace the defaultValues to use initialData if present
    // E.g. defaultValues: initialData || { ... }
    if (!c.includes('initialData ||')) {
      c = c.replace(/defaultValues: \{/, 'defaultValues: initialData || {');
    }
    
    // For ExpenseForm which uses date
    if (f === 'ExpenseForm.tsx') {
      if (!c.includes('initialData?: any')) {
        c = c.replace(/interface ExpenseFormProps \{/, 'interface ExpenseFormProps {\n  initialData?: any;');
        c = c.replace(/transactionType = "EXPENSE" \}: ExpenseFormProps\) \{/, 'transactionType = "EXPENSE", initialData }: ExpenseFormProps) {');
        c = c.replace(/defaultValues: \{/, 'defaultValues: initialData ? { ...initialData, date: new Date(initialData.date) } : {');
        
        const newSubmit = `
    setIsSubmitting(true);
    try {
      let result;
      const dataToSave = { ...data, date: data.date.toISOString() };
      
      if (initialData?.id) {
        result = await updateRecord("Transactions", initialData.id, dataToSave);
      } else {
        result = await createRecord("Transactions", dataToSave);
      }
      
      if (result.success) {
        toast.success(initialData?.id ? "Updated successfully" : "Added successfully");
        if (!initialData?.id) form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }`;
        c = c.replace(/setIsSubmitting\(true\);\s+try \{[\s\S]*?\} finally \{\s+setIsSubmitting\(false\);\s+\}/, newSubmit.trim());
      }
    }

    fs.writeFileSync(fullPath, c);
  });
}

function processPages() {
  const appDir = 'src/app';
  const pageMap = {
    'accounts': { form: 'AccountForm', item: 'acc', sheet: 'Accounts' },
    'cards': { form: 'CardForm', item: 'card', sheet: 'Cards' },
    'bills': { form: 'BillForm', item: 'bill', sheet: 'Bills' },
    'goals': { form: 'GoalForm', item: 'goal', sheet: 'Goals' },
    'grocery': { form: 'GroceryForm', item: 'g', sheet: 'Grocery' },
    'mobile-plans': { form: 'MobilePlanForm', item: 'plan', sheet: 'MobilePlans' },
    'future-plans': { form: 'FuturePlanForm', item: 'plan', sheet: 'FuturePlans' },
    'budget': { form: 'BudgetForm', item: 'b', sheet: 'Budgets' },
    'expenses': { form: 'ExpenseForm', item: 'tx', sheet: 'Transactions' },
    'income': { form: 'ExpenseForm', item: 'tx', sheet: 'Transactions' }
  };

  for (const [route, info] of Object.entries(pageMap)) {
    const pagePath = path.join(appDir, route, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;

    let c = fs.readFileSync(pagePath, 'utf8');
    
    // add editForm to DataTableActions
    const searchRegex = new RegExp(`<DataTableActions([^>]*)recordId=\\{([^}]+)\\.id\\}([^>]*)/>`, 'g');
    c = c.replace(searchRegex, (match, p1, itemVar, p3) => {
      if (match.includes('editForm=')) return match; // already patched
      // For expense form, we pass categories
      const extraProps = info.form === 'ExpenseForm' ? ' categories={categories}' : '';
      return `<DataTableActions${p1}recordId={${itemVar}.id}${p3}editForm={<${info.form} initialData={${itemVar}}${extraProps} />} />`;
    });

    fs.writeFileSync(pagePath, c);
  }
}

processForms();
processPages();
console.log("Edit features successfully patched!");
