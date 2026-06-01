import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db';
import { Cpu, ArrowLeft, Calendar, Tag, FileDown, Layers, Flame, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProjetDetail({ params }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Back button */}
      <Link href="/projets" className="btn btn-secondary" style={{ marginTop: '24px', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Retour aux projets
      </Link>

      <h1 className="hero-title" style={{ marginTop: '32px', fontSize: '2.8rem' }}>{project.title}</h1>

      <div className="project-detail-layout">
        {/* Main Content */}
        <div className="project-detail-main">
          {/* Main Image Banner */}
          <div className="project-banner">
            {project.mainImage ? (
              <Image 
                src={project.mainImage} 
                alt={project.title} 
                width={800} 
                height={350} 
                style={{ objectFit: 'cover', borderRadius: 'var(--radius-md)', width: '100%', height: '100%' }}
              />
            ) : (
              <Cpu />
            )}
          </div>

          {/* Description Complète */}
          <section>
            <h2 className="detail-section-title">Présentation du Projet</h2>
            <p className="detail-text">{project.fullDescription || project.shortDescription}</p>
          </section>

          {/* Compétences Mobilisées */}
          {project.skillsMobilized && (
            <section>
              <h2 className="detail-section-title">Compétences GEII Mobilisées</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                {project.skillsMobilized.split(',').map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="tech-tag" 
                    style={{ 
                      fontSize: '0.9rem', 
                      padding: '8px 16px', 
                      backgroundColor: 'var(--primary-light)', 
                      borderRadius: '30px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Layers size={14} /> {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Difficultés rencontrées */}
          {project.difficulties && (
            <section>
              <h2 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} style={{ color: 'var(--accent)' }} /> Difficultés Rencontrées
              </h2>
              <p className="detail-text">{project.difficulties}</p>
            </section>
          )}

          {/* Résultats obtenus */}
          {project.results && (
            <section>
              <h2 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={20} style={{ color: 'var(--success)' }} /> Résultats Obtenus
              </h2>
              <p className="detail-text">{project.results}</p>
            </section>
          )}

          {/* Galerie d'images */}
          <section>
            <h2 className="detail-section-title">Galerie du Projet</h2>
            <div className="gallery-container">
              {project.galleryImages && project.galleryImages.length > 0 ? (
                project.galleryImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', height: '120px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <Image src={img} alt={`Galerie ${idx}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))
              ) : (
                <div className="gallery-empty">
                  Aucune photo supplémentaire disponible pour le moment.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="project-detail-sidebar">
          {/* Metadata Box */}
          <div className="sidebar-box">
            <h3 className="sidebar-title">Informations</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} style={{ color: 'var(--foreground-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>Date du projet</div>
                  <div style={{ fontWeight: 600 }}>{project.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Tag size={18} style={{ color: 'var(--foreground-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>Catégorie</div>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {project.category === 'academique' ? 'Projet Académique' : 'Projet Professionnel'}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginBottom: '8px' }}>Technologies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.technologies.split(',').map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dossiers Techniques */}
          <div className="sidebar-box">
            <h3 className="sidebar-title">Dossiers Techniques</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', marginBottom: '16px' }}>
              Documents d'évaluation et d'ingénierie rédigés lors de ce projet.
            </p>

            <div className="doc-buttons-list">
              {project.ddcFile ? (
                <a href={project.ddcFile} target="_blank" rel="noopener noreferrer" className="doc-btn" title="Télécharger le Dossier de Conception">
                  <span>Dossier de Conception (DDC)</span>
                  <FileDown size={16} />
                </a>
              ) : (
                <button className="doc-btn disabled" title="Dossier de Conception non disponible">
                  <span>DDC non disponible</span>
                  <FileDown size={16} />
                </button>
              )}

              {project.ddfFile ? (
                <a href={project.ddfFile} target="_blank" rel="noopener noreferrer" className="doc-btn" title="Télécharger le Dossier de Fabrication">
                  <span>Dossier de Fabrication (DDF)</span>
                  <FileDown size={16} />
                </a>
              ) : (
                <button className="doc-btn disabled" title="Dossier de Fabrication non disponible">
                  <span>DDF non disponible</span>
                  <FileDown size={16} />
                </button>
              )}

              {project.ddvFile ? (
                <a href={project.ddvFile} target="_blank" rel="noopener noreferrer" className="doc-btn" title="Télécharger le Dossier de Vérification">
                  <span>Dossier de Vérification (DDV)</span>
                  <FileDown size={16} />
                </a>
              ) : (
                <button className="doc-btn disabled" title="Dossier de Vérification non disponible">
                  <span>DDV non disponible</span>
                  <FileDown size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
