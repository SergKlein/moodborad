import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Room service
 * Handles room management operations
 */
export type RoomServiceTypes = {
  // Define types here
};

/**
 * Room service with methods for managing rooms
 */
export const roomService = {
  /**
   * Create a new room
   * @param projectId Project ID
   * @param data Room data
   * @returns The created room
   */
  async create(projectId: string, data: any) {
    return db.insert(rooms).values({
      ...data,
      projectId: parseInt(projectId)
    });
  },

  /**
   * Get all rooms for a project
   * @param projectId Project ID
   * @returns Array of rooms
   */
  async getRoomsByProject(projectId: string) {
    return db.query.rooms.findMany({
      where: (rooms, { eq }) => eq(rooms.projectId, parseInt(projectId))
    });
  },

  /**
   * Get a room by ID
   * @param roomId Room ID
   * @returns The room or null if not found
   */
  async getById(roomId: string) {
    return db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.id, parseInt(roomId))
    });
  },

  /**
   * Update a room
   * @param roomId Room ID
   * @param data Room data to update
   * @returns The updated room
   */
  async update(roomId: string, data: any) {
    return db.update(rooms)
      .set(data)
      .where(eq(rooms.id, parseInt(roomId)));
  },

  /**
   * Delete a room
   * @param roomId Room ID
   * @returns Success status
   */
  async delete(roomId: string) {
    return db.delete(rooms)
      .where(eq(rooms.id, parseInt(roomId)));
  },

  /**
   * Get room with all spaces
   * @param roomId Room ID
   * @returns Room with spaces
   */
  async getRoomWithSpaces(roomId: string) {
    return db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.id, parseInt(roomId)),
      with: {
        spaces: true
      }
    });
  }
}; 