import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { put, del, list } from '@vercel/blob';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
  try {
    // Test database connection
    const dbResult = await db.execute(sql`SELECT NOW()`);
    const dbConnected = !!dbResult;

    // Test blob storage
    const testBlobName = 'health-check-test.txt';
    const testContent = 'Health check test content';
    
    // Test blob write
    const { url } = await put(testBlobName, testContent, { access: 'public' });
    
    // Test blob read
    const { blobs } = await list();
    
    // Clean up test blob
    await del(testBlobName);
    
    const blobConnected = !!url && Array.isArray(blobs);

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: dbConnected,
        timestamp: new Date().toISOString()
      },
      blob: {
        connected: blobConnected,
        blobCount: blobs.length
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 