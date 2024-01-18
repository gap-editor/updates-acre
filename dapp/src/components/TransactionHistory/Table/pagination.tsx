import React from "react"
import { UseTransactionHistoryTableResult } from "#/types"
import { ArrowLeft, ArrowRight } from "#/static/icons"

export const PAGINATION_BUTTONS = [
  {
    icon: <ArrowLeft />,
    ariaLabel: "Previous Page",
    onClick: (table: UseTransactionHistoryTableResult) => table.previousPage(),
    isDisabled: (table: UseTransactionHistoryTableResult) =>
      !table.getCanPreviousPage(),
  },
  {
    icon: <ArrowRight />,
    ariaLabel: "Next Page",
    onClick: (table: UseTransactionHistoryTableResult) => table.nextPage(),
    isDisabled: (table: UseTransactionHistoryTableResult) =>
      !table.getCanNextPage(),
  },
]
