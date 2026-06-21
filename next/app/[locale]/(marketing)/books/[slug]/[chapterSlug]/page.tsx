'use server';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/container';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps } from '@/types/types';

interface Chapter {
  id: number;
  title: string;
  slug: string;
  content: string;
  order: number;
  publishedAt: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

interface Book {
  id: number;
  title: string;
  slug: string;
}

interface ChapterPageParams extends LocaleSlugParamsProps {
  params: Promise<{
    locale: string;
    slug: string;
    chapterSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ChapterPageParams): Promise<Metadata> {
  const { slug, chapterSlug, locale } = await params;
  const [chapter] = await fetchCollectionType<Chapter[]>('chapters', {
    filters: {
      slug: {
        $eq: chapterSlug,
      },
      book: {
        slug: {
          $eq: slug,
        },
      },
    },
    locale,
  });
  return {
    title: chapter.title,
  };
}

export default async function ChapterPage({ params }: ChapterPageParams) {
  const { slug, chapterSlug, locale } = await params;

  // Fetch the book
  const [book] = await fetchCollectionType<Book[]>('books', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
  });

  if (!book) {
    notFound();
  }

  // Fetch the chapter
  const [chapter] = await fetchCollectionType<Chapter[]>('chapters', {
    filters: {
      slug: {
        $eq: chapterSlug,
      },
      book: {
        slug: {
          $eq: slug,
        },
      },
    },
    locale,
    populate: {
      author: true,
    },
  });

  if (!chapter) {
    notFound();
  }

  // Fetch all chapters to enable navigation
  const allChapters = await fetchCollectionType<Chapter[]>('chapters', {
    filters: {
      book: {
        slug: {
          $eq: slug,
        },
      },
    },
    sort: ['order:asc'],
    pagination: {
      limit: 1000,
    },
    locale,
  });

  // Find previous and next chapters
  const currentIndex = allChapters.findIndex((ch) => ch.slug === chapter.slug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  return (
    <div className="relative overflow-hidden py-20">
      <Container>
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href={`/${locale}/books/${slug}`}
            className="text-sm font-semibold transition-colors inline-flex items-center gap-2"
          >
            <IconChevronLeft className="w-4 h-4" />
            {book.title}
          </Link>
        </div>

        <div className="container">
          {/* Chapter Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{chapter.title}</h1>
          </div>

          {/* Rich Content */}
          <div className="max-w-none">
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          </div>

          {/* Bottom Navigation */}
          {(prevChapter || nextChapter) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-8 border-t border-neutral-200">
              {prevChapter ? (
                <Link
                  href={`/${locale}/books/${slug}/${prevChapter.slug}`}
                  className="group p-4 rounded-lg border border-neutral-200 transition-all"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                    ← Previous Chapter
                  </p>
                  <p className="text-sm font-semibold">{prevChapter.title}</p>
                </Link>
              ) : (
                <div />
              )}

              {nextChapter ? (
                <Link
                  href={`/${locale}/books/${slug}/${nextChapter.slug}`}
                  className="group p-4 rounded-lg border transition-all md:text-right"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                    Next Chapter →
                  </p>
                  <p className="text-sm font-semibold">{nextChapter.title}</p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
