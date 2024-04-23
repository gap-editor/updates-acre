import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { AcreSdkProvider } from "./acre-react/contexts"
import GlobalStyles from "./components/GlobalStyles"
import {
  DocsDrawerContextProvider,
  LedgerWalletAPIProvider,
  SidebarContextProvider,
  WalletContextProvider,
} from "./contexts"
import { AcreSdkProvider } from "./acre-react/contexts"
import GlobalStyles from "./components/GlobalStyles"
import { router } from "./router"
import { useInitApp } from "./hooks"
import { Router } from "./router"
import { store } from "./store"
import theme from "./theme"

function DApp() {
  useInitApp()

  return (
    <>
      <GlobalStyles />
      <Router />
    </>
  )
}

function DAppProviders() {
  return (
    <LedgerWalletAPIProvider>
      <WalletContextProvider>
        <AcreSdkProvider>
          <DocsDrawerContextProvider>
            <SidebarContextProvider>
              <ReduxProvider store={store}>
                <ChakraProvider theme={theme}>
                  <DApp />
                </ChakraProvider>
              </ReduxProvider>
            </SidebarContextProvider>
          </DocsDrawerContextProvider>
        </AcreSdkProvider>
      </WalletContextProvider>
    </LedgerWalletAPIProvider>
  )
}

export default DAppProviders
