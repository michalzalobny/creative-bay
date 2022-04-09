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
      <Link href="/test" passHref>
        <a
          style={{
            zIndex: 100,
            opacity: 0,
            position: 'fixed',
            bottom: 0,
            left: 0,
            fontSize: '14px',
          }}
        >
          Go to test
        </a>
      </Link>
    </>
  );
}
