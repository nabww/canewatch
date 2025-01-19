import React from "react";
import ProfitLossWidget from "./ProfitLossWidget";
import ExpenditureByFarmWidget from "./ExpenditureByFarmWidget";
import ExpenditureByActivityWidget from "./ExpenditureByActivity";

export const availableWidgets = [
  {
    id: "profitLoss",
    name: "Profit & Loss Overview",
    component: ProfitLossWidget,
  },
  {
    id: "expenditureByFarm",
    name: "Expenditure by Farm",
    component: ExpenditureByFarmWidget,
  },
  {
    id: "expenditureByActivity",
    name: "Expenditure by Activity",
    component: ExpenditureByActivityWidget,
  },
];
