import styled from 'styled-components';

import { media } from 'utils/media';
import { underline, s1 } from 'utils/sharedStyled';

export const Wrapper = styled.div`
  margin: 0 auto;
  width: 80%;
  margin-top: 5rem;

  ${media.tablet} {
    width: 80rem;
    margin-top: 15rem;
  }
`;

export const ProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProjectContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  ${media.tablet} {
    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
`;

export const ProjectLink = styled.a`
  font-weight: 800;
  display: inline-block;
  position: relative;
  ${s1};
  ${underline};
`;
