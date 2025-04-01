// import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers, plans } from './schema';
import { hashPassword } from '@/lib/auth/session';
import { CyclePeriod } from '@/modules/credits/types';

async function createDefaultPlans() {
  console.log('Creating default credit plans...');

  await db.insert(plans).values([
    {
      name: 'Basic',
      description: 'Basic plan with limited credits',
      creditsPerCycle: 100,
      cyclePeriod: CyclePeriod.MONTHLY,
      isActive: true,
      features: JSON.stringify({
        maxPromptLength: 1000,
        supportPriority: 'standard'
      })
    },
    {
      name: 'Pro',
      description: 'Professional plan with more credits',
      creditsPerCycle: 500,
      cyclePeriod: CyclePeriod.MONTHLY,
      isActive: true,
      features: JSON.stringify({
        maxPromptLength: 5000,
        supportPriority: 'high'
      })
    },
    {
      name: 'Enterprise',
      description: 'Enterprise plan with unlimited credits',
      creditsPerCycle: 2000,
      cyclePeriod: CyclePeriod.MONTHLY,
      isActive: true,
      features: JSON.stringify({
        maxPromptLength: 10000,
        supportPriority: 'priority'
      })
    }
  ]);

  console.log('Default credit plans created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "owner",
      },
    ])
    .returning();

  console.log('Initial user created.');

  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  await createDefaultPlans();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
