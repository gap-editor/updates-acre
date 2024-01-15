import {
  ComponentSingleStyleConfig,
  StyleFunctionProps,
} from "@chakra-ui/react"

// TODO: Update the button styles correctly when ready
const Button: ComponentSingleStyleConfig = {
  baseStyle: {
    size: "md",
    borderRadius: "lg",
  },
  sizes: {
    md: {
      fontSize: "sm",
      py: "0.5rem",
    },
    lg: {
      fontSize: "md",
      py: "1rem",
    },
  },
  variants: {
    solid: {
      bg: "brand.400",
      color: "white",
      _hover: {
        bg: "brand.500",
      },
      _active: {
        bg: "brand.400",
      },
    },
    outline: {
      color: "grey.700",
      borderColor: "grey.700",
      _hover: {
        bg: "opacity.grey.700.05",
      },
      _active: {
        bg: "transparent",
      },
    },
    card: (props: StyleFunctionProps) => {
      const defaultStyles = {
        borderWidth: "2px",
        borderColor: "gold.100",
        borderRadius: "xl",
        bg: "gold.200",
        _hover: {
          bg: "opacity.grey.700.05",
        },
        _active: {
          bg: "transparent",
        },
      }

      if (props.colorScheme === "error") {
        return {
          ...defaultStyles,
          color: "red.400",
          borderColor: "red.400",
          bg: "transparent",
        }
      }

      return defaultStyles
    },
    pagination: {
      bg: "white",
      color: "grey.700",
      border: "1px solid transparent",

      _hover: {
        borderColor: "white",
        bg: "opacity.white.6",
      },
      _disabled: {
        color: "grey.200",
        bg: "white",
        opacity: 1,
        pointerEvents: "none",
      },
    },
  },
}

export default Button
