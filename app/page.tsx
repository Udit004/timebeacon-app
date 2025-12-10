import React from 'react'
import  ReminderList from "@/components/ReminderList"
import  AddReminderForm  from "@/components/AddReminderForm"
import { Metadata } from 'next'

const metedata: Metadata = {
  title: "TimeBeacon - Tasks Reminders",
  description: "Manage your reminders with TimeBeacon",
}

function page(): React.ReactNode {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 flex flex-col justify-center">
      <AddReminderForm />
      <ReminderList />
    </div>
  )
}

export default page