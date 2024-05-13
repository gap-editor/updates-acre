import { List, ListItem, ListProps } from "@chakra-ui/react"
import { AnimatePresence, Variants, motion } from "framer-motion"
import React from "react"
import ActivitiesListItem, {
  ActivitiesListItemType,
} from "./ActivitiesListItem"

const MotionList = motion(List)
const MotionListItem = motion(ListItem)

const listItemVariants: Variants = {
  mounted: { opacity: 1, x: 0 },
  dismissed: { opacity: 0, x: -48 },
}

type ActivitiesListProps = ListProps & {
  items: ActivitiesListItemType[]
}
function ActivitiesList(props: ActivitiesListProps) {
  const { items, ...restProps } = props

  const [dismissedItemIds, setDismissedItemIds] = React.useState<string[]>([])

  const handleItemDismiss = (id: string) => {
    setDismissedItemIds((prev) => [...prev, id])
  }

  return (
    <MotionList pos="relative" {...restProps}>
      {items.map((item) => (
        <AnimatePresence mode="popLayout">
          {!dismissedItemIds.includes(item.id) && (
            <MotionListItem
              layout="position"
              key={item.id}
              variants={listItemVariants}
              initial={false}
              animate="mounted"
              exit="dismissed"
              pb={2}
              _last={{ pb: 0 }}
            >
              <ActivitiesListItem
                {...item}
                handleDismiss={() => handleItemDismiss(item.id)}
              />
            </MotionListItem>
          )}
        </AnimatePresence>
      ))}
    </MotionList>
  )
}

export default ActivitiesList
