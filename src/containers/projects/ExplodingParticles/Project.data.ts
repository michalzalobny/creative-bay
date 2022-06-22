import { GetStaticProps } from 'next';

import { HeadProps } from 'seo/Head/Head';
import { sharedValues } from 'utils/sharedValues';

export interface PageProps {
  head: HeadProps;
}

export const getStaticProps: GetStaticProps = () => {
  const head: HeadProps = {
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650138958/og-100_mvbgru.jpg',
    title: 'Exploding Particles',
    description: 'Michal Zalobny portfolio 2022 WebGL & GLSL',
  };

  return {
    props: {
      head,
      inspirationName: 'M-Trust website',
      inspirationHref: 'https://www.m-trust.co.jp/',
      repoHref:
        'https://github.com/javusScriptus/creative-bay/tree/main/src/containers/projects/ExplodingParticles',
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
