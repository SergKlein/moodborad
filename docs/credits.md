# Credit System for Content Generation

## Overview

This document outlines the architecture and implementation details for an internal credit system that controls and limits content generation capabilities. The system replaces direct Stripe integration with an admin-controlled approach for allocating and managing user credits.

## Core Concepts

- **Credits**: Units that users consume when generating content
- **Plans**: Pre-defined packages with specific credit allocations and features
- **Cycles**: Time periods after which credits may refresh (daily, weekly, monthly)
- **Teams**: Account groups that share a credit allocation

## Data Model

### Adapting Existing Tables

We repurpose the existing Stripe-related fields in the database to maintain compatibility while avoiding complex migrations:

**In `teams` table:**

| Original Field | New Purpose | Description |
|----------------|-------------|-------------|
| `stripeProductId` | `planId` | Identifier for the assigned plan |
| `planName` | `planName` | Human-readable name of the plan |
| `subscriptionStatus` | `creditStatus` | Status of team's credits (active, exhausted, suspended) |

**Additional fields to add to `teams`:**

```sql
ALTER TABLE "teams" ADD COLUMN "credits_total" integer DEFAULT 0;
ALTER TABLE "teams" ADD COLUMN "credits_used" integer DEFAULT 0;
ALTER TABLE "teams" ADD COLUMN "credits_reset_at" timestamp;
```

### New Tables

**Plans Table:**

