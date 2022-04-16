import React from 'react';

import { LinkHandler } from 'components/LinkHandler/LinkHandler';

import * as S from './CopyInfo.styles';

export const CopyInfo = () => {
  return (
    <>
      <S.GithubWrapper>
        <LinkHandler isExternal elHref="https://github.com/javusScriptus/creative-bay">
          <S.GithubLink>GitHub repo</S.GithubLink>
        </LinkHandler>
      </S.GithubWrapper>
      <S.AuthorWrapper>
        <LinkHandler isExternal elHref="https://creativeprojects.vercel.app/">
          <S.AuthorLink>Michal Zalobny</S.AuthorLink>
        </LinkHandler>
        portfolio 2022 - WebGL and GLSL
      </S.AuthorWrapper>
    </>
  );
};
