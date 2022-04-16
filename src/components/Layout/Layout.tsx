import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { globalState } from 'utils/globalState';
import { CopyInfo } from 'sections/CopyInfo/CopyInfo';

import * as S from './Layout.styles';

interface Props {
  isReady: boolean;
  children: React.ReactChild;
}

export const Layout = (props: Props) => {
  const { children, isReady } = props;
  const router = useRouter();

  useEffect(() => {
    if (isReady && !document.body.classList.contains('isReady')) {
      document.body.classList.add('isReady');
    }
    return () => {
      document.body.classList.remove('isReady');
    };
  }, [isReady]);

  const handleBack = () => {
    if (globalState.hasVisitedLanding) {
      router.back();
    } else {
      void router.push({ pathname: '/' });
    }
  };

  return (
    <>
      <S.ReadyWrapper isReady={isReady}></S.ReadyWrapper>
      <S.AppBackground />
      {router.pathname !== '/' && (
        <S.BackWrapper>
          <S.BackBtn onClick={handleBack}>
            <S.BackBtnLabel>Back</S.BackBtnLabel>
          </S.BackBtn>
        </S.BackWrapper>
      )}

      <CopyInfo />
      {children}
    </>
  );
};
