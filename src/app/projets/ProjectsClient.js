'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Cpu, Search } from 'lucide-react';

export default function ProjectsClient({ initialProjects }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects by category and search query
  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory =
      filter === 'all' || project.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search Bar & Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--foreground-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Rechercher un projet ou une techno..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '44px', borderRadius: '30px' }}
          />
        </div>

        {/* Filter menu */}
        <div className="filter-menu" style={{ margin: '0' }}>
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            Tous les projets
          </button>
          <button
            onClick={() => setFilter('academique')}
            className={`filter-btn ${filter === 'academique' ? 'active' : ''}`}
          >
            Projets Académiques
          </button>
          <button
            onClick={() => setFilter('professionnel')}
            className={`filter-btn ${filter === 'professionnel' ? 'active' : ''}`}
          >
            Projets Professionnels
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
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
                <span className="project-tag">
                  {project.category === 'academique' ? 'Académique' : 'Professionnel'}
                </span>
              </div>
              <div className="project-body">
                <span className="project-date">{project.date}</span>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.shortDescription}</p>
                
                <div className="project-techs">
                  {project.technologies.split(',').map((tech, idx) => (
                    <span key={idx} className="tech-tag">
                      {tech.trim()}
                    </span>
                  ))}
                </div>

                <Link href={`/projets/${project.id}`} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                  En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '80px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.05rem' }}>
            Aucun projet ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
}
