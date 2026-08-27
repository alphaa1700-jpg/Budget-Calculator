const REQUIRED_SHEETS = [
  { title: 'Settings', headers: ['id', 'key', 'value', 'description', 'updatedAt'] },
  { title: 'Categories', headers: ['id', 'name', 'type', 'icon', 'color', 'description', 'isDefault', 'status', 'createdAt', 'updatedAt'] },
  { title: 'Transactions', headers: ['id', 'date', 'type', 'amount', 'categoryId', 'accountId', 'paymentMethodId', 'description', 'notes', 'merchant', 'tags', 'isRecurring', 'recurringExpenseId', 'createdAt', 'updatedAt', 'status'] },
  { title: 'Income', headers: ['id', 'date', 'source', 'amount', 'accountId', 'description', 'notes', 'recurring', 'createdAt', 'updatedAt', 'status'] },
  { title: 'Accounts', headers: ['id', 'name', 'type', 'openingBalance', 'currentBalance', 'description', 'status', 'createdAt', 'updatedAt'] },
  { title: 'Cards', headers: ['id', 'name', 'bank', 'cardType', 'creditLimit', 'statementDate', 'dueDate', 'currentOutstanding', 'accountId', 'notes', 'status', 'last4', 'createdAt', 'updatedAt'] },
  { title: 'Budgets', headers: ['id', 'month', 'categoryId', 'budgetAmount', 'notes', 'status', 'createdAt', 'updatedAt'] },
  { title: 'Bills', headers: ['id', 'name', 'categoryId', 'amount', 'dueDate', 'frequency', 'accountId', 'isRecurring', 'notes', 'status', 'createdAt', 'updatedAt'] },
  { title: 'RecurringExpenses', headers: ['id', 'name', 'amount', 'categoryId', 'accountId', 'frequency', 'nextDueDate', 'description', 'autoCreate', 'status', 'createdAt', 'updatedAt'] },
  { title: 'MobilePlans', headers: ['id', 'name', 'provider', 'phoneLabel', 'amount', 'validityDays', 'rechargeDate', 'nextRechargeDate', 'notes', 'status', 'createdAt', 'updatedAt'] },
  { title: 'Grocery', headers: ['id', 'date', 'item', 'category', 'amount', 'quantity', 'unit', 'store', 'notes', 'createdAt', 'updatedAt', 'status'] },
  { title: 'Goals', headers: ['id', 'name', 'targetAmount', 'currentAmount', 'targetDate', 'monthlyContribution', 'priority', 'description', 'status', 'createdAt', 'updatedAt'] },
  { title: 'FuturePlans', headers: ['id', 'name', 'targetAmount', 'targetDate', 'priority', 'monthlyRequired', 'categoryId', 'description', 'status', 'createdAt', 'updatedAt'] },
  { title: 'PaymentMethods', headers: ['id', 'name', 'type', 'description', 'status', 'createdAt', 'updatedAt'] },
  { title: 'ActivityLog', headers: ['id', 'timestamp', 'action', 'entityType', 'entityId', 'description', 'createdAt'] }
];

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    if (action === 'setup') return handleSetup();
    
    const sheetName = params.sheetName;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) return errorResponse("Sheet not found: " + sheetName);
    
    if (action === 'getAll') return handleGetAll(sheet);
    if (action === 'getById') return handleGetById(sheet, params.id);
    if (action === 'create') return handleCreate(sheet, params.data);
    if (action === 'update') return handleUpdate(sheet, params.id, params.data);
    if (action === 'delete') return handleDelete(sheet, params.id);
    
    return errorResponse("Unknown action");
  } catch (err) {
    return errorResponse(err.toString());
  }
}

function doGet(e) {
  return successResponse({ status: "API is active" });
}

function handleSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const results = [];
  
  REQUIRED_SHEETS.forEach(req => {
    let sheet = ss.getSheetByName(req.title);
    if (!sheet) {
      sheet = ss.insertSheet(req.title);
      results.push("Created sheet: " + req.title);
    }
    
    // Set headers
    const headerRange = sheet.getRange(1, 1, 1, req.headers.length);
    headerRange.setValues([req.headers]);
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  });
  
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
  
  return successResponse({ message: "Setup complete", results: results });
}

function handleGetAll(sheet) {
  const data = getSheetDataAsObjects(sheet);
  return successResponse(data);
}

function handleGetById(sheet, id) {
  const data = getSheetDataAsObjects(sheet);
  const record = data.find(r => r.id === id);
  return successResponse(record || null);
}

function handleCreate(sheet, data) {
  const headers = getHeaders(sheet);
  const rowData = headers.map(h => data[h] !== undefined ? data[h] : "");
  sheet.appendRow(rowData);
  return successResponse(data);
}

function handleUpdate(sheet, id, data) {
  const headers = getHeaders(sheet);
  const allData = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  const idColumnIndex = headers.indexOf('id');
  
  if (idColumnIndex === -1) return errorResponse("No 'id' column found");
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idColumnIndex] === id) {
      rowIndex = i + 1; // 1-based index for sheet rows
      break;
    }
  }
  
  if (rowIndex === -1) return errorResponse("Record not found");
  
  // Update only the provided fields
  for (const key in data) {
    const colIndex = headers.indexOf(key);
    if (colIndex !== -1) {
      sheet.getRange(rowIndex, colIndex + 1).setValue(data[key]);
    }
  }
  
  return successResponse({ id: id, updated: true });
}

function handleDelete(sheet, id) {
  const headers = getHeaders(sheet);
  const allData = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  const idColumnIndex = headers.indexOf('id');
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idColumnIndex] === id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) return errorResponse("Record not found");
  
  sheet.deleteRow(rowIndex);
  return successResponse({ deleted: true });
}

// Helpers
function getHeaders(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function getSheetDataAsObjects(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow <= 1) return []; // Only headers or empty
  
  const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = data[0];
  const objects = [];
  
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j] !== "" ? data[i][j] : null;
    }
    objects.push(obj);
  }
  
  return objects;
}

function successResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(errorMsg) {
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: errorMsg }))
    .setMimeType(ContentService.MimeType.JSON);
}
