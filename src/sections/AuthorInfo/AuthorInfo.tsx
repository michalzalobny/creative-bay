import React, { useEffect, useRef, useState } from 'react';

import { LinkHandler } from 'components/LinkHandler/LinkHandler';
import { useMediaPreload } from 'hooks/useMediaPreload';

import * as S from './AuthorInfo.styles';
import authorSrc from './images/img.jpg';
import { iconMargin, iconSize, photoSize, expandDuration } from './AuthorInfo.constants';

export const AuthorInfo = () => {
  const { isLoaded } = useMediaPreload({ isImage: true, mediaSrc: authorSrc.src });
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayIcons, setDisplayIcons] = useState(false);
  const expandTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayIconsTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasExpandedRef = useRef(false);

  useEffect(() => {
    if (isExpanded) setDisplayIcons(true);

    if (!isExpanded) {
      if (displayIconsTimeoutId.current) clearTimeout(displayIconsTimeoutId.current);
      const handleDisplayIcons = () => {
        setDisplayIcons(false);
      };
      displayIconsTimeoutId.current = setTimeout(handleDisplayIcons, expandDuration * 1000);
    }

    return () => {
      if (displayIconsTimeoutId.current) clearTimeout(displayIconsTimeoutId.current);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (expandTimeoutId.current) clearTimeout(expandTimeoutId.current);
    const handleAutoExpand = () => {
      if (wasExpandedRef.current) return;
      setIsExpanded(true);
    };
    expandTimeoutId.current = setTimeout(handleAutoExpand, 4500);

    return () => {
      if (expandTimeoutId.current) clearTimeout(expandTimeoutId.current);
    };
  }, []);

  useEffect(() => {
    if (!wasExpandedRef.current && isExpanded) {
      wasExpandedRef.current = true;
    }
  }, [isExpanded]);

  return (
    <>
      <S.Wrapper
        isLoaded={isLoaded}
        elWidth={isExpanded ? photoSize + 4.75 * iconMargin + 4 * iconSize : photoSize}
      >
        <S.IconsWrapper style={{ display: displayIcons ? 'flex' : 'none' }}>
          <S.IconWrapper>
            <LinkHandler isExternal elHref={'https://twitter.com/michalzalobny'}>
              <S.TwitterSvgComp />
            </LinkHandler>
          </S.IconWrapper>
          <S.IconWrapper>
            <LinkHandler isExternal elHref={'https://github.com/javusScriptus'}>
              <S.GithubSvgComp />
            </LinkHandler>
          </S.IconWrapper>
          <S.IconWrapper>
            <LinkHandler
              isExternal
              elHref={'https://www.linkedin.com/in/michal-zalobny-1a8257204/'}
            >
              <S.LnSvgComp />
            </LinkHandler>
          </S.IconWrapper>
          <LinkHandler isExternal elHref={'https://creativeprojects.vercel.app/'}>
            <S.WebSvgComp />
          </LinkHandler>
        </S.IconsWrapper>
      </S.Wrapper>

      <S.ImageWrapper
        isExpanded={isExpanded}
        offsetX={isExpanded ? 4.75 * iconMargin + 4 * iconSize : 0}
      >
        <S.ImageContainer onClick={() => setIsExpanded(prev => !prev)}>
          <S.AuthorImage alt="author's face" src={authorSrc.src} />
        </S.ImageContainer>
      </S.ImageWrapper>
    </>
  );
};
