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
            <S.ProjectLink target="_blank" href="https://portfolio2023.michalzalobny.com/">
              1. Portfolio 2023
            </S.ProjectLink>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/first-person" passHref>
              <S.ProjectLink>2. First Person Controls</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/image-transitions" passHref>
              <S.ProjectLink>3. GLSL Image Transitions</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="https://react-just-parallax.michalzalobny.com/" passHref>
              <S.ProjectLink target="_blank">4. React Just Parallax</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/meta-office" passHref>
              <S.ProjectLink>5. Meta Office</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/exploding-particles" passHref>
              <S.ProjectLink>6. Exploding Particles</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/drop-unveil" passHref>
              <S.ProjectLink>7. Drop Unveil</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <Link href="/projects/shader-blob" passHref>
              <S.ProjectLink>8. Shader Blob</S.ProjectLink>
            </Link>
          </S.ProjectContainer>
          <S.ProjectContainer>
            <S.ProjectLink target="_blank" href="https://portfolio2021.michalzalobny.com/">
              9. Portfolio 2021
            </S.ProjectLink>
          </S.ProjectContainer>
        </S.ProjectsWrapper>
      </S.Wrapper>
    </>
  );
}
