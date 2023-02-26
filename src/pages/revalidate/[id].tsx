import { sleep } from "@/utils/sleep";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";

const PAGE_DELAY_S = 5;
const REVALIDATE_S = 10;

const FALLBACK_MSG = `This is a fallback page. It should disappear in approximately ${PAGE_DELAY_S} seconds.`;
const REVALIDATE_MSG = `Revalidation period: ${REVALIDATE_S}`;

type PageProps = {
  now: string;
  nextRevalidaiton: string;
  h1: string;
  finishedAt: string;
};

const Page: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <main>
        <p>{FALLBACK_MSG}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Page {props.h1}</h1>
      <p>Generated at: {props.now}</p>
      <p>{REVALIDATE_MSG}</p>
      <p>Next revalidation at: {props.nextRevalidaiton}</p>
      <p>Finished generation at: {props.finishedAt}</p>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [1, 2, 3].map(n => ({ params: { id: n.toString() } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const date = new Date();
  const now = date.toISOString();
  date.setSeconds(date.getSeconds() + REVALIDATE_S);
  const nextRevalidaiton = date.toISOString();

  if (!params || typeof params.id !== "string") {
    return { notFound: true };
  }

  await sleep(PAGE_DELAY_S);

  const finishedAt = new Date().toISOString();

  return {
    props: {
      now,
      nextRevalidaiton,
      h1: params.id,
      finishedAt,
    },
    revalidate: REVALIDATE_S,
  };
};

export default Page;