```sql
CREATE TABLE "plans" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(100) NOT NULL,
  "description" text,
  "credits_per_cycle" integer NOT NULL,
  "cycle_period" varchar(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  "features" jsonb,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

**Credit Usage Table:**

```sql
CREATE TABLE "credit_usage" (
  "id" serial PRIMARY KEY NOT NULL,
  "team_id" integer NOT NULL REFERENCES "teams"("id"),
  "user_id" integer NOT NULL REFERENCES "users"("id"),
  "amount" integer NOT NULL,
  "operation" varchar(100) NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

## API Endpoints

### Admin API

#### Plans Management

```
GET    /api/admin/plans            - List all plans
POST   /api/admin/plans            - Create a new plan
GET    /api/admin/plans/:id        - Get plan details
PUT    /api/admin/plans/:id        - Update a plan
DELETE /api/admin/plans/:id        - Deactivate a plan
```

#### Team Credit Management

```
GET    /api/admin/teams/:id/credits           - Get team credits info
POST   /api/admin/teams/:id/assign-plan       - Assign plan to team
POST   /api/admin/teams/:id/adjust-credits    - Add or remove credits manually
POST   /api/admin/teams/:id/reset-credits     - Reset credits to plan default
```

### User API

```
GET    /api/teams/:id/credits                 - Get remaining credits
GET    /api/teams/:id/credit-usage            - Get credit usage history
POST   /api/content/generate                  - Generate content (consumes credits)
```

## Core Functions

### Credit Management

```typescript
/**
 * Check if a team has sufficient credits for an operation
 */
export async function checkCredits(
  teamId: number, 
  requiredAmount: number = 1
): Promise<{
  sufficient: boolean, 
  available: number,
  status: string
}> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team) {
    return { sufficient: false, available: 0, status: 'not_found' };
  }
  
  // Check if credits have expired and need reset
  if (team.creditsReset && new Date() > team.creditsReset) {
    await resetCredits(teamId);
    // Refetch team data after reset
    return checkCredits(teamId, requiredAmount);
  }
  
  const available = (team.creditsTotal || 0) - (team.creditsUsed || 0);
  
  return {
    sufficient: available >= requiredAmount && team.creditStatus === 'active',
    available,
    status: team.creditStatus
  };
}

/**
 * Deduct credits for a content generation operation
 */
export async function deductCredits(
  teamId: number,
  userId: number,
  amount: number,
  operation: string,
  metadata?: any
): Promise<{ 
  success: boolean, 
  remaining: number, 
  status: string 
}> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team || team.creditStatus !== 'active') {
    return { 
      success: false, 
      remaining: 0, 
      status: team?.creditStatus || 'not_found' 
    };
  }
  
  const creditsUsed = (team.creditsUsed || 0) + amount;
  
  // Check if this operation would exhaust credits
  if (creditsUsed > (team.creditsTotal || 0)) {
    await db.update(teams)
      .set({ creditStatus: 'exhausted' })
      .where(eq(teams.id, teamId));
    
    return { success: false, remaining: 0, status: 'exhausted' };
  }
  
  // Log the credit usage
  await db.insert(creditUsage).values({
    teamId,
    userId,
    amount,
    operation,
    metadata: metadata ? JSON.stringify(metadata) : null
  });
  
  // Update the team's credit usage
  await db.update(teams)
    .set({ 
      creditsUsed,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
  
  return { 
    success: true, 
    remaining: (team.creditsTotal || 0) - creditsUsed,
    status: 'active'
  };
}
```

### Plan Management

```typescript
/**
 * Assign a plan to a team 
 */
export async function assignPlan(
  teamId: number,
  planId: number,
  customCredits?: number
): Promise<boolean> {
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId)
  });
  
  if (!plan || !plan.isActive) {
    throw new Error('Plan not found or inactive');
  }
  
  // Calculate next reset date based on cycle period
  const nextReset = calculateNextResetDate(plan.cyclePeriod);
  
  await db.update(teams)
    .set({
      stripeProductId: String(planId), // Reuse existing field
      planName: plan.name,
      creditStatus: 'active',
      creditsTotal: customCredits || plan.creditsPerCycle,
      creditsUsed: 0,
      creditsReset: nextReset,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
    
  // Log this operation in activity logs
  await db.insert(activityLogs).values({
    teamId,
    action: ActivityType.PLAN_ASSIGNED,
    timestamp: new Date(),
    metadata: JSON.stringify({
      planId,
      planName: plan.name,
      creditsAllocated: customCredits || plan.creditsPerCycle
    })
  });
  
  return true;
}

/**
 * Calculate the next reset date based on cycle period
 */
function calculateNextResetDate(cyclePeriod: string): Date {
  const now = new Date();
  
  switch (cyclePeriod.toLowerCase()) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      now.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      now.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      break;
    default:
      // No reset by default
      now.setFullYear(now.getFullYear() + 100);
  }
  
  return now;
}
```

## Integration with Content Generation

```typescript
/**
 * Generate content while handling credit checks and deductions
 */
export async function generateContent(
  teamId: number,
  userId: number,
  prompt: string,
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  // Calculate operation cost based on prompt complexity
  const operationCost = calculateOperationCost(prompt, options);
  
  // Check if team has sufficient credits
  const creditCheck = await checkCredits(teamId, operationCost);
  
  if (!creditCheck.sufficient) {
    return {
      success: false,
      error: 'insufficient_credits',
      message: `Insufficient credits. Required: ${operationCost}, Available: ${creditCheck.available}`,
      remainingCredits: creditCheck.available
    };
  }
  
  try {
    // Attempt to generate content
    const generatedContent = await aiService.generateContent(prompt, options);
    
    // Deduct credits for successful generation
    const deduction = await deductCredits(
      teamId, 
      userId, 
      operationCost, 
      'content_generation',
      { promptLength: prompt.length, options }
    );
    
    return {
      success: true,
      content: generatedContent,
      cost: operationCost,
      remainingCredits: deduction.remaining
    };
  } catch (error) {
    // Don't deduct credits for failed generation
    return {
      success: false,
      error: 'generation_failed',
      message: error.message,
      remainingCredits: creditCheck.available
    };
  }
}

/**
 * Calculate the credit cost of a content generation operation
 */
function calculateOperationCost(
  prompt: string,
  options: GenerationOptions
): number {
  // Basic cost calculation - can be enhanced with more sophisticated logic
  let cost = 1; // Base cost
  
  // Adjust based on prompt length
  if (prompt.length > 200) cost += Math.floor(prompt.length / 200);
  
  // Adjust based on requested quality/complexity
  if (options.quality === 'high') cost *= 2;
  if (options.complexity === 'detailed') cost *= 1.5;
  
  return Math.max(1, Math.round(cost)); // Minimum cost is 1 credit
}
```

## Admin Panel Features

The admin panel provides a user interface for managing the credit system:

1. **Plans Management:**
   - Create and edit plans with different credit allocations
   - Set cycle periods for automatic credit refreshes
   - Activate/deactivate plans

2. **Credit Management:**
   - View credit status for all teams
   - Manually adjust credit allocations
   - Reset credits for specific teams
   - Override plan defaults with custom credit amounts

3. **Usage Analytics:**
   - Track credit consumption patterns
   - View usage history by team, user, and operation type
   - Generate reports on peak usage periods

## User-Facing Features

1. **Credit Status:**
   - Display current credit balance
   - Show credit refresh date
   - Visualize credit usage history

2. **Usage Transparency:**
   - Show credit cost before generation
   - Provide usage history
   - Send notifications for low credit balance

3. **Plan Information:**
   - Display current plan details
   - Show available features
   - Compare with other available plans

## Implementation Plan

### Phase 1: Database Setup

1. Create necessary schema migrations
2. Define type interfaces and relationships
3. Set up data validation schemas

### Phase 2: Core API Development

1. Implement credits management functions
2. Develop plan management system
3. Create usage tracking mechanisms

### Phase 3: Admin Interface

1. Build plan management UI
2. Develop credit management tools
3. Create analytics dashboards

### Phase 4: User Integration

1. Implement credit checks in content generation flow
2. Develop user dashboard for credit visibility
3. Add notifications for credit status changes

### Phase 5: Testing and Optimization

1. Test credit allocation and deduction logic
2. Validate cycle reset functionality
3. Optimize credit calculation algorithms

## Cron Jobs and Automation

1. **Credit Reset Job:**
   - Runs daily to check for teams needing credit refresh
   - Resets credits based on cycle period configuration
   - Logs reset operations in the activity logs

2. **Usage Report Job:**
   - Sends periodic usage reports to administrators
   - Identifies unusual usage patterns
   - Provides insights for plan optimization

## Conclusion

This credit system provides a flexible and customizable way to control content generation capabilities without requiring external payment processing. By repurposing existing database structures and implementing internal management tools, we can offer granular control over resource allocation while maintaining the ability to introduce paid plans in the future if needed.

The separation of plan definition, credit management, and usage tracking provides a solid foundation that can be extended with additional features as requirements evolve. 