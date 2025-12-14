"use client";

import React from "react";
import ReminderList from "@/components/ReminderList";
import AddReminderForm from "@/components/AddReminderForm";
import { userUIStore } from "@/store/ui.store";
import { Plus, Clock } from "lucide-react";

function page(): React.ReactNode {
  const isModalOpen = userUIStore((state) => state.isModalOpen);
  const closeModal = userUIStore((state) => state.closeModal);
  const openModal = userUIStore((state) => state.openModal);
  const selectedReminder = userUIStore((state) => state.selectedReminder);

  const handleModalToggle = () => {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Hero Content */}
          <div className="text-center space-y-6 mb-12">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 mb-4 animate-float">
              <Clock className="w-10 h-10 text-amber-400" />
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 mb-4 tracking-tight">
                TimeBeacon
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Never miss a moment. Set reminders that shine through your day.
              </p>
            </div>
            
            {/* CTA Button */}
            <button
              onClick={handleModalToggle}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl border border-amber-400/50 text-white font-bold text-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Plus className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Create New Reminder</span>
            </button>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-3xl border border-amber-500/20 shadow-2xl overflow-hidden">
          <ReminderList />
        </div>
      </div>

      {/* Modal - Rendered at top level for proper positioning */}
      {isModalOpen && (
        <AddReminderForm reminder={selectedReminder ?? undefined} />
      )}
    </div>
  );
}

export default page;
