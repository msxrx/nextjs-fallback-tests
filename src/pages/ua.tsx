import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

const Page: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = props => {
  return <p>{props.ua}</p>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      ua: ctx.req.headers["user-agent"],
    },
  };
};

export default Page;
