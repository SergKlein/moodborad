import { Check } from 'lucide-react';
import { getPlans } from '@/modules/credits';
import { SubmitButton } from './submit-button';
import { getUserWithTeam } from '@/lib/db/queries';
import { getSession } from '@/lib/auth/session';
import { choosePlan } from './actions';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const session = await getSession();
  const user = session ? await getUserWithTeam(session.user.id) : null;
  const teamId = user?.teamId || 0;
  
  const plans = await getPlans();

  // Базовые планы
  const basicPlan = plans.find((plan) => plan.name === 'Basic');
  const proPlan = plans.find((plan) => plan.name === 'Pro');
  const enterprisePlan = plans.find((plan) => plan.name === 'Enterprise');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          name={basicPlan?.name || 'Basic'}
          creditsPerCycle={basicPlan?.creditsPerCycle || 100}
          cyclePeriod={basicPlan?.cyclePeriod || 'monthly'}
          features={[
            '100 credits per month',
            'Up to 1000 words per generation',
            'Email Support',
          ]}
          planId={basicPlan?.id?.toString()}
          teamId={teamId}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          creditsPerCycle={proPlan?.creditsPerCycle || 500}
          cyclePeriod={proPlan?.cyclePeriod || 'monthly'}
          features={[
            '500 credits per month',
            'Up to 5000 words per generation',
            'Priority Email Support',
          ]}
          planId={proPlan?.id?.toString()}
          teamId={teamId}
          highlighted={true}
        />
        <PricingCard
          name={enterprisePlan?.name || 'Enterprise'}
          creditsPerCycle={enterprisePlan?.creditsPerCycle || 2000}
          cyclePeriod={enterprisePlan?.cyclePeriod || 'monthly'}
          features={[
            '2000 credits per month',
            'Unlimited words per generation',
            '24/7 Priority Support',
            'Advanced Features Access',
          ]}
          planId={enterprisePlan?.id?.toString()}
          teamId={teamId}
        />
      </div>
    </main>
  );
}

function PricingCard({
  name,
  creditsPerCycle,
  cyclePeriod,
  features,
  planId,
  teamId,
  highlighted = false,
}: {
  name: string;
  creditsPerCycle: number;
  cyclePeriod: string;
  features: string[];
  planId?: string;
  teamId: number;
  highlighted?: boolean;
}) {
  const formattedPeriod = cyclePeriod === 'monthly' ? 'month' : cyclePeriod;
  
  return (
    <div className={`pt-6 rounded-lg border ${highlighted ? 'border-primary shadow-md' : 'border-gray-200'}`}>
      <div className="px-6 py-4">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
        <p className="text-4xl font-medium text-gray-900 mb-6">
          {creditsPerCycle} <span className="text-xl font-normal text-gray-600">credits / {formattedPeriod}</span>
        </p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <form action={choosePlan}>
          <input type="hidden" name="planId" value={planId} />
          <input type="hidden" name="teamId" value={teamId} />
          <SubmitButton label={`Choose ${name}`} />
        </form>
      </div>
    </div>
  );
}