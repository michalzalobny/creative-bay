import React, { useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';
import { useEffectOnce } from 'hooks/useEffectOnce';

import { PageProps } from './Project.data';
import * as S from './Project.styles';
import { appState } from './Project.state';
import { App } from './classes/App';
import { TransitionBlock } from './TransitionBlock/TransitionBlock';
import { dataArray } from './Project.data';

export default function Project(props: PageProps) {
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
        <S.ScrollContainer style={{ overflowY: 'scroll' }} data-itransition="scrollContainer">
          <div data-itransition="scrollContainerContent" />
        </S.ScrollContainer>

        <S.MockWrapper style={{ overflowY: 'scroll' }} data-itransition="scrollMockWrapper">
          <S.ContentWrapper>
            {dataArray.map(item => {
              return (
                <TransitionBlock
                  repoHref={item.repoHref}
                  title={item.title}
                  elId={item.elId}
                  key={item.elId}
                />
              );
            })}
          </S.ContentWrapper>
        </S.MockWrapper>

        <S.ReadyWrapper shouldReveal={shouldReveal} />
        <S.CanvasWrapper ref={rendererEl} />
      </S.Wrapper>
    </>
  );
}
