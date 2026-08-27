import { v4 as uuidv4 } from 'uuid';

export class BaseRepository<T extends { id?: string; createdAt?: string; updatedAt?: string; [key: string]: any }> {
  constructor(private sheetTitle: string) {}

  private async fetchScript(payload: any) {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!url) {
      throw new Error("GOOGLE_APPS_SCRIPT_URL is not set in environment variables");
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // Next.js config to disable caching for these requests
      cache: 'no-store' 
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown Apps Script Error');
    }

    return result.data;
  }

  async getAll(): Promise<T[]> {
    return this.fetchScript({ action: 'getAll', sheetName: this.sheetTitle });
  }

  async getById(id: string): Promise<T | null> {
    return this.fetchScript({ action: 'getById', sheetName: this.sheetTitle, id });
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date().toISOString();
    const newRecord = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    await this.fetchScript({ action: 'create', sheetName: this.sheetTitle, data: newRecord });
    return newRecord as unknown as T;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await this.fetchScript({ action: 'update', sheetName: this.sheetTitle, id, data: updatedData });
    
    // Ideally we'd return the merged row, but returning the patched data is close enough
    return { id, ...updatedData } as any; 
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.fetchScript({ action: 'delete', sheetName: this.sheetTitle, id });
    return !!result.deleted;
  }
}
