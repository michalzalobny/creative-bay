import styled from 'styled-components';

import { media } from 'utils/media';
import { underline, s1 } from 'utils/sharedStyled';

export const Wrapper = styled.div`
  margin: 0 auto;
  width: 90%;
  margin-top: 10rem;

  ${media.tablet} {
    width: 120rem;
  }
`;

export const ProjectsWrapper = styled.div`
  margin: 4rem;
  display: flex;
  flex-direction: column;
`;

export const ProjectContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 3rem;
  }
`;

export const ProjectLink = styled.a`
  font-weight: 800;
  display: inline-block;
  position: relative;
  ${s1};
  ${underline};
`;
