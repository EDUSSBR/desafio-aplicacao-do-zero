import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import styles from './home.module.scss';
import { getPrismicClient } from '../services/prismic';
import { mapResults } from '../helpers/mapResults';
// import commonStyles from '../styles/common.module.scss';
// import styles from './home.module.scss';
interface Post {
  uid?: string;
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

interface HomeProps {
  postsPagination: PostPagination;
}
export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPageLink, setNextPageLink] = useState<string>(
    postsPagination.next_page
  );
  const [currentPage, setCurrentPage] = useState(0);

  const nextPageHandler = async (): Promise<void> => {
    const { next_page, results } = await fetch(`${nextPageLink}`).then(data =>
      data.json()
    );
    setNextPageLink(next_page);
    const nextPagePost = mapResults(results);
    const newListOfPosts = posts.concat(nextPagePost);
    setPosts(newListOfPosts);
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        {posts.map(post => {
          return (
            <div key={post.uid} className={styles.ContentItem}>
              <Link href={`/post/${post.uid}`}>{post.data.title}</Link>
              <p>{post.data.subtitle}</p>

              <FiCalendar />

              <p>
                {format(new Date(post.first_publication_date), 'dd MMM yyy', {
                  locale: ptBR,
                })}
              </p>

              <FiUser />
              <span>{post.data.author}</span>
            </div>
          );
        })}
        {nextPageLink !== null && (
          <button onClick={nextPageHandler} type="button">
            Carregar mais posts
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ctx => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')], // usar sempre minusculas no predicates
    {
      fetch: ['Post.Title', 'Post.content'],
      pageSize: 1,
    }
  );
  const results = mapResults(postsResponse.results);
  // const results = postsResponse.results.map(post => {
  //   const slug = post.slugs[0];
  //   return {
  //     uid: post.uid,
  //     first_publication_date: format(
  //       new Date(post.first_publication_date),
  //       'dd MMM yyyy',
  //       {
  //         locale: ptBR,
  //       }
  //     ),
  //     data: {
  //       banner: post.data.banner,
  //       content: post.data.content,
  //       title: post.data.title,
  //       subtitle: post.data.subtitle,
  //       author: post.data.author,
  //     },
  //   };
  // });
  const postsPagination = { next_page: postsResponse.next_page, results };
  return {
    props: {
      postsPagination,
    },
  };
};
