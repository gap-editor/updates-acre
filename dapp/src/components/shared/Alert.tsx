import React from "react"
import {
  Alert as ChakraAlert,
  AlertIcon,
  AlertProps as ChakraAlertProps,
  Icon,
  CloseButton,
  HStack,
} from "@chakra-ui/react"
import { AlertError, AlertInfo } from "#/assets/icons"

const ICONS = {
  info: AlertInfo,
  error: AlertError,
}

export type AlertStatus = keyof typeof ICONS

export type AlertProps = ChakraAlertProps & {
  status?: AlertStatus
  alertIconColor?: string
  withAlertIcon?: boolean
  withCloseButton?: boolean
  icon?: typeof Icon
  onClose?: () => void
}

export default function Alert({
  status = "info",
  alertIconColor,
  withAlertIcon,
  children,
  withCloseButton,
  onClose,
  ...props
}: AlertProps) {
  return (
    <ChakraAlert status={status} {...props}>
      {withAlertIcon && status && (
        <AlertIcon boxSize={6} as={ICONS[status]} color={alertIconColor} />
      )}
      <HStack w="100%" justifyContent="space-between">
        {children}
        {withCloseButton && <CloseButton onClick={onClose} />}
      </HStack>
    </ChakraAlert>
  )
}
