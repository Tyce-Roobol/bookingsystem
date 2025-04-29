import { Metadata } from "next";

type Props = {
  params: { itemName: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const name = (await params).itemName;
  return {
    title: `About: ${name}`,
  };
};

export default async function MenusItem({ params }: Props) {
  const name = (await params).itemName;
  return (
    <>
      <h2>{name}</h2>
    </>
  );
}
