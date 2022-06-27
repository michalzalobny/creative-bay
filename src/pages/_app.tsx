import React, { useState, useEffect, useRef } from 'react';
import 'focus-visible';
import '../styles/index.scss';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import FontFaceObserver from 'fontfaceobserver';
import { GlobalStyles } from 'utils/GlobalStyles';
import { globalState } from 'utils/globalState';
import { Layout } from 'components/Layout/Layout';
import { CanvasApp } from 'classes/CanvasApp';
import { PageProps } from 'utils/sharedTypes';
import { useEffectOnce } from 'hooks/useEffectOnce';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const canvasAppRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fontA = new FontFaceObserver('opensans');

    Promise.all([fontA.load(null, 1500)])
      .then(
        () => {
          setIsReady(true);
        },
        () => {
          setIsReady(true);
          console.warn('Fonts were loading too long (over 1500ms)');
        }
      )
      .catch(err => {
        setIsReady(true);
        console.warn('Some critical font are not available:', err);
      });
  }, []);

  useEffectOnce(() => {
    if (!canvasAppRef.current) return;
    globalState.canvasApp = new CanvasApp({ rendererEl: canvasAppRef.current });

    return () => {
      if (globalState.canvasApp) globalState.canvasApp.destroy();
    };
  });

  //Handle showing/hiding cursor on certain paths
  useEffect(() => {
    if (!globalState.canvasApp) return;

    const hideCursorArr = [
      '/projects/drop-unveil',
      '/projects/meta-office',
      '/projects/shader-blob',
    ];

    const match = hideCursorArr.find(el => el === router.route);

    if (match) {
      globalState.canvasApp.cursor2D.hide();
    } else {
      globalState.canvasApp.cursor2D.show();
    }
  }, [router]);

  useEffect(() => {
    const links = Array.from(document.querySelectorAll('a, button'));

    const handleMouseEnter = () => {
      if (globalState.canvasApp) {
        globalState.canvasApp.cursor2D.zoomIn();
        globalState.canvasApp.cursor2D.slowLerp();
      }
    };

    const handleMouseLeave = () => {
      if (globalState.canvasApp) {
        globalState.canvasApp.cursor2D.zoomOut();
        globalState.canvasApp.cursor2D.speedLerp();
      }
    };

    links.forEach(link => {
      if ((link as HTMLElement).dataset.cursor === 'nohover') return;
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      links.forEach(link => {
        if ((link as HTMLElement).dataset.cursor === 'nohover') return;
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (globalState.canvasApp) {
        globalState.canvasApp.cursor2D.zoomOut();
        globalState.canvasApp.cursor2D.speedLerp();
      }
    };
  }, [router]);

  return (
    <>
      <GlobalStyles />
      <Layout
        inspirationHref={(pageProps as PageProps).inspirationHref}
        inspirationName={(pageProps as PageProps).inspirationName}
        repoHref={(pageProps as PageProps).repoHref}
        isReady={isReady}
      >
        <>
          <div ref={canvasAppRef} className="canvas__wrapper" />
          <Component
            key={`${router.route}${router.locale === undefined ? '' : router.locale}`}
            router={router}
            {...pageProps}
          />
        </>
      </Layout>
    </>
  );
}
