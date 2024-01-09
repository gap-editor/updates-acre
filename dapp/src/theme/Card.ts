import { ComponentSingleStyleConfig } from "@chakra-ui/react"

const Card: ComponentSingleStyleConfig = {
  baseStyle: {
    container: {
      boxShadow: "none",
      borderWidth: "2px",
      borderColor: "gold.100",
      borderRadius: "xl",
      bg: "gold.200",
    },
  },
  variants: {
    sidebar: {
      container: {
        marginTop: "3",
        bg: "gold.100",
        borderColor: "white",
        borderStyle: "solid",
        borderRadius: "6px",
      },
    },
  },
}

export default Card
