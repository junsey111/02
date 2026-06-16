import Hero from '../components/home/Hero';
import ProjectsWall from '../components/home/ProjectsWall';
import ServicesGrid from '../components/home/ServicesGrid';
import ContactCTA from '../components/home/ContactCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsWall />
      <ServicesGrid />
      <ContactCTA />
    </main>
  );
}
