import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

// Ensure database file exists
function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = {
      profile: {
        name: "Étudiant GEII",
        title: "Étudiant en BUT GEII",
        institution: "IUT de Bordeaux",
        bio: "Ma biographie...",
        linkedin: "",
        email: "",
        cvUrl: "",
        avatarUrl: ""
      },
      auth: {
        username: "admin",
        passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // default 'admin123'
        salt: "geiisalt2026"
      },
      skills: [],
      timeline: [],
      projects: []
    };
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Read database
export async function readDb() {
  ensureDb();
  try {
    const data = await fs.promises.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return {};
  }
}

// Write database
export async function writeDb(data) {
  ensureDb();
  try {
    await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// Helpers for specific content areas
export async function getProfile() {
  const db = await readDb();
  return db.profile || {};
}

export async function updateProfile(profileData) {
  const db = await readDb();
  db.profile = { ...db.profile, ...profileData };
  return await writeDb(db);
}

export async function getSkills() {
  const db = await readDb();
  return db.skills || [];
}

export async function saveSkill(skill) {
  const db = await readDb();
  if (!db.skills) db.skills = [];
  
  if (skill.id) {
    const index = db.skills.findIndex(s => s.id === skill.id);
    if (index !== -1) {
      db.skills[index] = { ...db.skills[index], ...skill };
    } else {
      db.skills.push(skill);
    }
  } else {
    skill.id = 's_' + Date.now();
    db.skills.push(skill);
  }
  await writeDb(db);
  return skill;
}

export async function deleteSkill(id) {
  const db = await readDb();
  if (!db.skills) return false;
  db.skills = db.skills.filter(s => s.id !== id);
  return await writeDb(db);
}

export async function getTimeline() {
  const db = await readDb();
  return db.timeline || [];
}

export async function saveTimelineItem(item) {
  const db = await readDb();
  if (!db.timeline) db.timeline = [];
  
  if (item.id) {
    const index = db.timeline.findIndex(t => t.id === item.id);
    if (index !== -1) {
      db.timeline[index] = { ...db.timeline[index], ...item };
    } else {
      db.timeline.push(item);
    }
  } else {
    item.id = 't_' + Date.now();
    db.timeline.push(item);
  }
  await writeDb(db);
  return item;
}

export async function deleteTimelineItem(id) {
  const db = await readDb();
  if (!db.timeline) return false;
  db.timeline = db.timeline.filter(t => t.id !== id);
  return await writeDb(db);
}

export async function getProjects() {
  const db = await readDb();
  return db.projects || [];
}

export async function getProjectById(id) {
  const projects = await getProjects();
  return projects.find(p => p.id === id);
}

export async function saveProject(project) {
  const db = await readDb();
  if (!db.projects) db.projects = [];
  
  if (project.id) {
    const index = db.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      db.projects[index] = { ...db.projects[index], ...project };
    } else {
      db.projects.push(project);
    }
  } else {
    project.id = 'p_' + Date.now();
    db.projects.push(project);
  }
  await writeDb(db);
  return project;
}

export async function deleteProject(id) {
  const db = await readDb();
  if (!db.projects) return false;
  db.projects = db.projects.filter(p => p.id !== id);
  return await writeDb(db);
}
