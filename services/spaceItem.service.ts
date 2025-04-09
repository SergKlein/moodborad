import { db } from '@/lib/db';
import { spaceItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Space Item service
 * Handles space item management operations
 */
export type SpaceItemServiceTypes = {
  // Define types here
};

/**
 * Space Item service with methods for managing space items
 */
export const spaceItemService = {
  /**
   * Create a new space item
   * @param spaceId Space ID
   * @param data Item data
   * @returns The created space item
   */
  async create(spaceId: string, data: any) {
    return db.insert(spaceItems).values({
      ...data,
      spaceId: parseInt(spaceId)
    });
  },

  /**
   * Get all items for a space
   * @param spaceId Space ID
   * @returns Array of space items
   */
  async getItemsBySpace(spaceId: string) {
    return db.query.spaceItems.findMany({
      where: (items, { eq }) => eq(items.spaceId, parseInt(spaceId))
    });
  },

  /**
   * Get a space item by ID
   * @param itemId Item ID
   * @returns The space item or null if not found
   */
  async getById(itemId: string) {
    return db.query.spaceItems.findFirst({
      where: (items, { eq }) => eq(items.id, parseInt(itemId))
    });
  },

  /**
   * Update a space item
   * @param itemId Item ID
   * @param data Item data to update
   * @returns The updated space item
   */
  async update(itemId: string, data: any) {
    return db.update(spaceItems)
      .set(data)
      .where(eq(spaceItems.id, parseInt(itemId)));
  },

  /**
   * Update position and size of a space item
   * @param itemId Item ID
   * @param position New position
   * @param size New size
   * @returns The updated space item
   */
  async updatePositionAndSize(itemId: string, position: any, size: any) {
    return db.update(spaceItems)
      .set({ position, size })
      .where(eq(spaceItems.id, parseInt(itemId)));
  },

  /**
   * Delete a space item
   * @param itemId Item ID
   * @returns Success status
   */
  async delete(itemId: string) {
    return db.delete(spaceItems)
      .where(eq(spaceItems.id, parseInt(itemId)));
  },

  /**
   * Update z-index of a space item
   * @param itemId Item ID
   * @param zIndex New z-index
   * @returns The updated space item
   */
  async updateZIndex(itemId: string, zIndex: number) {
    return db.update(spaceItems)
      .set({ 
        style: { 
          ...spaceItems.style,
          zIndex 
        } 
      })
      .where(eq(spaceItems.id, parseInt(itemId)));
  }
}; 