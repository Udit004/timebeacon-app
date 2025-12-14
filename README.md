# ⏰ TimeBeacon

**Never miss a moment.** Set reminders that shine through your day.

A beautiful and intuitive reminder application built with Next.js, featuring real-time notifications, elegant UI, and seamless user experience.

---

## ✨ Features

- 🎨 **Modern UI/UX** - Glassmorphism design with smooth animations
- ⚡ **Real-time Notifications** - Powered by Pusher for instant updates
- 🔔 **Sound Alerts** - Customizable notification sounds with toggle
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎯 **Smart Filtering** - View all, pending, or completed reminders
- ✏️ **Easy Editing** - Update reminders on the fly
- 🌙 **Dark Theme** - Beautiful amber/orange gradient theme
- ⚙️ **Background Jobs** - Scheduled with Inngest workflows
- 💾 **Database Powered** - Prisma ORM with PostgreSQL

---

## 🎨 UI Highlights

- **Hero Section** with animated gradient effects
- **Glassmorphic Cards** with hover animations
- **Color-coded Status** indicators (amber for pending, emerald for completed)
- **Smooth Transitions** and micro-interactions
- **Icon-based Navigation** using Lucide React
- **Custom Scrollbar** with gradient styling
- **Toast Notifications** with shimmer effects

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Real-time**: [Pusher](https://pusher.com/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Pusher account (free tier works)
- Inngest account (optional for workflows)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd timebeacon
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://..."
   PUSHER_APP_ID="your_app_id"
   PUSHER_KEY="your_key"
   PUSHER_SECRET="your_secret"
   PUSHER_CLUSTER="your_cluster"
   NEXT_PUBLIC_PUSHER_KEY="your_public_key"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
   INNGEST_EVENT_KEY="your_inngest_key"
   INNGEST_SIGNING_KEY="your_inngest_signing_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
timebeacon/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles & animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AddReminderForm.tsx
│   ├── ReminderList.tsx
│   ├── ReminderTabs.jsx
│   └── NotificationCenter.tsx
├── hooks/                 # Custom React hooks
├── inngest/              # Background job workflows
├── lib/                  # Utilities & configurations
├── prisma/              # Database schema & migrations
├── services/            # Business logic
├── store/              # State management
└── types/              # TypeScript types
```

---

## 🎯 Key Features Explained

### Reminder Management
- Create reminders with title, description, and datetime
- Edit existing reminders
- Delete with confirmation
- Filter by status (All/Pending/Completed)

### Real-time Notifications
- Instant push notifications via Pusher
- Sound alerts with volume control
- Visual toast messages
- Notification history with unread counter

### Background Processing
- Scheduled reminder checks with Inngest
- Automatic status updates
- Webhook-based triggers

### Time Zone Handling
- IST (Indian Standard Time) support
- Automatic UTC conversion
- Display in local timezone

---

## 🚀 Deployment

Ready to deploy? Check out the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions on deploying to Vercel.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

---

## 🎨 Customization

### Colors
The app uses an amber/orange gradient theme. To customize:
- Edit color values in [globals.css](./app/globals.css)
- Update Tailwind classes in components

### Sounds
- Add custom sound files to `public/sounds/`
- Update references in [soundPlayer.ts](./lib/soundPlayer.ts)

### Animations
- All animations defined in [globals.css](./app/globals.css)
- Customize timing and easing functions

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🐛 Troubleshooting

**Database connection issues?**
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Run `npx prisma migrate dev`

**Notifications not working?**
- Verify Pusher credentials
- Check NEXT_PUBLIC_* variables are set
- Ensure API routes are accessible

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Run `npm run build` locally first

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Real-time by [Pusher](https://pusher.com/)
- Workflows by [Inngest](https://www.inngest.com/)

---

**Made with ❤️ and ⏰**
