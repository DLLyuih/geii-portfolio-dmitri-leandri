import { getTimeline } from '@/lib/db';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Parcours() {
  const timelineData = await getTimeline();

  // Sort timeline chronologically (most recent first)
  // We can do this by examining the year or ID, or keep order in database.
  // The database list is t1 (BUT, present), t2 (stage 2026), t3 (bac 2022-2024).
  // Let's sort to show most recent at the top
  const sortedTimeline = [...timelineData].sort((a, b) => {
    // Basic sort: if one contains "Présent" it goes top, else by date parsing
    if (a.year.includes('Présent') && !b.year.includes('Présent')) return -1;
    if (!a.year.includes('Présent') && b.year.includes('Présent')) return 1;
    return b.year.localeCompare(a.year);
  });

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'formation':
        return <GraduationCap size={20} style={{ color: 'var(--primary)' }} />;
      case 'stage':
        return <Briefcase size={20} style={{ color: '#10b981' }} />;
      case 'experience':
        return <Briefcase size={20} style={{ color: '#f59e0b' }} />;
      default:
        return <Award size={20} style={{ color: 'var(--primary)' }} />;
    }
  };

  const getBadgeClass = (type) => {
    return `timeline-badge ${type}`;
  };

  const getBadgeLabel = (type) => {
    switch (type) {
      case 'formation':
        return 'Formation';
      case 'stage':
        return 'Stage / Alternance';
      case 'experience':
        return 'Expérience Pro';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <h1 className="section-title" style={{ marginTop: '40px' }}>Mon Parcours</h1>
      <p className="section-subtitle">
        Découvrez mon cursus académique, mes premières expériences dans l'industrie et les jalons de ma formation en Génie Électrique et Informatique Industrielle.
      </p>

      {sortedTimeline.length > 0 ? (
        <div className="timeline">
          {sortedTimeline.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot" style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '2px' }}>
                {getTimelineIcon(item.type)}
              </div>
              <div className="timeline-card card">
                <span className={getBadgeClass(item.type)}>
                  {getBadgeLabel(item.type)}
                </span>
                <div className="timeline-year">{item.year}</div>
                <h3 className="timeline-title">{item.title}</h3>
                <h4 className="timeline-subtitle">{item.subtitle}</h4>
                <p className="timeline-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '60px 0' }}>
          <p style={{ color: 'var(--foreground-secondary)' }}>Aucun élément de parcours enregistré pour le moment.</p>
        </div>
      )}
    </div>
  );
}
