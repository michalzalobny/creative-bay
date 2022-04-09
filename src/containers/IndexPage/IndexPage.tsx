import React from 'react';
import Link from 'next/link';

import { Head } from 'seo/Head/Head';

import * as S from './IndexPage.styles';

export default function IndexPage() {
  return (
    <>
      <Head />
      <S.Wrapper>
        <Link href="/projects/meta-office" passHref>
          <a style={{ fontSize: '14px' }}>Go to test</a>
        </Link>
      </S.Wrapper>
    </>
  );
}
