import { IconBook } from '@tabler/icons-react';
import { type Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { useSlugContext } from '@/app/context/SlugContext';
import BookItems from '@/components/book-items';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import type { Book, LocaleParamsProps } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await fetchSingleType('books-page', { locale });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Books({ params }: LocaleParamsProps) {
  const { locale } = await params;
  
  const pageData = await fetchSingleType('books-page', {
    locale: locale,
  });

  const books = await fetchCollectionType<Book[]>('books', { locale });

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconBook className="h-6 w-6 text-white" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {pageData.heading || 'Books'}
          </Heading>
          <Subheading className="max-w-3xl mx-auto">
            {pageData.sub_heading || 'Discover amazing novels'}
          </Subheading>
        </div>

        <div className="w-full py-12">
          <h2 className="text-2xl font-bold mb-6">All Novels</h2>
          <BookItems books={books} columns={4} />
        </div>
      </Container>
    </div>
  );
}
