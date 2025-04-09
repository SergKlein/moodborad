import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  json,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const projectVisibilityEnum = pgEnum('project_visibility', ['private', 'public']);
export const projectStatusEnum = pgEnum('project_status', ['active', 'archived']);
export const collaboratorRoleEnum = pgEnum('collaborator_role', ['viewer', 'editor', 'admin']);
export const taxonomyTypeEnum = pgEnum('taxonomy_type', ['room', 'space', 'idea', 'design', 'color', 'style', 'general']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planId: text('plan_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
  creditsTotal: integer('credits_total').default(0),
  creditsUsed: integer('credits_used').default(0),
  creditsReset: timestamp('credits_reset_at'),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  metadata: json('metadata'),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  creditsPerCycle: integer('credits_per_cycle').notNull(),
  cyclePeriod: varchar('cycle_period', { length: 20 }).notNull(),
  features: json('features'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const creditUsage = pgTable('credit_usage', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(),
  operation: varchar('operation', { length: 100 }).notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  visibility: projectVisibilityEnum('visibility').default('private').notNull(),
  designStyle: text('design_style'),
  colorPreferences: text('color_preferences'),
  budget: text('budget'),
  timeline: text('timeline'),
  notes: text('notes'),
  status: projectStatusEnum('status').default('active').notNull(),
  visibleToCollaboratorsWhenArchived: boolean('visible_to_collaborators_when_archived').default(false).notNull(),
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  projectId: serial('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name').notNull(),
  description: text('description'),
  type: varchar('type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const spaces = pgTable('spaces', {
  id: serial('id').primaryKey(),
  projectId: serial('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  roomId: serial('room_id').references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name').notNull(),
  description: text('description'),
  type: varchar('type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const spaceItems = pgTable('space_items', {
  id: serial('id').primaryKey(),
  spaceId: serial('space_id').references(() => spaces.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type').notNull(),
  content: jsonb('content'),
  position: jsonb('position'),
  size: jsonb('size'),
  style: jsonb('style'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectCollaborators = pgTable('project_collaborators', {
  id: serial('id').primaryKey(),
  role: collaboratorRoleEnum('role').default('viewer').notNull(),
  projectId: serial('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const taxonomies = pgTable('taxonomies', {
  id: serial('id').primaryKey(),
  type: taxonomyTypeEnum('type').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  parentId: integer('parent_id').references(() => taxonomies.id),
  order: integer('order').default(0),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taxonomiesTypeSlugIndex = unique('taxonomies_type_slug_idx').on(taxonomies.type, taxonomies.slug);

export const taxonomiesRelations = relations(taxonomies, ({ one, many }) => ({
  parent: one(taxonomies, {
    fields: [taxonomies.parentId],
    references: [taxonomies.id],
  }),
  children: many(taxonomies),
}));

export const projectTaxonomies = pgTable('project_taxonomies', {
  id: serial('id').primaryKey(),
  projectId: serial('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  taxonomyId: serial('taxonomy_id').references(() => taxonomies.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projectTaxonomiesIndex = unique('project_taxonomies_idx').on(projectTaxonomies.projectId, projectTaxonomies.taxonomyId);

export const projectTaxonomiesRelations = relations(projectTaxonomies, ({ one }) => ({
  project: one(projects, {
    fields: [projectTaxonomies.projectId],
    references: [projects.id],
  }),
  taxonomy: one(taxonomies, {
    fields: [projectTaxonomies.taxonomyId],
    references: [taxonomies.id],
  }),
}));

export const projectsRelationsWithTaxonomy = relations(projects, ({ many }) => ({
  taxonomies: many(projectTaxonomies),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  customers: many(customers),
  creditUsage: many(creditUsage),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  creditUsage: many(creditUsage),
  projects: many(projects),
  collaborations: many(projectCollaborators),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  team: one(teams, {
    fields: [customers.teamId],
    references: [teams.id],
  }),
}));

export const creditUsageRelations = relations(creditUsage, ({ one }) => ({
  team: one(teams, {
    fields: [creditUsage.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [creditUsage.userId],
    references: [users.id],
  }),
}));

export const projectRelations = relations(projects, ({ many }) => ({
  rooms: many(rooms),
  spaces: many(spaces),
  taxonomies: many(projectTaxonomies),
}));

export const roomRelations = relations(rooms, ({ one, many }) => ({
  project: one(projects, {
    fields: [rooms.projectId],
    references: [projects.id],
  }),
  spaces: many(spaces),
}));

export const spaceRelations = relations(spaces, ({ one, many }) => ({
  project: one(projects, {
    fields: [spaces.projectId],
    references: [projects.id],
  }),
  room: one(rooms, {
    fields: [spaces.roomId],
    references: [rooms.id],
  }),
  items: many(spaceItems),
}));

export const spaceItemRelations = relations(spaceItems, ({ one }) => ({
  space: one(spaces, {
    fields: [spaceItems.spaceId],
    references: [spaces.id],
  }),
}));

export const projectCollaboratorsRelations = relations(projectCollaborators, ({ one }) => ({
  project: one(projects, {
    fields: [projectCollaborators.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectCollaborators.userId],
    references: [users.id],
  }),
}));

export const boardsRelations = relations(spaces, ({ one, many }) => ({
  project: one(projects, {
    fields: [spaces.projectId],
    references: [projects.id],
  }),
  items: many(spaceItems),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
export type CreditUsage = typeof creditUsage.$inferSelect;
export type NewCreditUsage = typeof creditUsage.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
  PLAN_ASSIGNED = 'PLAN_ASSIGNED',
  CREDITS_UPDATED = 'CREDITS_UPDATED',
  CREDITS_RESET = 'CREDITS_RESET',
  CONTENT_GENERATED = 'CONTENT_GENERATED',
}
