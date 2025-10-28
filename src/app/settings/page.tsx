import { type Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings and linked authentication methods"
}

export default function SettingsPage() {
  redirect("/profile?tab=settings")
}
