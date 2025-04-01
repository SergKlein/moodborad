import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../lib/db/drizzle';
import { put, del, list } from '@vercel/blob';
import { sql } from 'drizzle-orm';

describe('Infrastructure Connections', () => {
  describe('Database Connection', () => {
    test('should connect to database and execute query', async () => {
      const result = await db.execute(sql`SELECT NOW() as current_time`);
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      const timestamp = new Date(result[0].current_time);
      expect(timestamp.getTime()).not.toBeNaN();
      expect(timestamp.getFullYear()).toBeGreaterThan(2000);
    });

    test('should handle database transactions', async () => {
      const testTable = 'connection_test';
      
      // Create temporary test table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS ${sql.identifier(testTable)} (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);

      try {
        // Test transaction
        await db.transaction(async (tx) => {
          await tx.execute(sql`
            INSERT INTO ${sql.identifier(testTable)} DEFAULT VALUES
          `);
        });

        // Verify insertion
        const result = await db.execute(sql`
          SELECT COUNT(*)::integer as count FROM ${sql.identifier(testTable)}
        `);
        expect(result[0].count).toBeGreaterThan(0);

      } finally {
        // Cleanup
        await db.execute(sql`
          DROP TABLE IF EXISTS ${sql.identifier(testTable)}
        `);
      }
    });
  });

  describe('Blob Storage Connection', () => {
    const testFiles = {
      text: {
        name: 'test.txt',
        content: 'Hello, World!',
        type: 'text/plain'
      },
      json: {
        name: 'test.json',
        content: JSON.stringify({ hello: 'world' }),
        type: 'application/json'
      }
    };

    const createdUrls: string[] = [];

    afterAll(async () => {
      // Cleanup all created test blobs
      await Promise.all(
        createdUrls.map(url => del(url).catch(() => null))
      );
    });

    test('should upload and retrieve text file', async () => {
      const { text } = testFiles;
      const blob = new Blob([text.content], { type: text.type });
      
      const { url } = await put(text.name, blob, {
        access: 'public',
        addRandomSuffix: true
      });

      createdUrls.push(url);

      expect(url).toMatch(/^https:\/\//);
      
      // Verify we can download the file
      const response = await fetch(url);
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(text.content);
    });

    test('should list blobs', async () => {
      const { json } = testFiles;
      const blob = new Blob([json.content], { type: json.type });
      
      const { url } = await put(json.name, blob, {
        access: 'public',
        addRandomSuffix: true
      });

      createdUrls.push(url);

      const { blobs } = await list();
      expect(Array.isArray(blobs)).toBe(true);
      
      // Verify our test blobs are in the list
      const testBlobs = blobs.filter(b => 
        createdUrls.includes(b.url)
      );
      expect(testBlobs.length).toBeGreaterThan(0);
    });

    test('should delete blob', async () => {
      const { text } = testFiles;
      const blob = new Blob([text.content], { type: text.type });
      
      const { url } = await put(text.name, blob, {
        access: 'public',
        addRandomSuffix: true
      });

      // Delete the blob
      await del(url);

      // Verify blob is deleted
      const { blobs } = await list();
      const deletedBlob = blobs.find(b => b.url === url);
      expect(deletedBlob).toBeUndefined();
    });
  });
}); 