import { extendTheme } from "@chakra-ui/react"
import { buttonTheme } from "./Button"
import { switchTheme } from "./Switch"
import {
  colors,
  fonts,
  lineHeights,
  semanticTokens,
  styles,
  zIndices,
} from "./utils"
import { drawerTheme } from "./Drawer"
import { modalTheme } from "./Modal"
import { cardTheme } from "./Card"
import { tooltipTheme } from "./Tooltip"
import { headingTheme } from "./Heading"
import { sidebarTheme } from "./Sidebar"
import { currencyBalanceTheme } from "./CurrencyBalance"
import { tokenBalanceInputTheme } from "./TokenBalanceInput"
import { inputTheme } from "./Input"
import { stepperTheme } from "./Stepper"
import { alertTheme } from "./Alert"
import { formTheme } from "./Form"
import { formLabelTheme } from "./FormLabel"
import { formErrorTheme } from "./FormError"
import { tabsTheme } from "./Tabs"
import { tagTheme } from "./Tag"
import { spinnerTheme } from "./Spinner"
import { tableTheme } from "./Table"
import { currencyIconTheme } from "./CurrencyIcon"
import { statusInfoTheme } from "./StatusInfo"
import { linkTheme } from "./Link"
import { skeletonTheme } from "./Skeleton"
import { closeButtonTheme } from "./CloseButton"

const defaultTheme = {
  // TODO: Remove when dark mode is ready
  // Color mode should be detected by hook useDetectThemeMode
  initialColorMode: "light",
  useSystemColorMode: false,
  colors,
  fonts,
  lineHeights,
  zIndices,
  semanticTokens,
  styles,
  components: {
    Alert: alertTheme,
    Button: buttonTheme,
    Card: cardTheme,
    CurrencyBalance: currencyBalanceTheme,
    Drawer: drawerTheme,
    Form: formTheme,
    FormLabel: formLabelTheme,
    FormError: formErrorTheme,
    Heading: headingTheme,
    Input: inputTheme,
    Link: linkTheme,
    Modal: modalTheme,
    Sidebar: sidebarTheme,
    Spinner: spinnerTheme,
    Stepper: stepperTheme,
    Switch: switchTheme,
    Tabs: tabsTheme,
    Tag: tagTheme,
    TokenBalanceInput: tokenBalanceInputTheme,
    Tooltip: tooltipTheme,
    Table: tableTheme,
    CurrencyIcon: currencyIconTheme,
    StatusInfo: statusInfoTheme,
    Skeleton: skeletonTheme,
    CloseButton: closeButtonTheme,
  },
}

const theme = extendTheme(defaultTheme)

export default theme
