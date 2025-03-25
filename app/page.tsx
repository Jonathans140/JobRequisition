import Link from "next/link"
import { Building, Users } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">HT MANUFACTORY</h1>
          <h2 className="text-xl font-semibold text-gray-700">JOB REQUISITION SYSTEM</h2>
          <p className="mt-2 text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Building className="h-6 w-6" />
                Department Head
              </CardTitle>
              <CardDescription>Submit new job requisitions and track their status</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <p>Access your dashboard to create new job requisition requests and monitor approval status.</p>
            </CardContent>
            <CardFooter>
              <Link href="/department-head" className="w-full">
                <Button className="w-full">Enter Department Head Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                HR & Approving Authority
              </CardTitle>
              <CardDescription>Review and approve job requisition requests</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <p>Access your dashboard to review pending job requisitions, approve or reject requests.</p>
            </CardContent>
            <CardFooter>
              <Link href="/hr-authority" className="w-full">
                <Button className="w-full">Enter HR & Authority Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

