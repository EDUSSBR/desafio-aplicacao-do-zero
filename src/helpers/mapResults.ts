import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '../pages/index';

export function mapResults(results): Post[] {
  const newPosts = results.map(post => {
    // console.log(post)
    // console.log(post.uid)
    // const slug = post.slugs[0];
    return {
      slug: post.uid,
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  return newPosts;
}
