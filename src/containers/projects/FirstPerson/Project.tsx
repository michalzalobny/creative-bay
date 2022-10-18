import React, { useState, useRef } from 'react';

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

  useEffectOnce(() => {
    console.log('loaded useEffect');
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
        <S.ReadyWrapper shouldReveal={shouldReveal} />
        <S.CanvasWrapper data-first-peron="holder" ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
