# Technova Registration Portal

A modern web application built for managing event registrations, submissions, and receipts for the Technova event. It features a fully-fledging admin dashboard to view, approve, and verify user submissions alongside their payment receipts.

## 🚀 Features

- **Event Registration:** Users can register for different modules and sub-games, fill in their team members' CNIC / contact information, and upload payment receipts.
- **Admin Dashboard:** Secure dashboard for event administrators to view all incoming submissions.
- **Data Export:** Easily export all submission data and member details to an extensively formatted Excel (`.xlsx`) sheet.
- **Bulk Receipt Download:** Admins can download a `.zip` file containing all payment receipts corresponding to filtered submissions.
- **Real-time Status Tracking:** Verify and update payment statuses (e.g., Pending, Approved) directly through the portal.
- **Responsive Design:** Optimized for both desktop and mobile views.

## 🛠 Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase (Authentication & Cloud Firestore)
- **Icons:** Lucide React
- **Data Export:** `xlsx` (Excel processing), `jszip` and `file-saver` (ZIP archiving)
- **Routing:** React Router v6
- **Animations:** Framer Motion (Motion for React)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd technova-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/src/pages`: Contains main page components (e.g., Home, Admin).
- `/src/components`: Reusable UI components.
- `/src/assets`: Static assets including images and Base64 formatted logos.
- `/src/lib`: Configuration scripts (like Firebase init).
- `/src/services`: API handlers and database interaction layers (e.g., submission services).
- `/src/data`: Static data constants, available modules, pricing.

## 📄 License

This project is licensed under the MIT License.
