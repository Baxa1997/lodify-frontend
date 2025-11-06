import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import {MantineProvider} from "@mantine/core";
import {Provider} from "react-redux";
import {store} from "./store";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import "./index.scss";
import App from "./App.jsx";
import queryClient from "./queries/index.js";
import theme from "./theme/index.js";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MantineProvider>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ChakraProvider>
        </MantineProvider>
      </Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>
);
