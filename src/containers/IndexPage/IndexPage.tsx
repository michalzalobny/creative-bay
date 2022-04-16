import React, { useEffect } from 'react';
import Link from 'next/link';

import { globalState } from 'utils/globalState';
import { Head } from 'seo/Head/Head';

import * as S from './IndexPage.styles';

export default function IndexPage() {
  useEffect(() => {
    if (globalState.hasVisitedLanding) return;
    globalState.hasVisitedLanding = true;
  }, []);

  return (
    <>
      <Head />
      <S.Wrapper>
        <S.ProjectsWrapper>
          <S.ProjectContainer>
            <Link href="/projects/meta-office" passHref>
              <S.ProjectLink>1. Meta Office</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
        </S.ProjectsWrapper>
      </S.Wrapper>
    </>
  );
}
