'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Cpu, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardClient({ initialData }) {
  const router = useRouter();
  
  // State from initial database hydration
  const [profile, setProfile] = useState(initialData.profile || {});
  const [skills, setSkills] = useState(initialData.skills || []);
  const [timeline, setTimeline] = useState(initialData.timeline || []);
  const [projects, setProjects] = useState(initialData.projects || []);

  // UI States
  const [activeTab, setActiveTab] = useState('profile');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'skill' | 'timeline' | 'project'
  const [currentItem, setCurrentItem] = useState(null); // holds item being edited, or null for new

  // Predefined icons list for skills dropdown
  const availableIcons = [
    'Binary', 'Cpu', 'Code2', 'Database', 'Activity', 'Layers', 
    'CircuitBoard', 'Sliders', 'Radio', 'Grid', 'Settings', 'Network'
  ];

  // Show status alerts helper
  const triggerStatus = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Unified CRUD Fetch function
  const mutateDb = async (type, action, data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action, data })
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        return resData.result || true;
      } else {
        triggerStatus(resData.error || "Une erreur s'est produite.", true);
        return null;
      }
    } catch (err) {
      console.error(err);
      triggerStatus("Erreur réseau.", true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- Profile handlers ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfileSettings = async (e) => {
    e.preventDefault();
    const ok = await mutateDb('profile', 'update', profile);
    if (ok) {
      triggerStatus("Profil mis à jour avec succès !");
    }
  };

  // --- Item opening and deletions ---
  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item || getEmptyState(type));
    setIsModalOpen(true);
  };

  const getEmptyState = (type) => {
    switch (type) {
      case 'skill':
        return { name: '', level: 80, category: 'programmation', description: '', icon: 'Code2' };
      case 'timeline':
        return { year: '', title: '', subtitle: '', description: '', type: 'formation' };
      case 'project':
        return {
          title: '', category: 'academique', mainImage: '', shortDescription: '',
          fullDescription: '', technologies: '', date: '', difficulties: '',
          results: '', skillsMobilized: '', galleryImages: [],
          ddcFile: '', ddfFile: '', ddvFile: ''
        };
      default:
        return {};
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    const ok = await mutateDb(type, 'delete', { id });
    if (ok) {
      if (type === 'skills') setSkills(prev => prev.filter(s => s.id !== id));
      if (type === 'timeline') setTimeline(prev => prev.filter(t => t.id !== id));
      if (type === 'projects') setProjects(prev => prev.filter(p => p.id !== id));
      triggerStatus("Élément supprimé avec succès !");
    }
  };

  // --- Form Modal Submissions ---
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const typeKey = modalType === 'skill' ? 'skills' : modalType === 'timeline' ? 'timeline' : 'projects';
    const savedItem = await mutateDb(typeKey, 'save', currentItem);

    if (savedItem) {
      if (modalType === 'skill') {
        setSkills(prev => {
          const idx = prev.findIndex(s => s.id === savedItem.id);
          return idx !== -1 ? prev.map(s => s.id === savedItem.id ? savedItem : s) : [...prev, savedItem];
        });
      } else if (modalType === 'timeline') {
        setTimeline(prev => {
          const idx = prev.findIndex(t => t.id === savedItem.id);
          return idx !== -1 ? prev.map(t => t.id === savedItem.id ? savedItem : t) : [...prev, savedItem];
        });
      } else if (modalType === 'project') {
        setProjects(prev => {
          const idx = prev.findIndex(p => p.id === savedItem.id);
          return idx !== -1 ? prev.map(p => p.id === savedItem.id ? savedItem : p) : [...prev, savedItem];
        });
      }
      setIsModalOpen(false);
      triggerStatus("Modifications enregistrées !");
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Title Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Tableau de bord</h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
            Gérez vos contenus de portfolio en temps réel sans code.
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div style={{ display: 'flex', gap: '8px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', alignItems: 'center' }}>
          <CheckCircle2 size={18} /> <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={{ display: 'flex', gap: '8px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', alignItems: 'center' }}>
          <AlertCircle size={18} /> <span>{errorMsg}</span>
        </div>
      )}

      {/* Admin Layout Grid */}
      <div className="admin-layout">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <button onClick={() => setActiveTab('profile')} className={`admin-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}>
            <User size={18} /> Paramètres Profil
          </button>
          <button onClick={() => setActiveTab('skills')} className={`admin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}>
            <BookOpen size={18} /> Compétences ({skills.length})
          </button>
          <button onClick={() => setActiveTab('timeline')} className={`admin-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}>
            <Calendar size={18} /> Parcours / Frise ({timeline.length})
          </button>
          <button onClick={() => setActiveTab('projects')} className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}>
            <Cpu size={18} /> Projets ({projects.length})
          </button>
        </aside>

        {/* Main Panel Content */}
        <main className="card" style={{ padding: '30px' }}>
          {/* TAB 1: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="admin-panel-title">Paramètres Généraux</h2>
              <form onSubmit={saveProfileSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Nom Complet</label>
                    <input type="text" name="name" value={profile.name || ''} onChange={handleProfileChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Titre professionnel / Description courte</label>
                    <input type="text" name="title" value={profile.title || ''} onChange={handleProfileChange} className="form-control" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Établissement académique</label>
                    <input type="text" name="institution" value={profile.institution || ''} onChange={handleProfileChange} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adresse E-mail</label>
                    <input type="email" name="email" value={profile.email || ''} onChange={handleProfileChange} className="form-control" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Biographie / Présentation détaillée</label>
                  <textarea name="bio" value={profile.bio || ''} onChange={handleProfileChange} rows="5" className="form-control" required style={{ resize: 'vertical' }}></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Lien LinkedIn</label>
                    <input type="url" name="linkedin" value={profile.linkedin || ''} onChange={handleProfileChange} className="form-control" placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL PDF du CV</label>
                    <input type="text" name="cvUrl" value={profile.cvUrl || ''} onChange={handleProfileChange} className="form-control" placeholder="ex: /docs/cv.pdf ou URL" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL de l'Avatar / Photo de profil</label>
                  <input type="text" name="avatarUrl" value={profile.avatarUrl || ''} onChange={handleProfileChange} className="form-control" placeholder="ex: /images/photo.jpg ou URL" />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                  <Save size={16} /> Enregistrer le profil
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SKILLS MANAGEMENT */}
          {activeTab === 'skills' && (
            <div>
              <div className="admin-panel-title">
                <span>Mes Compétences</span>
                <button onClick={() => openModal('skill')} className="btn btn-primary btn-sm" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Ajouter une compétence
                </button>
              </div>

              <div className="admin-items-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <div className="admin-item-title">{skill.name} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', marginLeft: '8px' }}>{skill.level}%</span></div>
                      <div className="admin-item-subtitle" style={{ textTransform: 'capitalize' }}>Catégorie : {skill.category} | Icône : {skill.icon}</div>
                    </div>
                    <div className="admin-item-actions">
                      <button onClick={() => openModal('skill', skill)} className="btn btn-secondary" style={{ padding: '8px' }} title="Modifier">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteItem('skills', skill.id)} className="btn btn-danger" style={{ padding: '8px' }} title="Supprimer">
                        <Trash2 size={14} style={{ color: 'white' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE / PARCOURS */}
          {activeTab === 'timeline' && (
            <div>
              <div className="admin-panel-title">
                <span>Mon Parcours Chronologique</span>
                <button onClick={() => openModal('timeline')} className="btn btn-primary btn-sm" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Ajouter un événement
                </button>
              </div>

              <div className="admin-items-list">
                {timeline.map((item) => (
                  <div key={item.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <div className="admin-item-title">{item.title} <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>({item.year})</span></div>
                      <div className="admin-item-subtitle">{item.subtitle} | Type : <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{item.type}</span></div>
                    </div>
                    <div className="admin-item-actions">
                      <button onClick={() => openModal('timeline', item)} className="btn btn-secondary" style={{ padding: '8px' }} title="Modifier">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteItem('timeline', item.id)} className="btn btn-danger" style={{ padding: '8px' }} title="Supprimer">
                        <Trash2 size={14} style={{ color: 'white' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div>
              <div className="admin-panel-title">
                <span>Gestion des Projets</span>
                <button onClick={() => openModal('project')} className="btn btn-primary btn-sm" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Ajouter un projet
                </button>
              </div>

              <div className="admin-items-list">
                {projects.map((project) => (
                  <div key={project.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <div className="admin-item-title">{project.title} <span style={{ fontSize: '0.75rem', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', marginLeft: '8px', textTransform: 'capitalize' }}>{project.category}</span></div>
                      <div className="admin-item-subtitle">Technos: {project.technologies} | Date: {project.date}</div>
                    </div>
                    <div className="admin-item-actions">
                      <button onClick={() => openModal('project', project)} className="btn btn-secondary" style={{ padding: '8px' }} title="Modifier">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteItem('projects', project.id)} className="btn btn-danger" style={{ padding: '8px' }} title="Supprimer">
                        <Trash2 size={14} style={{ color: 'white' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- FORM MODALS --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {currentItem.id ? 'Modifier l\'élément' : 'Ajouter un élément'} - {
                  modalType === 'skill' ? 'Compétence' : modalType === 'timeline' ? 'Événement Parcours' : 'Projet'
                }
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* SKILL FORM FIELDS */}
                {modalType === 'skill' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nom de la compétence</label>
                      <input type="text" required className="form-control" value={currentItem.name || ''} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})} placeholder="ex: SolidWorks" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Catégorie</label>
                        <select className="form-control" value={currentItem.category || 'programmation'} onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}>
                          <option value="programmation">Programmation</option>
                          <option value="logiciels">Logiciels & Outils CAO</option>
                          <option value="techniques">Compétences Techniques GEII</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Niveau de maîtrise (%)</label>
                        <input type="number" min="0" max="100" required className="form-control" value={currentItem.level || 80} onChange={(e) => setCurrentItem({...currentItem, level: parseInt(e.target.value)})} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Icône Lucide</label>
                        <select className="form-control" value={currentItem.icon || 'Code2'} onChange={(e) => setCurrentItem({...currentItem, icon: e.target.value})}>
                          {availableIcons.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Courte Description</label>
                      <input type="text" className="form-control" value={currentItem.description || ''} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})} placeholder="ex: Modélisation 3D de pièces mécaniques." />
                    </div>
                  </>
                )}

                {/* TIMELINE FORM FIELDS */}
                {modalType === 'timeline' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Période / Année</label>
                      <input type="text" required className="form-control" value={currentItem.year || ''} onChange={(e) => setCurrentItem({...currentItem, year: e.target.value})} placeholder="ex: 2024 - Présent" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Intitulé / Titre</label>
                      <input type="text" required className="form-control" value={currentItem.title || ''} onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})} placeholder="ex: BUT GEII (Génie Électrique...)" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Établissement / Entreprise</label>
                        <input type="text" required className="form-control" value={currentItem.subtitle || ''} onChange={(e) => setCurrentItem({...currentItem, subtitle: e.target.value})} placeholder="ex: IUT de Bordeaux" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Type d'expérience</label>
                        <select className="form-control" value={currentItem.type || 'formation'} onChange={(e) => setCurrentItem({...currentItem, type: e.target.value})}>
                          <option value="formation">Formation / Diplôme</option>
                          <option value="stage">Stage / Alternance</option>
                          <option value="experience">Expérience Professionnelle</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description / Détails</label>
                      <textarea rows="4" className="form-control" value={currentItem.description || ''} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})} placeholder="Détails sur les enseignements, missions..." style={{ resize: 'vertical' }}></textarea>
                    </div>
                  </>
                )}

                {/* PROJECT FORM FIELDS */}
                {modalType === 'project' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Titre du Projet</label>
                        <input type="text" required className="form-control" value={currentItem.title || ''} onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})} placeholder="ex: Robot Mobile Autonome" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Catégorie</label>
                        <select className="form-control" value={currentItem.category || 'academique'} onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}>
                          <option value="academique">Académique</option>
                          <option value="professionnel">Professionnel</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Date (Mois & Année)</label>
                        <input type="text" required className="form-control" value={currentItem.date || ''} onChange={(e) => setCurrentItem({...currentItem, date: e.target.value})} placeholder="ex: Janvier 2025" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Technologies utilisées (séparées par des virgules)</label>
                        <input type="text" required className="form-control" value={currentItem.technologies || ''} onChange={(e) => setCurrentItem({...currentItem, technologies: e.target.value})} placeholder="ex: STM32, Langage C, KiCad" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description Courte</label>
                      <input type="text" required className="form-control" value={currentItem.shortDescription || ''} onChange={(e) => setCurrentItem({...currentItem, shortDescription: e.target.value})} placeholder="Présentation rapide affichée sur les cartes..." />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description Complète (En savoir plus)</label>
                      <textarea rows="4" className="form-control" value={currentItem.fullDescription || ''} onChange={(e) => setCurrentItem({...currentItem, fullDescription: e.target.value})} placeholder="Explications approfondies sur le contexte et la réalisation..." style={{ resize: 'vertical' }}></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Compétences GEII Mobilisées (séparées par des virgules)</label>
                      <input type="text" className="form-control" value={currentItem.skillsMobilized || ''} onChange={(e) => setCurrentItem({...currentItem, skillsMobilized: e.target.value})} placeholder="ex: Électronique numérique, Conception PCB" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Difficultés Rencontrées</label>
                        <textarea rows="3" className="form-control" value={currentItem.difficulties || ''} onChange={(e) => setCurrentItem({...currentItem, difficulties: e.target.value})} placeholder="Quelles difficultés avez-vous surmontées ?" style={{ resize: 'vertical' }}></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Résultats Obtenus</label>
                        <textarea rows="3" className="form-control" value={currentItem.results || ''} onChange={(e) => setCurrentItem({...currentItem, results: e.target.value})} placeholder="Quels ont été les résultats (notes, fonctionnement, réduction de coûts...) ?" style={{ resize: 'vertical' }}></textarea>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">URL de l'Image principale</label>
                      <input type="text" className="form-control" value={currentItem.mainImage || ''} onChange={(e) => setCurrentItem({...currentItem, mainImage: e.target.value})} placeholder="ex: /images/projets/robot.jpg (Laisser vide si aucune)" />
                    </div>

                    {/* Dossiers Techniques */}
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Téléchargement de Documents Techniques</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                        Ajoutez des liens (ex: /docs/mon_rapport.pdf) vers vos dossiers de conception, fabrication et vérification.
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Dossier Conception (DDC)</label>
                          <input type="text" className="form-control" style={{ padding: '8px' }} value={currentItem.ddcFile || ''} onChange={(e) => setCurrentItem({...currentItem, ddcFile: e.target.value})} placeholder="URL/Lien PDF" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Dossier Fabrication (DDF)</label>
                          <input type="text" className="form-control" style={{ padding: '8px' }} value={currentItem.ddfFile || ''} onChange={(e) => setCurrentItem({...currentItem, ddfFile: e.target.value})} placeholder="URL/Lien PDF" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Dossier Vérification (DDV)</label>
                          <input type="text" className="form-control" style={{ padding: '8px' }} value={currentItem.ddvFile || ''} onChange={(e) => setCurrentItem({...currentItem, ddvFile: e.target.value})} placeholder="URL/Lien PDF" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
