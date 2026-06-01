import { getProjects } from '@/lib/db';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function Projets() {
  const projects = await getProjects();

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <h1 className="section-title" style={{ marginTop: '40px' }}>Mes Réalisations</h1>
      <p className="section-subtitle">
        Explorez mes projets académiques menés à l'IUT de Bordeaux et mes projets réalisés en milieu professionnel (stages et missions).
      </p>

      <ProjectsClient initialProjects={projects} />
    </div>
  );
}
