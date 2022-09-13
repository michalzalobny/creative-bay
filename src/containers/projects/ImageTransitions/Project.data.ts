import { GetStaticProps } from 'next';

import { HeadProps } from 'seo/Head/Head';
import { sharedValues } from 'utils/sharedValues';

import fragment0 from './transitionShaders/s0/fragment.glsl';
import vertex0 from './transitionShaders/s0/vertex.glsl';

import fragment1 from './transitionShaders/s1/fragment.glsl';
import vertex1 from './transitionShaders/s1/vertex.glsl';

import fragment2 from './transitionShaders/s2/fragment.glsl';
import vertex2 from './transitionShaders/s2/vertex.glsl';

import fragment3 from './transitionShaders/s3/fragment.glsl';
import vertex3 from './transitionShaders/s3/vertex.glsl';

export interface PageProps {
  head: HeadProps;
}

export const dataArray = [
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662920742/krystian-tambur-k7rZ8wTfABA-unsplash_ykee7e.jpg',
    img2Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662920941/keith-hardy-PP8Escz15d8-unsplash_pwfug2.jpg',
    imgDisplacementSrc:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1663024171/disp3_qmq6h7_1_aey1rw.jpg',
    title: 'Drop Transition',
    repoHref:
      'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/ImageTransitions/transitionShaders/s3',
    elId: 3,
    fragmentShader: fragment3,
    vertexShader: vertex3,
  },

  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662920941/keith-hardy-PP8Escz15d8-unsplash_pwfug2.jpg',
    img2Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662920742/krystian-tambur-k7rZ8wTfABA-unsplash_ykee7e.jpg ',
    imgDisplacementSrc: '',
    title: 'Wave Transition',
    repoHref:
      'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/ImageTransitions/transitionShaders/s2',
    elId: 2,
    fragmentShader: fragment2,
    vertexShader: vertex2,
  },
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662886426/pawel-czerwinski-Lki74Jj7H-U-unsplash_1_aoacff.jpg',
    img2Src: '',
    imgDisplacementSrc: '',
    title: 'Roll Transition',
    repoHref:
      'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/ImageTransitions/transitionShaders/s1',
    elId: 1,
    fragmentShader: fragment1,
    vertexShader: vertex1,
  },
  {
    img1Src:
      'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632246/fynn-schmidt-hKwWA1nNKt4-unsplash_1_lwk6n3.jpg',
    img2Src: '',
    imgDisplacementSrc: '',
    title: 'Tiled Transition',
    repoHref:
      'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/ImageTransitions/transitionShaders/s0',
    elId: 0,
    fragmentShader: fragment0,
    vertexShader: vertex0,
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
