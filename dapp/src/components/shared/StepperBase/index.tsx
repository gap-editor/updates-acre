import React from "react"
import {
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  StepperProps,
} from "@chakra-ui/react"

export type StepBase = {
  id: string
  title: string | JSX.Element
  description?: string | JSX.Element
}

type StepperBaseProps = {
  steps: StepBase[]
  complete?: JSX.Element
  incomplete?: JSX.Element
  active?: JSX.Element
  hideDescriptionWhenInactive?: boolean
} & Omit<StepperProps, "children">

export default function StepperBase({
  steps,
  complete,
  incomplete,
  active,
  index: activeStep,
  hideDescriptionWhenInactive,
  ...stepperProps
}: StepperBaseProps) {
  return (
    <Stepper index={activeStep} {...stepperProps}>
      {steps.map((step, index) => (
        <Step key={step.id}>
          <StepIndicator>
            <StepStatus
              complete={complete ?? <StepIcon />}
              incomplete={incomplete ?? <StepNumber />}
              active={active ?? <StepNumber />}
            />
          </StepIndicator>
          <Flex direction="column" gap={2}>
            <StepTitle as="div">{step.title}</StepTitle>
            {(!hideDescriptionWhenInactive || activeStep === index) && (
              <StepDescription as="div">{step.description}</StepDescription>
            )}
          </Flex>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}
