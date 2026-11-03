import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../../lib/auth';
import { savePageContent } from '../../../../../lib/content-service';

export async function POST(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized. Please log in as admin.' }, { status: 401 });
    }

    const body = await request.json();
    const { type, slug, data } = body;

    if (!type || !slug || !data) {
      return NextResponse.json({ error: 'Missing required fields: type, slug, data' }, { status: 400 });
    }

    if (type !== 'location' && type !== 'service' && type !== 'local_service') {
      return NextResponse.json({ error: 'Invalid page type. Must be "location", "service" or "local_service"' }, { status: 400 });
    }

    const result = await savePageContent(type, slug, data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving page content:', error);
    return NextResponse.json({ error: error.message || 'Failed to save page' }, { status: 500 });
  }
}
