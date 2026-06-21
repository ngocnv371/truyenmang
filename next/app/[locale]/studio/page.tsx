import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import StudioPageClient from './studio-page-client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface StrapiBook {
  id: number;
  title: string;
  slug: string;
  synopsis?: string | null;
  cover?: { url: string } | null;
  book_status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

async function getUserBooks(userId: number): Promise<StrapiBook[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const session = await getServerSession(authOptions);
  const token = (session?.user as any)?.token;

  const response = await fetch(
    `${API_URL}/api/books?filters[author][id][$eq]=${userId}&sort=updatedAt:desc&pagination[withCount]=false`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    }
  );

  if (!response.ok) return [];
  const data = await response.json();
  return (data.data as any[]) || [];
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    const { locale } = await params;
    redirect(`/${locale}/sign-in`);
  }

  const books = await getUserBooks(parseInt((session.user as any).id, 10));

  return <StudioPageClient books={books} />;
}
