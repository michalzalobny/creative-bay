import React from 'react';

import { LinkHandler } from 'components/LinkHandler/LinkHandler';

import { RoundButton } from '../RoundButton/RoundButton';
import * as S from './TransitionBlock.styles';

interface Props {
  elId: number;
  title: string;
  repoHref: string;
}

export const TransitionBlock = (props: Props) => {
  const { repoHref, title, elId } = props;

  return (
    <>
      <S.Wrapper>
        <S.TitleWrapper data-itransition="shouldScroll">
          <S.Title>{title}</S.Title>
        </S.TitleWrapper>

        <S.ImageContainer data-itransition-id={elId}>
          <S.BoxShadow data-itransition="shouldScroll" />

          <S.GithubWrapper>
            <LinkHandler isExternal elHref={repoHref}>
              <S.GithubLink data-itransition="shouldScroll">Code on GitHub</S.GithubLink>
            </LinkHandler>
          </S.GithubWrapper>
        </S.ImageContainer>
        <S.ButtonContainer data-itransition="shouldScroll">
          <RoundButton elId={elId} data-itransition="shouldScroll" label="Click for transition" />
        </S.ButtonContainer>
      </S.Wrapper>
    </>
  );
};
