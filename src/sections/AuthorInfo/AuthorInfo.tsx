import React, { useState } from 'react';

import { LinkHandler } from 'components/LinkHandler/LinkHandler';
import { useMediaPreload } from 'hooks/useMediaPreload';

import * as S from './AuthorInfo.styles';
import authorSrc from './images/img.jpg';
import {
  borderRadius,
  expandDuration,
  iconMargin,
  iconSize,
  photoSize,
} from './AuthorInfo.constants';

interface Props {}

export const AuthorInfo = (props: Props) => {
  const { isLoaded } = useMediaPreload({ isImage: true, mediaSrc: authorSrc.src });

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <S.Wrapper elWidth={isExpanded ? photoSize + 4.5 * iconMargin + 4 * iconSize : photoSize}>
        <S.IconsWrapper>
          <LinkHandler isExternal elHref={'https://twitter.com/zalobnymichal'}>
            <S.TwitterSvgComp />
          </LinkHandler>
          <LinkHandler isExternal elHref={'https://github.com/javusScriptus'}>
            <S.GithubSvgComp />
          </LinkHandler>
          <LinkHandler isExternal elHref={'https://www.linkedin.com/in/michal-zalobny-1a8257204/'}>
            <S.LnSvgComp />
          </LinkHandler>
          <LinkHandler isExternal elHref={'https://creativeprojects.vercel.app/'}>
            <S.WebSvgComp />
          </LinkHandler>
        </S.IconsWrapper>
      </S.Wrapper>

      <S.ImageWrapper
        isExpanded={isExpanded}
        offsetX={isExpanded ? 4.5 * iconMargin + 4 * iconSize : 0}
      >
        <S.ImageContainer onClick={() => setIsExpanded(prev => !prev)}>
          <S.AuthorImage isLoaded={isLoaded} src={authorSrc.src} />
        </S.ImageContainer>
      </S.ImageWrapper>
    </>
  );
};
