import { redirect } from 'next/navigation'

export default async function DraftsPage() {
  // Redirect to profile page content tab since drafts UI has been moved there
  redirect('/profile#content')
}