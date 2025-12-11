"use client"

import React from 'react'
import ReminderList from "@/components/ReminderList"
import ReminderTabs from "@/components/ReminderTabs"
import AddReminderForm from "@/components/AddReminderForm"
import { userUIStore } from '@/store/ui.store'



function page(): React.ReactNode {
  const { isModalOpen, closeModal, openModal } = userUIStore();

  const handleModalToggle = () => {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 flex flex-col justify-center">
      <div className='flex items-center justify-center mx-auto p-2'>
        <h1 className="text-2xl md:text-3xl  font-extrabold text-gray-200">Welcome to <span className="text-amber-500">TimeBeacon</span></h1>
      </div>
      <div className='flex flex-1 justify-between items-center gap-4'>
        <h2 className="text-2xl font-bold text-gray-200 mb-4">My Reminders</h2>
        <button onClick={handleModalToggle}
          className='bg-linear-to-l from-yellow-500 via-amber-500 to-orange-500 rounded-2xl border-orange-400 p-3 text-white font-semibold hover:scale-105 transition-transform duration-200 cursor-pointer'>
          Create Reminder
        </button>
      </div>
      {(isModalOpen) && <AddReminderForm />}
      <ReminderList />
    </div>
  )
}

export default page