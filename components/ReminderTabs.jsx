import React from "react";
import { userUIStore } from "@/store/ui.store";
import { List, Clock, CheckCircle2 } from "lucide-react";

export default function ReminderTabs({}) {
  const { filter, setFilter } = userUIStore();

  const tabs = [
    { id: "all", label: "All", icon: List },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "completed", label: "Completed", icon: CheckCircle2 }
  ];

  return (
    <div className="flex justify-center w-full mb-6">
      <div className="inline-flex gap-2 bg-gray-800/40 backdrop-blur-sm p-2 rounded-2xl border border-gray-700/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === tab.id
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${
                filter === tab.id ? "scale-110" : "group-hover:scale-110"
              }`} />
              <span className="text-sm">{tab.label}</span>
              
              {/* Active indicator */}
              {filter === tab.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
