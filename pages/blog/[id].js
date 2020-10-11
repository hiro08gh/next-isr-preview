import Link from 'next/link';
import {useRouter} from 'next/router';

export default function BlogId({blog}) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading</div>;
  }
  return (
    <main className="main">
      <h1 className="title">{blog.title}</h1>
      <p className="publisedAt">{blog.publishedAt}</p>
      <p className="category">{blog.category && `${blog.category.name}`}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
      />
    </main>
  );
}

export const getStaticPaths = async () => {
  const key = {
    headers: {'X-API-KEY': process.env.API_KEY},
  };

  const res = await fetch('https://your.microcms.io/api/v1/blog', key);
  const repos = await res.json();

  const paths = repos.contents.map(repo => `/blog/${repo.id}`);
  return {paths, fallback: true};
};

export const getStaticProps = async context => {
  const id = context.params.id;
  const draftKey = context.previewData?.draftKey;

  const key = {
    headers: {'X-API-KEY': process.env.API_KEY},
  };

  const res = await fetch(
    `https://your.microcms.io/api/v1/blog/${id}?${
      draftKey !== undefined ? `draftKey=${draftKey}` : ''
    }`,
    key,
  );

  const data = await res.json();

  console.log(data);

  return {
    props: {
      blog: data,
    },
    revalidate: 1,
  };
};
