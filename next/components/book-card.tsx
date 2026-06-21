import Image from 'next/image';
import Link from 'next/link';

import { useSlugContext } from '@/app/context/SlugContext';
import { Book } from '@/types/types';
import { Badge } from './ui/badge';
import { StrapiMedia } from './ui/strapi-media';

interface BookCardProps {
  book: Book;
}

const statusColors = {
  ongoing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  hiatus: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function BookCard({ book }: BookCardProps) {
  const href = `/books/${ book.slug}`;

  return (
    <Link href={href}>
      <article className="group overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-lg hover:border-neutral-300">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
          {book.cover?.url ? (
            <StrapiMedia
              src={book.cover.url}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-200 to-neutral-300">
              <svg
                className="h-12 w-12 text-neutral-400"
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

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              className={`${statusColors[book.book_status]} capitalize text-xs font-semibold`}
            >
              {book.book_status}
            </Badge>
          </div>

          {/* Views Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
            <p className="text-xs text-white font-medium">
              {book.views?.toLocaleString()} views
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2 transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-sm mt-1">by {book.author}</p>

          {/* Genres */}
          {book.genres && book.genres.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {book.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
              {book.genres.length > 2 && (
                <span className="text-xs px-2 py-1 rounded">
                  +{book.genres.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Rating */}
          {book.rating !== undefined && book.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(book.rating || 0) ? 'fill-current' : 'fill-neutral-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-neutral-600">
                {book.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Synopsis */}
          <p className="text-sm text-neutral-600 line-clamp-2 mt-2">
            {book.synopsis}
          </p>
        </div>
      </article>
    </Link>
  );
}
