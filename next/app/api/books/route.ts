import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { createEntry } from '../../../lib/strapi';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const data = await createEntry('books', {
      title,
      author: session?.user,
    });

    return NextResponse.json(data);
  } catch (error) {
    const strapiError =
      error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      { error: strapiError.message || 'Internal server error' },
      { status: 400 }
    );
  }
}
