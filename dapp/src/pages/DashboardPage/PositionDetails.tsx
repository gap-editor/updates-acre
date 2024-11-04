import React from "react"
import { CurrencyBalanceWithConversion } from "#/components/shared/CurrencyBalanceWithConversion"
import {
  useAllActivitiesCount,
  useBitcoinPosition,
  useTransactionModal,
  useStatistics,
} from "#/hooks"
import { ACTION_FLOW_TYPES } from "#/types"
import {
  Button,
  ButtonProps,
  Flex,
  HStack,
  // Tag,
  VStack,
} from "@chakra-ui/react"
import ArrivingSoonTooltip from "#/components/ArrivingSoonTooltip"
import UserDataSkeleton from "#/components/shared/UserDataSkeleton"
import { featureFlags } from "#/constants"
import { TextMd } from "#/components/shared/Typography"
import { BoltFilled } from "#/assets/icons"

const isWithdrawalFlowEnabled = featureFlags.WITHDRAWALS_ENABLED

const buttonStyles: ButtonProps = {
  size: "lg",
  flex: 1,
  w: { base: "auto", lg: 40 },
  fontWeight: "bold",
  lineHeight: 6,
  px: 7,
  h: "auto",
}

export default function PositionDetails() {
  const { data } = useBitcoinPosition()
  const bitcoinAmount = data?.estimatedBitcoinBalance ?? 0n

  const openDepositModal = useTransactionModal(ACTION_FLOW_TYPES.STAKE)
  const openWithdrawModal = useTransactionModal(ACTION_FLOW_TYPES.UNSTAKE)
  const activitiesCount = useAllActivitiesCount()

  const { tvl } = useStatistics()

  return (
    <Flex w="100%" flexDirection="column" gap={5}>
      <VStack alignItems="start" spacing={0}>
        <TextMd fontWeight="bold">
          Acre balance
          {/* TODO: Uncomment when position will be implemented */}
          {/* {positionPercentage && (
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
          )} */}
        </TextMd>
        <UserDataSkeleton>
          <VStack alignItems="start" spacing={0}>
            <CurrencyBalanceWithConversion
              from={{
                amount: bitcoinAmount,
                currency: "bitcoin",
                size: "4xl",
                letterSpacing: "-0.075rem", // -1.2px
                color: "grey.700",
              }}
              to={{
                currency: "usd",
                color: "grey.500",
                fontWeight: "medium",
              }}
            />
          </VStack>
        </UserDataSkeleton>
      </VStack>

      <HStack w="full" justify="start" flexWrap="wrap" spacing={2}>
        <UserDataSkeleton>
          <Button
            {...buttonStyles}
            onClick={openDepositModal}
            isDisabled={tvl.isCapExceeded}
          >
            {activitiesCount === 0 ? "Deposit" : "Deposit more"}
          </Button>
        </UserDataSkeleton>
        <UserDataSkeleton>
          <ArrivingSoonTooltip shouldDisplayTooltip={!isWithdrawalFlowEnabled}>
            <Button
              variant="outline"
              {...buttonStyles}
              onClick={openWithdrawModal}
              isDisabled={!isWithdrawalFlowEnabled}
            >
              Withdraw
            </Button>
          </ArrivingSoonTooltip>
        </UserDataSkeleton>
        {tvl.isCapExceeded && (
          <HStack align="start" spacing={1} mt={3}>
            <BoltFilled color="orange.400" my={1} />
            <VStack align="start" spacing={0}>
              <TextMd fontWeight="semibold">Deposit cap reached!</TextMd>
              <TextMd color="grey.500">
                Stay tuned for the next deposit cycle.
              </TextMd>
            </VStack>
          </HStack>
        )}
      </HStack>
    </Flex>
  )
}
