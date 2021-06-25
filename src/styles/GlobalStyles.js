import { Global, css } from '@emotion/react';

export default function GlobalStyles() {
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
      `}
    />
  );
}
