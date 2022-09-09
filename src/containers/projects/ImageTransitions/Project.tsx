import React, { useState, useRef } from 'react';

import { Head } from 'seo/Head/Head';
import { useEffectOnce } from 'hooks/useEffectOnce';

import { PageProps } from './Project.data';
import * as S from './Project.styles';
import { appState } from './Project.state';
import { App } from './classes/App';
import { TransitionBlock } from './TransitionBlock/TransitionBlock';

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

  const dataArray = [
    {
      img1Src:
        'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632246/fynn-schmidt-hKwWA1nNKt4-unsplash_1_lwk6n3.jpg',
      img2Src:
        'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632243/mehmet-turgut-kirkgoz-1-6BbBXcEf0-unsplash_1_klrw1p.jpg',
      title: 'Tiled Transition',
      repoHref: 'https://github.com/',
      elId: 0,
    },
    {
      img1Src:
        'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662632246/fynn-schmidt-hKwWA1nNKt4-unsplash_1_lwk6n3.jpg',
      img2Src:
        'https://res.cloudinary.com/dpv0ukspz/image/upload/v1662673720/pawel-czerwinski-OG44d93iNJk-unsplash_mlqhts.jpg',
      title: 'Wave Transition',
      repoHref: 'https://github.com/',
      elId: 1,
    },
  ];

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
                  img1={item.img2Src}
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
