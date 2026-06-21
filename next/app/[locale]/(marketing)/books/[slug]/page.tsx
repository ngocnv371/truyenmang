import { type Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import { Container } from '@/components/container';
import { ChaptersTable } from '@/components/chapters-table';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { Badge } from '@/components/ui/badge';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { Book, LocaleSlugParamsProps } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const [book] = await fetchCollectionType<Book[]>('books', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
    populate: {
      seo: true,
    },
  });

  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }

  const seo = book.seo;
  const metadata = generateMetadataObject(seo);
  
  // Set book title as page title if metaTitle is not provided
  if (!seo?.metaTitle) {
    metadata.title = book.title;
  }
  
  return metadata;
}

const statusColors = {
  ongoing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  hiatus: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface BookDetailPageProps extends LocaleSlugParamsProps {
  searchParams: Promise<{
    page?: string;
    sort?: 'asc' | 'desc';
  }>;
}

export default async function BookDetailPage({
  params,
  searchParams,
}: BookDetailPageProps) {
  const { slug, locale } = await params;
  const { page = '1', sort = 'asc' } = await searchParams;

  const [book] = await fetchCollectionType<Book[]>('books', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
    populate: {
      cover: true,
      genres: true,
      dynamic_zone: true,
      seo: true,
      localizations: true,
    },
  });

  if (!book) {
    notFound();
  }

  const localizedSlugs = book.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  ) || { [locale]: slug };

  return (
    <div className="relative overflow-hidden py-20">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                {book.cover?.url ? (
                  <Image
                    src={book.cover.url}
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                    <svg
                      className="h-24 w-24 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Book Stats */}
              <div className="mt-6 space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600 font-semibold">
                    STATUS
                  </p>
                  <Badge
                    className={`${statusColors[book.status]} capitalize mt-2`}
                  >
                    {book.status}
                  </Badge>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600 font-semibold">
                    VIEWS
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">
                    {(book.views || 0).toLocaleString()}
                  </p>
                </div>

                {book.rating !== undefined && book.rating > 0 && (
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 font-semibold">
                      RATING
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(book.rating || 0) ? 'fill-current' : 'fill-neutral-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-semibold">
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="md:col-span-2">
            {/* Title and Author */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-neutral-600">by {book.author}</p>
            </div>

            {/* Genres */}
            {book.genres && book.genres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.genres.map((genre, index) => (
                    <Badge
                      key={index}
                      className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                Synopsis
              </h3>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {book.synopsis}
              </p>
            </div>

            {/* Description */}
            {book.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-3">
                  Description
                </h3>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {book.description}
                  </p>
                </div>
              </div>
            )}

            {/* Chapters Section */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-4">
                Chapters
              </h3>
              <ChaptersTable
                bookId={book.id}
                bookSlug={slug}
                locale={locale}
                page={parseInt(page, 10)}
                sort={sort as 'asc' | 'desc'}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Zone Components */}
        {book.dynamic_zone && book.dynamic_zone.length > 0 && (
          <div className="py-12">
            <DynamicZoneManager
              dynamicZone={book.dynamic_zone}
              locale={locale}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
