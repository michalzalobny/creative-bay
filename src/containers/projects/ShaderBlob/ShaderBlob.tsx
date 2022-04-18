import React, { useEffect, useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';

import { PageProps } from './ShaderBlob.data';
import * as S from './ShaderBlob.styles';
import { appState } from './ShaderBlob.state';
import { App } from './classes/App';

export default function ShaderBlob(props: PageProps) {
  const { head } = props;

  const rendererEl = useRef<HTMLDivElement | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (!rendererEl.current) return;

    appState.app = new App({ rendererEl: rendererEl.current, setShouldReveal, setProgressValue });
    console.log('? shaderBlob page');

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
