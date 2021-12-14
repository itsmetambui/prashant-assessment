import "../mock";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalProvider, BaseModalBackground } from "styled-react-modal";
import styled, { createGlobalStyle } from "styled-components";

const queryClient = new QueryClient();

import store from "../app/store";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, Open-Sans, Helvetica, Sans-Serif;
  }
`;

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider backgroundComponent={FadingBackground}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  );
}
