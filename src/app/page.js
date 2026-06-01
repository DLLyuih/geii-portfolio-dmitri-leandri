import Link from 'next/link';
import Image from 'next/image';
import { getProfile, getSkills, getProjects } from '@/lib/db';
import { Mail, FileText, ArrowRight, CheckCircle2, Code2, Cpu, Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const profile = await getProfile();
  const allSkills = await getSkills();
  const allProjects = await getProjects();

  // Pick top 4 skills for quick overview
  const topSkills = allSkills.slice(0, 4);

  // Pick last 2 projects
  const latestProjects = allProjects.slice(-2).reverse();

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'GE';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-subtitle">{profile.institution || "IUT de Bordeaux"}</p>
          <h1 className="hero-title">{profile.name || "Alexandre Martin"}</h1>
          <p className="hero-desc">
            {profile.bio || "Étudiant en BUT Génie Électrique et Informatique Industrielle (GEII)."}
          </p>
          
          <div className="hero-buttons">
            <Link href="/parcours" className="btn btn-primary">
              Découvrir mon parcours <ArrowRight size={18} />
            </Link>
            {profile.cvUrl ? (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <FileText size={18} /> Télécharger mon CV (PDF)
              </a>
            ) : (
              <span className="btn btn-secondary" style={{ opacity: 0.6, cursor: 'not-allowed' }} title="CV non encore téléversé">
                <FileText size={18} /> CV (Non disponible)
              </span>
            )}
          </div>

          <div className="hero-socials">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="social-link" title="E-mail">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="hero-image-container">
          {profile.avatarUrl ? (
            <div className="hero-image-fallback" style={{ border: 'none', background: 'none' }}>
              <Image 
                src={profile.avatarUrl} 
                alt={profile.name} 
                width={320} 
                height={320} 
                className="hero-image-fallback" 
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="hero-image-fallback">
              {getInitials(profile.name)}
            </div>
          )}
        </div>
      </section>

      {/* Skills Highlight Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <h2 className="section-title">Mes Compétences Clés</h2>
        <p className="section-subtitle">
          Un aperçu de mes compétences acquises en formation BUT GEII et à travers mes projets personnels et professionnels.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '40px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <Code2 size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Programmation</h3>
            </div>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
              Développement embarqué et applicatif : C, C++, Python et outils web.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <Cpu size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Génie Électrique</h3>
            </div>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
              Conception de circuits électroniques analogiques et numériques, routage PCB (KiCad) et simulation.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <Wrench size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Informatique Industrielle</h3>
            </div>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
              Automatisme (Grafcet, Ladder), réseaux de terrain (Modbus) et systèmes de supervision.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/competences" className="btn btn-secondary">
            Voir toutes mes compétences <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <h2 className="section-title">Derniers Projets</h2>
        <p className="section-subtitle">
          Découvrez une sélection de mes réalisations académiques et professionnelles les plus récentes.
        </p>

        <div className="projects-grid" style={{ marginTop: '40px' }}>
          {latestProjects.map((project) => (
            <div key={project.id} className="card project-card">
              <div className="project-image-area">
                {project.mainImage ? (
                  <Image 
                    src={project.mainImage} 
                    alt={project.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Cpu />
                )}
                <span className="project-tag">{project.category === 'academique' ? 'Académique' : 'Professionnel'}</span>
              </div>
              <div className="project-body">
                <span className="project-date">{project.date}</span>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.shortDescription}</p>
                <div className="project-techs">
                  {project.technologies.split(',').map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
                <Link href={`/projets/${project.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                  En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link href="/projets" className="btn btn-primary">
            Voir tous les projets <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
