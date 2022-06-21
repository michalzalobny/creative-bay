import React, { useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';
import { PageProps } from 'utils/sharedTypes';
import { useEffectOnce } from 'hooks/useEffectOnce';

import * as S from './ShaderBlob.styles';
import { appState } from './ShaderBlob.state';
import { App } from './classes/App';

export default function ShaderBlob(props: PageProps) {
  const { head } = props;

  const rendererEl = useRef<HTMLDivElement | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [, setProgressValue] = useState(0);

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
        <S.ReadyWrapper shouldReveal={shouldReveal} />
        <S.CanvasWrapper ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
