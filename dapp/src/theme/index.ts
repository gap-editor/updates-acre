import { StyleFunctionProps, Tooltip, extendTheme } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"
import Button from "./Button"
import Switch from "./Switch"
import { colors } from "./utils"

// Currently, there is no possibility to set all tooltips with hasArrow by defaultProps.
// Let's override the defaultProps as follows.
Tooltip.defaultProps = { ...Tooltip.defaultProps, hasArrow: true }

const defaultTheme = {
  colors,
  styles: {
    global: (props: StyleFunctionProps) => ({
      "html, body, #root, #root > div": {
        backgroundColor: mode("grey.100", "grey.300")(props),
        color: mode("black", "grey.80")(props),
        minHeight: "100vh",
      },
    }),
  },
  components: {
    Button,
    Switch,
  },
}

const theme = extendTheme(defaultTheme)

export default theme
