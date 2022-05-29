import { GetStaticProps } from 'next';

import { sharedValues } from 'utils/sharedValues';
import { PageProps } from 'utils/sharedTypes';

export const getStaticProps: GetStaticProps = () => {
  const head: PageProps['head'] = {
    ogImage: 'https://res.cloudinary.com/dpv0ukspz/image/upload/v1650804189/ogdrop_yvrwue.jpg',
    title: 'Drop unveil',
    description: 'Michal Zalobny portfolio 2022 WebGL & GLSL',
  };

  return {
    props: {
      head,
      inspirationName: 'Monopo London',
      inspirationHref: 'https://monopo.london/',
      repoHref:
        'https://github.com/javusScriptus/creative-bay/tree/main/src/containers/projects/DropUnveil',
    },
    revalidate: sharedValues.ISR_TIMEOUT,
  };
};
