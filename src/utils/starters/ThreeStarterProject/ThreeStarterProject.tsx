import React, { useEffect, useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';

import { PageProps } from './ThreeStarterProject.data';
import * as S from './ThreeStarterProject.styles';
import { appState } from './ThreeStarterProject.state';
import { App } from './classes/App';

export default function ThreeStarterProject(props: PageProps) {
  const { head } = props;

  const rendererEl = useRef<HTMLDivElement | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);

  useEffect(() => {
    if (!rendererEl.current) return;

    appState.app = new App({ rendererEl: rendererEl.current, setShouldReveal });

    return () => {
      if (appState.app) {
        appState.app.destroy();
        appState.app = null;
      }
    };
  }, []);

  return (
    <>
      <Head {...head} />
      <S.Wrapper>
        <S.ReadyWrapper shouldReveal={shouldReveal} />
        <S.CanvasWrapper ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
