import React from "react";
import { userUIStore } from "@/store/ui.store";

export default function ReminderTabs({}) {
  const { filter, setFilter } = userUIStore();

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" }
  ];


  return (
    <div className="flex justify-center w-full p-2">
      <div className="flex gap-2 my-4 w-full max-w-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 px-4 py-2 rounded-2xl border cursor-pointer transition-all ${
              filter === tab.id
                ? "bg-linear-to-r from-yellow-500 via-amber-500 to-orange-500 border-orange-500"
                : "bg-gray-200 border-gray-300"
            }`}
          >
            <span className={`font-bold text-2xl ${
              filter === tab.id ? "text-white" : "text-gray-700"
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
