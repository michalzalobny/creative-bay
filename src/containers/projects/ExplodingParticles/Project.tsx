import React, { useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';
import { useEffectOnce } from 'hooks/useEffectOnce';
import { isIosMobile } from 'utils/functions/detectDevice';

import { PageProps } from './Project.data';
import * as S from './Project.styles';
import { appState } from './Project.state';
import { App } from './classes/App';

export default function Project(props: PageProps) {
  const { head } = props;

  const rendererEl = useRef<HTMLDivElement | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [showGate, setShowGate] = useState(false);

  useEffectOnce(() => {
    const isIos = isIosMobile();
    if (!isIos) return;

    //This will fire on exit on ios
    return () => {
      if (appState.app) {
        appState.app.destroy();
        appState.app = null;
      }
    };
  });

  useEffectOnce(() => {
    const isIos = isIosMobile();
    if (isIos) return setShowGate(true);

    if (!rendererEl.current) return;
    appState.app = new App({ rendererEl: rendererEl.current, setShouldReveal });

    //this will fire on exit on everything apart from ios
    return () => {
      if (appState.app) {
        appState.app.destroy();
        appState.app = null;
      }
    };
  });

  const handleGateClick = () => {
    if (!rendererEl.current) return;
    appState.app = new App({ rendererEl: rendererEl.current, setShouldReveal });
    setShowGate(false);
  };

  return (
    <>
      <Head {...head} />
      <S.Wrapper>
        <S.GateWrapper $showGate={showGate}>
          <S.GateEnterButton onClick={handleGateClick}>
            Click to enter the experience
          </S.GateEnterButton>
        </S.GateWrapper>
        <S.ReadyWrapper shouldReveal={shouldReveal} />
        <S.VideoWrapper data-particle="wrapper" />
        <S.CanvasWrapper ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
