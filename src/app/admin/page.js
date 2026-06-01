import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { readDb } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Verify authentication server-side
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = verifySession(token);

  if (!session) {
    redirect('/admin/login');
  }

  // Load current database content to hydrate the admin dashboard
  const db = await readDb();

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <AdminDashboardClient initialData={db} />
    </div>
  );
}
