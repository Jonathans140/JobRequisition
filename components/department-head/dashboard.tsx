"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building, Check, Clock, FileText, Plus, RefreshCw, X } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { JobRequisitionForm } from "../../components/department-head/job-requisition-form"
import { useToast } from "../../hooks/use-toast"
import { useRequisitions } from "../../context/requisition-context"
import type { FormData } from "../../lib/types"
import { cn } from "../../lib/utils"

export function DepartmentHeadDashboard() {
  const toast = useToast()
  const { requisitions, addRequisition } = useRequisitions()
  const [activeTab, setActiveTab] = useState("requests")
  const [showForm, setShowForm] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleNewRequest = () => {
    setShowForm(true)
    setActiveTab("new")
  }

  const handleFormSubmit = (formData: FormData) => {
    // Add the new requisition
    addRequisition(formData)

    // Show success message
    toast.success(`Job requisition for ${formData.positionTitle} has been submitted successfully.`)

    // Reset form view
    setShowForm(false)
    setActiveTab("requests")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
      toast.info("Latest request statuses have been loaded.")
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Department Head Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("mr-1 h-4 w-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" onClick={handleNewRequest}>
              <Plus className="mr-1 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {showForm ? (
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center">
              <Button variant="ghost" onClick={() => setShowForm(false)} className="mr-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h2 className="text-xl font-semibold">New Job Requisition</h2>
            </div>
            <JobRequisitionForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="requests">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Job Requisitions</CardTitle>
                  <CardDescription>View and track all your submitted job requisition requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {requisitions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisitions.map((request) => (
                            <tr key={request.id} className="border-b">
                              <td className="px-4 py-3 font-medium">{request.id}</td>
                              <td className="px-4 py-3">{request.positionTitle}</td>
                              <td className="px-4 py-3">{request.departmentName}</td>
                              <td className="px-4 py-3">{request.submittedDate}</td>
                              <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{request.remarks || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <FileText className="mb-2 h-10 w-10 text-muted-foreground/60" />
                      <h3 className="mb-1 text-lg font-semibold">No requests found</h3>
                      <p className="text-sm text-muted-foreground">
                        You haven't submitted any job requisition requests yet.
                      </p>
                      <Button className="mt-4" onClick={handleNewRequest}>
                        <Plus className="mr-1 h-4 w-4" />
                        Create New Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>Job requisitions awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  {requisitions.filter((r) => r.status === "pending").length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisitions
                            .filter((request) => request.status === "pending")
                            .map((request) => (
                              <tr key={request.id} className="border-b">
                                <td className="px-4 py-3 font-medium">{request.id}</td>
                                <td className="px-4 py-3">{request.positionTitle}</td>
                                <td className="px-4 py-3">{request.departmentName}</td>
                                <td className="px-4 py-3">{request.submittedDate}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-yellow-500" />
                                    <span>Awaiting Review</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <Clock className="mb-2 h-10 w-10 text-muted-foreground/60" />
                      <h3 className="mb-1 text-lg font-semibold">No pending requests</h3>
                      <p className="text-sm text-muted-foreground">
                        You don't have any job requisitions awaiting approval.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Approved Requests</CardTitle>
                  <CardDescription>Job requisitions that have been approved</CardDescription>
                </CardHeader>
                <CardContent>
                  {requisitions.filter((r) => r.status === "approved").length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Approved Date</th>
                            <th className="px-4 py-3">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisitions
                            .filter((request) => request.status === "approved")
                            .map((request) => (
                              <tr key={request.id} className="border-b">
                                <td className="px-4 py-3 font-medium">{request.id}</td>
                                <td className="px-4 py-3">{request.positionTitle}</td>
                                <td className="px-4 py-3">{request.departmentName}</td>
                                <td className="px-4 py-3">{request.approvedDate}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Check className="mr-1 h-4 w-4 text-green-500" />
                                    <span>{request.remarks || "Approved"}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <Check className="mb-2 h-10 w-10 text-muted-foreground/60" />
                      <h3 className="mb-1 text-lg font-semibold">No approved requests</h3>
                      <p className="text-sm text-muted-foreground">You don't have any approved job requisitions yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Requests</CardTitle>
                  <CardDescription>Job requisitions that have been rejected</CardDescription>
                </CardHeader>
                <CardContent>
                  {requisitions.filter((r) => r.status === "rejected").length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Rejected Date</th>
                            <th className="px-4 py-3">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisitions
                            .filter((request) => request.status === "rejected")
                            .map((request) => (
                              <tr key={request.id} className="border-b">
                                <td className="px-4 py-3 font-medium">{request.id}</td>
                                <td className="px-4 py-3">{request.positionTitle}</td>
                                <td className="px-4 py-3">{request.departmentName}</td>
                                <td className="px-4 py-3">{request.approvedDate}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <X className="mr-1 h-4 w-4 text-red-500" />
                                    <span>{request.remarks || "Rejected"}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <X className="mb-2 h-10 w-10 text-muted-foreground/60" />
                      <h3 className="mb-1 text-lg font-semibold">No rejected requests</h3>
                      <p className="text-sm text-muted-foreground">You don't have any rejected job requisitions.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

