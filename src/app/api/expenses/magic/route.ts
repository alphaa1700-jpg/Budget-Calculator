import { NextResponse } from "next/server";
import { transactionsRepo, categoriesRepo } from "@/lib/repositories";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    // 1. Extract amount using regex (matches numbers optionally with decimals)
    const amountMatch = text.match(/\d+(\.\d{1,2})?/);
    if (!amountMatch) {
      return NextResponse.json({ error: "Could not find an amount in the text" }, { status: 400 });
    }
    const amount = parseFloat(amountMatch[0]);

    // 2. Extract description by removing the amount
    let desc = text.replace(amountMatch[0], '').trim();
    // Remove common filler words and currency symbols
    desc = desc.replace(/[₹$€£]/g, '').trim();
    desc = desc.replace(/^(for|on|at)\s+/i, '').trim();

    // 3. Find the best category match
    let categories: any[] = [];
    try {
      categories = await categoriesRepo.getAll();
    } catch(e) {
      console.error(e);
    }

    let matchedCategory = categories.find(c => c.name.toLowerCase() === 'uncategorized') || categories[0];
    
    // Simple heuristic: check if any category name is contained within the description text
    const lowerDesc = desc.toLowerCase();
    for (const cat of categories) {
      if (!cat.name) continue;
      const catName = cat.name.toLowerCase();
      // If the user typed "uber", and category is "Travel", we might miss it unless we have keyword tags.
      // But if user typed "groceries" and category is "Groceries", it's a hit.
      if (lowerDesc.includes(catName)) {
        matchedCategory = cat;
        break;
      }
      
      // Basic keyword mapping for common expenses if category names don't match exactly
      const keywords = {
        'food': ['zomato', 'swiggy', 'restaurant', 'dinner', 'lunch', 'breakfast', 'coffee', 'starbucks'],
        'travel': ['uber', 'ola', 'taxi', 'cab', 'flight', 'train', 'bus', 'fuel', 'petrol'],
        'shopping': ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes'],
        'groceries': ['reliance', 'dmart', 'fresh', 'milk', 'vegetables', 'blinkit', 'zepto', 'instamart'],
        'utilities': ['electricity', 'water', 'wifi', 'internet', 'recharge', 'jio', 'airtel'],
        'entertainment': ['movie', 'netflix', 'spotify', 'prime', 'ticket']
      };

      for (const [key, words] of Object.entries(keywords)) {
        if (catName.includes(key)) {
          if (words.some(w => lowerDesc.includes(w))) {
            matchedCategory = cat;
            break;
          }
        }
      }
    }

    // 4. Save to Google Sheets via Repository
    const newTx = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: desc.substring(0, 50),
      amount: amount,
      categoryId: matchedCategory?.id || '',
      type: 'EXPENSE',
      merchant: desc.substring(0, 30) // Guessing merchant from description
    };

    await transactionsRepo.create(newTx);

    return NextResponse.json({ 
      success: true, 
      amount, 
      description: desc, 
      categoryName: matchedCategory?.name || 'Uncategorized' 
    });

  } catch (error) {
    console.error("Magic Add Error:", error);
    return NextResponse.json({ error: "Failed to process magic add" }, { status: 500 });
  }
}
