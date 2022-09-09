import { GetStaticProps } from 'next';

import { HeadProps } from 'seo/Head/Head';
import { sharedValues } from 'utils/sharedValues';

export interface PageProps {
  head: HeadProps;
}

export const dataArray = [
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632246/fynn-schmidt-hKwWA1nNKt4-unsplash_1_lwk6n3.jpg',
    img2Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632243/mehmet-turgut-kirkgoz-1-6BbBXcEf0-unsplash_1_klrw1p.jpg',
    title: 'Tiled Transition',
    repoHref: 'https://github.com/',
    elId: 0,
  },
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632246/fynn-schmidt-hKwWA1nNKt4-unsplash_1_lwk6n3.jpg',
    img2Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662673720/pawel-czerwinski-OG44d93iNJk-unsplash_mlqhts.jpg',
    title: 'Wave Transition',
    repoHref: 'https://github.com/',
    elId: 1,
  },
];

export const imagesToPreload = dataArray
  .map(item => item.img1Src)
  .concat(dataArray.map(item => item.img2Src));

export const getStaticProps: GetStaticProps = () => {
  const head: HeadProps = {
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650138958/og-100_mvbgru.jpg',
    title: 'Three Starter project',
    description: 'Michal Zalobny portfolio 2022 WebGL & GLSL',
  };

  return {
    props: {
      head,
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
