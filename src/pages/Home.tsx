import Hero from '../components/Hero';
import Features from '../components/Features';
import TicketBrowser from '../components/TicketBrowser';
import IssuerCTA from '../components/IssuerCTA';

export default function Home() {
  return (
    <>
          <Hero />
          <Features />
          <TicketBrowser />
          <IssuerCTA />
    </>
  );
}
