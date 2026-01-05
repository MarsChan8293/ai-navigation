import { getCategories } from './actions';
import { AdminPageClient } from '@/components/admin/admin-page-client';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const categories = await getCategories();

  return (
    <div>
      <AdminPageClient initialWebsites={[]} initialCategories={categories} />
    </div>
  );
}