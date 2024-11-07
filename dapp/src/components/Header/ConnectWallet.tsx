import React from "react"
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  StackDivider,
  Tooltip,
  useClipboard,
  useMultiStyleConfig,
} from "@chakra-ui/react"
import { useIsEmbed, useModal, useWallet } from "#/hooks"
import { CurrencyBalance } from "#/components/shared/CurrencyBalance"
import { TextMd } from "#/components/shared/Typography"
import { BitcoinIcon } from "#/assets/icons"
import { referralProgram, truncateAddress } from "#/utils"
import { motion } from "framer-motion"
import { MODAL_TYPES } from "#/types"
import {
  IconCopy,
  IconLogout,
  IconWallet,
  IconUserCode,
} from "@tabler/icons-react"

function isChangeAccountFeatureSupported(embeddedApp: string | undefined) {
  return referralProgram.isEmbedApp(embeddedApp)
}

export default function ConnectWallet() {
  const { isEmbed, embeddedApp } = useIsEmbed()
  const { address, balance, onDisconnect } = useWallet()
  const { isOpenGlobalErrorModal, modalType, openModal } = useModal()
  const { hasCopied, onCopy } = useClipboard(address ?? "")
  const styles = useMultiStyleConfig("Button", {
    variant: "card",
    size: "lg",
  })

  const handleConnectWallet = (isReconnecting: boolean = false) => {
    openModal(MODAL_TYPES.CONNECT_WALLET, { isReconnecting })
  }

  if (!address) {
    return (
      <Button
        size="lg"
        variant="card"
        color="grey.700"
        leftIcon={<Icon as={BitcoinIcon} boxSize={6} color="brand.400" />}
        onClick={() => handleConnectWallet(false)}
        {...((modalType === MODAL_TYPES.CONNECT_WALLET ||
          isOpenGlobalErrorModal) && {
          pointerEvents: "none",
        })}
      >
        {`Connect ${isEmbed ? "account" : "wallet"}`}
      </Button>
    )
  }

  return (
    <HStack spacing={4}>
      <HStack display={{ base: "none", md: "flex" }}>
        <CurrencyBalance currency="bitcoin" amount={balance} />
        <Icon as={IconWallet} boxSize={5} />
      </HStack>

      <Flex
        as={motion.div}
        whileHover="expanded"
        initial="collapsed"
        animate="collapsed"
        overflow="hidden"
        {...styles}
        pr={0}
      >
        <HStack
          as={motion.div}
          variants={{
            expanded: { paddingRight: 4 },
            collapsed: { paddingRight: 16 },
          }}
          spacing={3}
        >
          <Icon as={BitcoinIcon} boxSize={6} color="brand.400" />
          <TextMd color="brand.400">{truncateAddress(address)}</TextMd>
        </HStack>

        <HStack
          as={motion.div}
          variants={{
            expanded: { width: "auto" },
            collapsed: { width: 0 },
          }}
          spacing={1}
          divider={<StackDivider borderColor="gold.500" />}
        >
          <Tooltip
            fontSize="xs"
            label={hasCopied ? "Address copied" : "Copy"}
            color="gold.200"
            px={3}
            py={2}
            closeOnClick={false}
          >
            <IconButton
              variant="ghost"
              aria-label="Copy"
              icon={<Icon as={IconCopy} boxSize={5} />}
              px={2}
              boxSize={5}
              onClick={onCopy}
            />
          </Tooltip>

          {isChangeAccountFeatureSupported(embeddedApp) && (
            <Tooltip
              fontSize="xs"
              label="Change account"
              color="gold.200"
              px={3}
              py={2}
            >
              <IconButton
                variant="ghost"
                aria-label="Change account"
                icon={<Icon as={IconUserCode} boxSize={5} />}
                px={2}
                boxSize={5}
                onClick={() => handleConnectWallet(true)}
              />
            </Tooltip>
          )}

          <Tooltip
            fontSize="xs"
            label="Disconnect"
            color="gold.200"
            px={3}
            py={2}
          >
            <IconButton
              variant="ghost"
              aria-label="Disconnect"
              icon={<Icon as={IconLogout} boxSize={5} />}
              px={2}
              boxSize={5}
              onClick={onDisconnect}
            />
          </Tooltip>
        </HStack>
      </Flex>
    </HStack>
  )
}
