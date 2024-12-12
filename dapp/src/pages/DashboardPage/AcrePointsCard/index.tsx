import React from "react"
import { H4, TextMd } from "#/components/shared/Typography"
import {
  Card,
  CardBody,
  CardHeader,
  CardProps,
  HStack,
  Image,
  VStack,
} from "@chakra-ui/react"
import { numberToLocaleString } from "#/utils"
import { useAcrePointsData, useUserPointsData, useWallet } from "#/hooks"
import UserDataSkeleton from "#/components/shared/UserDataSkeleton"
import TooltipIcon from "#/components/shared/TooltipIcon"
import acrePointsIllustrationSrc from "#/assets/images/acre-points-illustration.png"
import AcrePointsLabel from "./AcrePointsLabel"

export default function AcrePointsCard(props: CardProps) {
  const { data: acrePointsData } = useAcrePointsData()
  const { data: userPointsData } = useUserPointsData()
  const { isConnected } = useWallet()

  const formattedUserTotalBalance = numberToLocaleString(
    userPointsData?.totalBalance ?? 0,
  )
  const formattedTotalPoolBalance = numberToLocaleString(
    acrePointsData?.totalPoolBalance ?? 0,
  )

  return (
    <Card {...props}>
      <CardHeader mb={2} as={HStack} justify="space-between">
        <TextMd color="grey.700">
          {isConnected ? "Your" : "Total"} Acre points
        </TextMd>

        <TooltipIcon
          label={
            isConnected
              ? "Your current balance of Acre points collected so far. New points drop daily and are ready to be claimed. Unclaimed points roll over to the next day."
              : "Total points distributed to Acre users so far. New points drop daily and can be claimed in each user's dashboard."
          }
          w={56}
        />
      </CardHeader>

      <CardBody>
        <UserDataSkeleton>
          <H4 fontWeight="semibold" mb={2}>
            {isConnected
              ? formattedUserTotalBalance
              : formattedTotalPoolBalance}
          </H4>
        </UserDataSkeleton>

        <Image src={acrePointsIllustrationSrc} mt={6} />

        <UserDataSkeleton>
          <VStack px={4} py={5} spacing={0} rounded="lg" bg="gold.100">
            <AcrePointsLabel />
          </VStack>
        </UserDataSkeleton>
      </CardBody>
    </Card>
  )
}
