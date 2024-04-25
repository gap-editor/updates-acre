import React from "react"
import { ListItem, ListItemProps, VStack } from "@chakra-ui/react"
import { TextMd } from "../Typography"

export type TransactionDetailsItemProps = {
  label: string
  value?: string
  children?: React.ReactNode
} & ListItemProps

function TransactionDetailsItem({
  label,
  value,
  children,
  ...listItemProps
}: TransactionDetailsItemProps) {
  return (
    <ListItem
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      {...listItemProps}
    >
      <VStack alignItems="start" gap={0}>
        <TextMd
          display="flex"
          alignItems="center"
          fontWeight="semibold"
          color="grey.700"
        >
          {label}
        </TextMd>
      </VStack>
      {value ? <TextMd color="grey.700">{value}</TextMd> : children}
    </ListItem>
  )
}

export default TransactionDetailsItem
