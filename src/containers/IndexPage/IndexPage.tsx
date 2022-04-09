import React from 'react';
import Link from 'next/link';

import { Head } from 'seo/Head/Head';
import { Visualiser } from 'sections/Visualiser/Visualiser';

import * as S from './IndexPage.styles';

export default function IndexPage() {
  return (
    <>
      <Head />
      <S.Wrapper>
        <Visualiser />
      </S.Wrapper>
      <Link href="/projects/meta-office" passHref>
        <a style={{ fontSize: '14px' }}>Go to test</a>
      </Link>
    </>
  );
}
