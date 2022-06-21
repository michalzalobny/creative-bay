import React, { useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';
import { PageProps } from 'utils/sharedTypes';
import { useEffectOnce } from 'hooks/useEffectOnce';

import * as S from './MetaOffice.styles';
import { appState } from './MetaOffice.state';
import { App } from './classes/App';

export default function MetaOffice(props: PageProps) {
  const { head } = props;

  const rendererEl = useRef<HTMLDivElement | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffectOnce(() => {
    if (!rendererEl.current) return;

    appState.app = new App({ rendererEl: rendererEl.current, setShouldReveal, setProgressValue });

    return () => {
      if (appState.app) {
        appState.app.destroy();
        appState.app = null;
      }
    };
  });

  return (
    <>
      <Head {...head} />
      <S.Wrapper>
        <S.ReadyWrapper shouldReveal={shouldReveal}>
          <S.TitleWrapper>
            <S.Title shouldHide={shouldReveal}>Meta Office</S.Title>
          </S.TitleWrapper>
          <S.LoaderContainer>
            <S.LoaderWrapper shouldHide={shouldReveal}>
              <S.LoaderLine progress={progressValue} />
            </S.LoaderWrapper>
          </S.LoaderContainer>
        </S.ReadyWrapper>
        <S.CanvasWrapper ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
