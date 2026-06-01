import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { 
  updateProfile, 
  saveSkill, 
  deleteSkill, 
  saveTimelineItem, 
  deleteTimelineItem, 
  saveProject, 
  deleteProject 
} from '@/lib/db';

export async function POST(request) {
  try {
    // 1. Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    const session = verifySession(token);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    // 2. Parse request parameters
    const { type, action, data } = await request.json();

    if (!type || !action || !data) {
      return NextResponse.json({ success: false, error: 'Requête invalide' }, { status: 400 });
    }

    let success = false;
    let result = null;

    // 3. Process actions based on type
    switch (type) {
      case 'profile':
        if (action === 'update') {
          success = await updateProfile(data);
        }
        break;

      case 'skills':
        if (action === 'save') {
          result = await saveSkill(data);
          success = !!result;
        } else if (action === 'delete') {
          success = await deleteSkill(data.id);
        }
        break;

      case 'timeline':
        if (action === 'save') {
          result = await saveTimelineItem(data);
          success = !!result;
        } else if (action === 'delete') {
          success = await deleteTimelineItem(data.id);
        }
        break;

      case 'projects':
        if (action === 'save') {
          result = await saveProject(data);
          success = !!result;
        } else if (action === 'delete') {
          success = await deleteProject(data.id);
        }
        break;

      default:
        return NextResponse.json({ success: false, error: 'Type inconnu' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour de la base de données" }, { status: 500 });
    }

  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
