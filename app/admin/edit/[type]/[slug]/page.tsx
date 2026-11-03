import { redirect, notFound } from 'next/navigation';
import { isAuthenticated } from '../../../../../lib/auth';
import { getPageContent } from '../../../../../lib/content-service';
import LivePageEditor from './LivePageEditor';

type Props = {
  params: Promise<{
    type: string;
    slug: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function PageEditorServer({ params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  const { type, slug } = await params;

  if (type !== 'location' && type !== 'service' && type !== 'local_service') {
    notFound();
  }

  const initialData = await getPageContent(type, slug);

  if (!initialData) {
    notFound();
  }

  return (
    <LivePageEditor
      type={type}
      slug={slug}
      initialData={initialData}
    />
  );
}

