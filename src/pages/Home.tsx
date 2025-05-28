import Hero from '../components/Hero';
import Features from '../components/Features';
import TicketBrowser from '../components/TicketBrowser';
import IssuerCTA from '../components/IssuerCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
          <Hero />
          <Features />
          <TicketBrowser />
          <IssuerCTA />
          <Footer/>
    </>
  );
}
