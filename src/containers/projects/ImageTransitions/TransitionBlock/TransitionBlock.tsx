import React, { useState } from 'react';

import { PreloadImage } from 'components/PreloadImage/PreloadImage';

import { RoundButton } from '../RoundButton/RoundButton';
import * as S from './TransitionBlock.styles';

interface Props {
  elId: number;
  title: string;
  img1: string;
}

export const TransitionBlock = (props: Props) => {
  const { img1, title, elId } = props;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <S.Wrapper>
        <S.TitleWrapper data-itransition="shouldScroll">
          <S.Title $isHovered={isHovered}>{title}</S.Title>
        </S.TitleWrapper>

        <S.ImageContainer data-itransition-id={elId}>
          <S.BoxShadow data-itransition="shouldScroll" />
        </S.ImageContainer>
        <S.ButtonContainer data-itransition="shouldScroll">
          <RoundButton
            setIsHovered={setIsHovered}
            data-itransition="shouldScroll"
            label="Click for transition"
          />
        </S.ButtonContainer>
      </S.Wrapper>
    </>
  );
};
