import { GetStaticProps } from 'next';

import { PageProps } from 'utils/sharedTypes';
import { sharedValues } from 'utils/sharedValues';

export const getStaticProps: GetStaticProps = () => {
  const head: PageProps['head'] = {
    description: 'Metaverse office designed in Blender and moved to WebGL',
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650138958/og-100_mvbgru.jpg',
    title: 'Metaverse office',
  };

  return {
    props: {
      head,
      inspirationName: 'Le Polish Bureau headquarters',
      inspirationHref: 'https://lepolishbureau.com/',
      repoHref:
        'https://github.com/michalzalobny/creative-bay/tree/main/src/containers/projects/MetaOffice',
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
