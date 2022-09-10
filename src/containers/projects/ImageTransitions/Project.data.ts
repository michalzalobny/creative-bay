import { GetStaticProps } from 'next';

import { HeadProps } from 'seo/Head/Head';
import { sharedValues } from 'utils/sharedValues';

import fragment0 from './transitionShaders/s0/fragment.glsl';
import vertex0 from './transitionShaders/s0/vertex.glsl';

import fragment1 from './transitionShaders/s1/fragment.glsl';
import vertex1 from './transitionShaders/s1/vertex.glsl';

export interface PageProps {
  head: HeadProps;
}

export const dataArray = [
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/video/upload/v1662755666/Instruments_-_10551_qypuol.mp4',
    img2Src: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662747854/2_zzi7ej.jpg',
    imgDisplacementSrc: '',
    title: 'Tiled Transition',
    repoHref:
      'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/ImageTransitions/transitionShaders/s0',
    elId: 0,
    fragmentShader: fragment0,
    vertexShader: vertex0,
  },
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632246/fynn-schmidt-hKwWA1nNKt4-unsplash_1_lwk6n3.jpg',
    img2Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632243/mehmet-turgut-kirkgoz-1-6BbBXcEf0-unsplash_1_klrw1p.jpg',
    imgDisplacementSrc: '',
    title: 'Roll Transition',
    repoHref:
      'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/ImageTransitions/transitionShaders/s1',
    elId: 1,
    fragmentShader: fragment1,
    vertexShader: vertex1,
  },
];

export const imagesToPreload = dataArray
  .map(item => item.img1Src)
  .concat(dataArray.map(item => item.img2Src))
  .concat(dataArray.map(item => item.imgDisplacementSrc))
  .filter(el => el !== '');

export const getStaticProps: GetStaticProps = () => {
  const head: HeadProps = {
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650138958/og-100_mvbgru.jpg',
    title: 'GLSL Image Transitions',
    description: 'Michal Zalobny portfolio 2022 WebGL & GLSL',
  };

  return {
    props: {
      head,
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
