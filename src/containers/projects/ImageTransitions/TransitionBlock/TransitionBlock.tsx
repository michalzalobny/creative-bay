import React, { useState } from 'react';

import { RoundButton } from '../RoundButton/RoundButton';
import * as S from './TransitionBlock.styles';

interface Props {
  elId: number;
  title: string;
}

export const TransitionBlock = (props: Props) => {
  const { title, elId } = props;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <S.Wrapper>
        <S.TitleWrapper data-itransition="shouldScroll">
          <S.Title $isHovered={false}>{title}</S.Title>
        </S.TitleWrapper>

        <S.ImageContainer data-itransition-id={elId}>
          <S.BoxShadow data-itransition="shouldScroll" />
        </S.ImageContainer>
        <S.ButtonContainer data-itransition="shouldScroll">
          <RoundButton
            elId={elId}
            setIsHovered={setIsHovered}
            data-itransition="shouldScroll"
            label="Click for transition"
          />
        </S.ButtonContainer>
      </S.Wrapper>
    </>
  );
};
