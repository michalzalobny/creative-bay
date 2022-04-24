import { GetStaticProps } from 'next';

import { HeadProps } from 'seo/Head/Head';
import { sharedValues } from 'utils/sharedValues';

export interface PageProps {
  head: HeadProps;
}

export const getStaticProps: GetStaticProps = () => {
  const head: HeadProps = {
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650804189/ogdrop_yvrwue.jpg',
    title: 'Drop unveil',
    description: 'Michal Zalobny portfolio 2022 🌬 WebGL & GLSL',
  };

  return {
    props: {
      head,
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
