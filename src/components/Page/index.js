import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1600px;
  margin: 0px auto;
  padding: 0px 40px;
  position: relative;
  z-index: 2;
`;

function Page({ children }) {
  return (
    <PageWrapper>
      {children}
    </PageWrapper>
  );
}

export default Page;