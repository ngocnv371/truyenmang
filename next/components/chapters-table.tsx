'use server';

import Link from 'next/link';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchCollectionType } from '@/lib/strapi';

interface Chapter {
  id: number;
  title: string;
  slug: string;
  order: number;
  createdAt: string;
  publishedAt: string;
}

interface ChaptersTableProps {
  bookId: number;
  bookSlug: string;
  locale: string;
  page?: number;
  pageSize?: number;
  sort?: 'asc' | 'desc';
}

const DEFAULT_PAGE_SIZE = 10;

export async function ChaptersTable({
  bookId,
  bookSlug,
  locale,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = 'asc',
}: ChaptersTableProps) {
  const start = (page - 1) * pageSize;

  // Fetch chapters with pagination
  const chapters = await fetchCollectionType<Chapter[]>('chapters', {
    filters: {
      book: {
        id: {
          $eq: bookId,
        },
      },
    },
    sort: [`order:${sort}`],
    locale,
    pagination: {
      start,
      limit: pageSize,
    },
    populate: {
      author: true,
    },
  });

  // Fetch total count for pagination
  const allChapters = await fetchCollectionType<Chapter[]>('chapters', {
    filters: {
      book: {
        id: {
          $eq: bookId,
        },
      },
    },
    pagination: {
      limit: 1,
    },
  });

  const totalChapters = allChapters.length > 0 ? (allChapters[0] as any).meta?.pagination?.total || 0 : 0;
  const totalPages = Math.ceil(totalChapters / pageSize);

  const sortToggleUrl = (newSort: 'asc' | 'desc') => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('sort', newSort);
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Chapters Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-2">
                Title
                <Link
                  href={sortToggleUrl(sort === 'asc' ? 'desc' : 'asc')}
                  className="p-0.5 rounded transition-colors text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  title={`Sort ${sort === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sort === 'asc' ? (
                    <IconChevronDown className="w-4 h-4" />
                  ) : (
                    <IconChevronUp className="w-4 h-4" />
                  )}
                </Link>
              </div>
            </TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell>{chapter.title}</TableCell>
                <TableCell className="text-neutral-600">
                  {new Date(chapter.publishedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/${locale}/books/${bookSlug}/${chapter.slug}`}
                    className="inline-block px-3 py-1 rounded text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Read
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-neutral-600">
                No chapters available yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing {start + 1} to {Math.min(start + pageSize, totalChapters)} of{' '}
            {totalChapters} chapters
          </p>

          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}&sort=${sort}`}
                className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors"
              >
                Previous
              </Link>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`?page=${pageNum}&sort=${sort}`}
                    className={`w-10 h-10 flex items-center justify-center rounded text-sm font-semibold transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {page < totalPages && (
              <Link
                href={`?page=${page + 1}&sort=${sort}`}
                className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
