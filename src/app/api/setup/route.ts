import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!url) {
      throw new Error("GOOGLE_APPS_SCRIPT_URL is not set in environment variables");
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'setup' }),
      cache: 'no-store'
    });

    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Initialization complete',
      results: result.data?.results || []
    });

  } catch (error: any) {
    console.error('Setup failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
