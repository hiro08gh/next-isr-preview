import Link from 'next/link';
import {useRouter} from 'next/router';
import ErrorPage from 'next/error';

export default function BlogId({blog, preview}) {
  const router = useRouter();

  if (router.isFallback && !blog?.id) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <main className="main">
      {preview && <a href="/api/clear-preview">プレビューモードを解除</a>}
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

export const getStaticProps = async ({
  params,
  previewData,
  preview = false,
}) => {
  const id = params.id;
  const draftKey = previewData?.draftKey;

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

  return {
    props: {
      blog: data,
      preview,
    },
    revalidate: 1,
  };
};
