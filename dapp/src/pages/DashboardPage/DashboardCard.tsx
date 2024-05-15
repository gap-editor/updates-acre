/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import {
  Button,
  CardHeader,
  CardBody,
  Card,
  CardProps,
  Tag,
  HStack,
  VStack,
  ButtonProps,
} from "@chakra-ui/react"
import { TextMd } from "#/components/shared/Typography"
import IconTag from "#/components/shared/IconTag"
import { BoostArrowIcon } from "#/assets/icons"
import { CurrencyBalanceWithConversion } from "#/components/shared/CurrencyBalanceWithConversion"
import { AmountType, MODAL_TYPES } from "#/types"
import { ActivitiesList } from "#/components/shared/ActivitiesList"
import { useModal } from "#/hooks"

const buttonStyles: ButtonProps = {
  size: "lg",
  flex: 1,
  maxW: "12.5rem", // 200px
  fontWeight: "bold",
  lineHeight: 6,
  px: 7,
  h: "auto",
}

type DashboardCardProps = CardProps & {
  bitcoinAmount: AmountType
  positionPercentage?: number // TODO: Make this required in post MVP phase
}

export default function DashboardCard(props: DashboardCardProps) {
  const { bitcoinAmount, positionPercentage, ...restProps } = props

  const { openModal } = useModal()

  return (
    <Card px={5} py={10} gap={10} {...restProps}>
      <CardHeader p={0} textAlign="center">
        <TextMd fontWeight="bold">
          My position
          {positionPercentage && (
            <Tag
              px={3}
              py={1}
              ml={2}
              borderWidth={0}
              color="gold.100"
              bg="gold.700"
              fontWeight="bold"
              lineHeight={5}
              verticalAlign="baseline"
            >
              Top {positionPercentage}%
            </Tag>
          )}
        </TextMd>
      </CardHeader>
      <CardBody as={VStack} p={0} spacing={10}>
        <VStack justify="center" spacing={6}>
          <VStack justify="center" spacing={0}>
            <CurrencyBalanceWithConversion
              from={{
                amount: bitcoinAmount,
                currency: "bitcoin",
                fontSize: "6xl",
                lineHeight: 1.2,
                letterSpacing: "-0.075rem", // -1.2px
                fontWeight: "bold",
                color: "grey.700",
              }}
              to={{
                currency: "usd",
                shouldBeFormatted: false,
                color: "grey.500",
                fontWeight: "medium",
              }}
            />
          </VStack>

          <IconTag icon={BoostArrowIcon}>Rewards Boost</IconTag>
        </VStack>

        <HStack w="full" justify="center" spacing={2}>
          <Button
            {...buttonStyles}
            onClick={() => openModal(MODAL_TYPES.STAKE, { type: "stake" })}
          >
            Deposit More
          </Button>
          <Button variant="outline" {...buttonStyles}>
            Withdraw
          </Button>
        </HStack>

        <ActivitiesList />
      </CardBody>
    </Card>
  )
}
