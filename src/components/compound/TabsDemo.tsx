import React, { useState } from "react";
import Tabs, { TabButtonListItem } from "./Tabs";

const tabItems: TabButtonListItem[] = [
  {
    label: "Overview",
    value: "overview",
    startIcon: "Home",
  },
  {
    label: "Settings",
    value: "settings",
    startIcon: "Settings",
  },
  {
    label: "Analytics",
    value: "analytics",
    startIcon: "BarChart2",
    endIcon: "ChevronRight",
  },
  {
    label: "Profile",
    value: "profile",
    startIcon: "User",
  },
];

const TabsDemo = () => {
  const [selected, setSelected] = useState<TabButtonListItem>(tabItems[0]);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Tabs Demo</h2>

      <Tabs
        buttonList={tabItems}
        selected={selected}
        onChange={setSelected}
        fullWidth
        containerClassname="bg-base-1 dark:bg-base-4"
        buttonClassname="focus:ring-0"
      />

      <div className="mt-6 p-4 rounded-lg border">
        <p className="text-lg">
          Selected Tab: <strong>{selected.label}</strong>
        </p>
      </div>
    </div>
  );
};

export default TabsDemo;
