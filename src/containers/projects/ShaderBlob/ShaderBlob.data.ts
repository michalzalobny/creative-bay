import { GetStaticProps } from 'next';

import { PageProps } from 'utils/sharedTypes';
import { sharedValues } from 'utils/sharedValues';

export const getStaticProps: GetStaticProps = () => {
  const head: PageProps['head'] = {
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650311181/ogblob_skua3n.jpg',
    title: 'Shader blob',
    description: 'Michal Zalobny portfolio 2022 🌬 WebGL & GLSL',
  };

  return {
    props: {
      head,
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
