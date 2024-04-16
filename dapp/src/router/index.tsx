import React from "react"
import { createBrowserRouter } from "react-router-dom"
import LandingPage from "#/pages/LandingPage"
import ActivityPage from "#/pages/ActivityPage"
import { routerPath } from "./path"

export const router = createBrowserRouter([
  {
    path: routerPath.home,
    element: <LandingPage />,
    index: true,
  },
  {
    path: `${routerPath.activity}/:activityId`,
    element: <ActivityPage />,
  },
  // {
  //   path: `${routerPath.activity}/:activityId`,
  //   element: <ActivityPage />,
  // },
])
