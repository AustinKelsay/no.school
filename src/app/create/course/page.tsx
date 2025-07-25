import { redirect } from 'next/navigation'

export default async function CreateCoursePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ draft?: string }> 
}) {
  const params = await searchParams
  
  // Redirect to the main create page with course tab selected
  const queryParams = new URLSearchParams()
  queryParams.set('type', 'course')
  if (params.draft) {
    queryParams.set('draft', params.draft)
  }
  
  redirect(`/create?${queryParams.toString()}`)
}