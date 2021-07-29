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

        *::-webkit-scrollbar {
          width: 0.7em;
        }

        *::-webkit-scrollbar-track {
          background-color: #e4e4e4;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #e2e2e2;
          border-radius: 100px;
        }
      `}
    />
  );
}
