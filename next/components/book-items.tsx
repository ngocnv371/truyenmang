import BookCard from './book-card';
import { Book } from '@/types/types';

interface BookItemsProps {
  books: Book[];
  columns?: number;
}

export default function BookItems({ books, columns = 4 }: BookItemsProps) {
  if (!books || books.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-500 text-lg">No books found</p>
      </div>
    );
  }

  const gridColsClass =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
    }[columns] || 'grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-6`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
