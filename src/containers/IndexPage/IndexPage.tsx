import React from 'react';
import Link from 'next/link';

import { Head } from 'seo/Head/Head';

import * as S from './IndexPage.styles';

export default function IndexPage() {
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
          <S.ProjectContainer>
            <Link href="/projects/exploding-particles" passHref>
              <S.ProjectLink>2. Exploding Particles</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/drop-unveil" passHref>
              <S.ProjectLink>3. Drop Unveil</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/shader-blob" passHref>
              <S.ProjectLink>4. Shader Blob</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <S.ProjectLink target="_blank" href="https://michalzalobny.com/">
              5. Portfolio 2021
            </S.ProjectLink>
          </S.ProjectContainer>
        </S.ProjectsWrapper>
      </S.Wrapper>
    </>
  );
}
