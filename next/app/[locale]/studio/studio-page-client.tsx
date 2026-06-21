'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/elements/button';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalProvider,
  ModalTrigger,
  useModal,
} from '@/components/ui/animated-modal';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

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

const statusColors: Record<string, string> = {
  ongoing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  hiatus: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

function CreateBookForm() {
  const { setOpen } = useModal();
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateBook = async () => {
    if (!newTitle.trim() || !user) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create book');
        return;
      }

      setNewTitle('');
      setOpen(false);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setError(null);
    setOpen(false);
  };

  return (
    <>
      <ModalContent>
        <h3 className="text-xl font-bold text-neutral-900 mb-1">
          Create a New Book
        </h3>
        <p className="text-sm text-neutral-500 mb-6">
          Give your book a title. You can always edit more details later.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="book-title"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Book Title
            </label>
            <Input
              id="book-title"
              type="text"
              placeholder="Enter book title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateBook();
              }}
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="muted" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateBook}
          disabled={!newTitle.trim() || isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Book'}
        </Button>
      </ModalFooter>
    </>
  );
}

export default function StudioPageClient({ books }: { books: StrapiBook[] }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleOpenBook = (slug: string) => {
    router.push(`/books/${slug}`);
  };

  return (
    <ModalProvider>
      <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Studio</h1>
              <p className="text-neutral-400 mt-1">Manage your books</p>
            </div>

            {/* Create Book Button */}
            <ModalTrigger>
              <span className="text-sm">+ New Book</span>
            </ModalTrigger>
          </div>

          {/* Books Table */}
          {books.length > 0 ? (
            <div className="rounded-lg border border-neutral-800 overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-neutral-700">
                      Book
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-neutral-700 hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 font-semibold text-neutral-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      onClick={() => handleOpenBook(book.slug)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {book.cover?.url ? (
                            <img
                              src={book.cover.url}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-neutral-200 rounded flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-neutral-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">
                              {book.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              Updated{' '}
                              {new Date(book.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
                            statusColors[book.book_status]
                          )}
                        >
                          {book.book_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                          View
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-800 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                />
              </svg>
              <p className="mt-4 text-neutral-600 font-medium">No books yet</p>
              <p className="text-sm text-neutral-400 mt-1">
                Create your first book to get started.
              </p>
            </div>
          )}
        </div>

        {/* Create Book Modal */}
        <ModalBody>
          <CreateBookForm />
        </ModalBody>
      </div>
    </ModalProvider>
  );
}
