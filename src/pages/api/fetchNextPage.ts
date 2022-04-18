import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NextApiRequest, NextApiResponse } from 'next';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

interface Post {
  uid?: string;
  slug: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
interface PostPagination {
  next_page: string;
  results: Post[];
}
export async function fetchNextPage(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse> {
  if (req.method === 'GET') {
    try {
      const prismic = getPrismicClient();
      const postsResponse = await prismic.query(
        [Prismic.Predicates.at('document.type', 'posts')], // usar sempre minusculas no predicates
        {
          fetch: ['Post.Title', 'Post.content'],
          pageSize: 1,
        }
      );
      const results = postsResponse.results.map(post => {
        const slug = post.slugs[0];
        return {
          slug,
          uid: post.uid,
          first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            {
              locale: ptBR,
            }
          ),
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          },
        };
      });
      const postsPagination = { next_page: postsResponse.next_page, results };
      res.status(200).json({ postsPagination });
    } catch (e) {
      res.status(400).json({ error: 'tests' });
    }
  }
}
