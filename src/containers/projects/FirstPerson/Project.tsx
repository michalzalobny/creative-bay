import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Head } from 'seo/Head/Head';
import { useEffectOnce } from 'hooks/useEffectOnce';

import { PageProps } from './Project.data';
import * as S from './Project.styles';
import { appState } from './Project.state';
import { App } from './classes/App';

export default function Project(props: PageProps) {
  const { head } = props;

  const rendererEl = useRef<HTMLDivElement | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [, setProgressValue] = useState(0);
  const [infoText, setInfoText] = useState('Loading...');

  useEffectOnce(() => {
    if (!rendererEl.current) return;
    appState.app = new App({
      rendererEl: rendererEl.current,
      setShouldReveal,
      setProgressValue,
      setInfoText,
    });

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
        <S.ReadyWrapper shouldReveal={shouldReveal} />
        <S.InfoBoard data-first-peron="board">
          <AnimatePresence>
            <S.InfoBoardText
              variants={{
                initial: {
                  opacity: 0,
                },
                animate: {
                  opacity: 1,
                },
                exit: {
                  opacity: 0,
                },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              key={infoText}
            >
              {infoText}
            </S.InfoBoardText>
          </AnimatePresence>
        </S.InfoBoard>
        <S.ExitInfo data-first-peron="esc">Press ESC to pause</S.ExitInfo>
        <S.CanvasWrapper data-first-peron="holder" ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
