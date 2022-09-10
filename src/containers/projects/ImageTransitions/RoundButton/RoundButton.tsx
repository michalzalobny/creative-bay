import React from 'react';

import * as S from './RoundButton.styles';

interface Props {
  label: string;
  elId: number;
}

export const RoundButton = (props: Props) => {
  const { elId, label } = props;

  return (
    <>
      <S.Wrapper data-itransition-btn={elId}>
        <S.LabelsContainer>
          <S.Label data-rb="label">{label}</S.Label>
          <S.LabelCopy data-rb="labelCopy">{label}</S.LabelCopy>
        </S.LabelsContainer>
      </S.Wrapper>
    </>
  );
};
