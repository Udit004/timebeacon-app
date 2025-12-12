"use client";

import React from "react";
import ReminderList from "@/components/ReminderList";
import AddReminderForm from "@/components/AddReminderForm";
import { userUIStore } from "@/store/ui.store";

function page(): React.ReactNode {
  const isModalOpen = userUIStore((state) => state.isModalOpen);
  const closeModal = userUIStore((state) => state.closeModal);
  const openModal = userUIStore((state) => state.openModal);
  const selectedReminder = userUIStore((state) => state.selectedReminder);

  const handleModalToggle = () => {
    isModalOpen ? closeModal() : openModal();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 flex flex-col justify-center relative z-10">
      <div className="flex items-center justify-center mx-auto p-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-200">
          Welcome to <span className="text-amber-400">TimeBeacon</span>
        </h1>
      </div>

      <div className="flex flex-1 justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">My Reminders</h2>

        <button
          onClick={handleModalToggle}
          className="bg-gradient-to-l from-yellow-500 via-amber-500 to-orange-500 
                     rounded-2xl border border-orange-400 p-3 
                     text-white font-semibold hover:scale-105
                     transition-transform duration-200 cursor-pointer"
        >
          Create Reminder
        </button>
      </div>

      {isModalOpen && (
        <AddReminderForm reminder={selectedReminder ?? undefined} />
      )}

      <ReminderList />
    </div>
  );
}

export default page;
