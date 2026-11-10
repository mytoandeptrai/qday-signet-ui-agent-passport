import { Hero } from '@/components/landing/hero';
import { ClosingSection, DaySection, HowSection, LineSection, LogoMarquee, SessionSection } from '@/components/landing/sections';
import { SiteFooter } from '@/components/landing/site-footer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Landing });

function Landing() {
  return (
    <main className='force-light bg-white text-foreground'>
      <Hero />
      <LogoMarquee />
      <SessionSection />
      <LineSection id='agents' text='Each job runs within a spending session.' link={{ label: 'How sessions work', href: '#' }} />
      <HowSection />
      <LineSection
        id='record'
        align='right'
        text='Every payment lands on one record: what was bought, from whom, and which task asked for it.'
        link={{ label: 'See your activity', to: '/activity' }}
      />
      <DaySection />
      <LineSection
        id='services'
        text='Your agent can pay for StablePhone, StableEnrich, Resy, Amazon, PostalForm, AgentFax and more: 2,000+ services.'
        link={{ label: 'Browse all services', to: '/explore' }}
      />
      <ClosingSection />
      <SiteFooter />
    </main>
  );
}
