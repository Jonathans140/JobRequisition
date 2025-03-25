"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, FileText, RefreshCw, Users, X } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import { RequestReviewForm } from "../../components/hr-authority/request-review-form"
import { useRequisitions } from "../../context/requisition-context"
import { cn } from "../../lib/utils"

export function HRAuthorityDashboard() {
  const toast = useToast()
  const { requisitions, updateRequisition, getRequisitionById } = useRequisitions()
  const [activeTab, setActiveTab] = useState("pending")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const selectedRequest = selectedRequestId ? getRequisitionById(selectedRequestId) : null

  const handleReviewRequest = (requestId: string) => {
    setSelectedRequestId(requestId)
    setShowReviewForm(true)
  }

  const handleApproveRequest = (requestId: string, reviewData: any) => {
    // Update the request status
    updateRequisition(requestId, {
      status: "approved",
      approvedDate: new Date().toISOString().split("T")[0],
      salaryRange: reviewData.salaryRange,
      budget: reviewData.budget,
      remarks: reviewData.remarks,
      approvedBy: reviewData.approvedBy,
      approvalSignature: reviewData.approvalSignature,
      verifiedBy: reviewData.verifiedBy,
    })

    // Show success message
    toast.success(`Job requisition ${requestId} has been approved successfully.`)

    // Reset form view
    setShowReviewForm(false)
    setSelectedRequestId(null)
    setActiveTab("approved")
  }

  const handleRejectRequest = (requestId: string, reviewData: any) => {
    // Update the request status
    updateRequisition(requestId, {
      status: "rejected",
      approvedDate: new Date().toISOString().split("T")[0],
      remarks: reviewData.remarks,
      approvedBy: reviewData.approvedBy,
      approvalSignature: reviewData.approvalSignature,
      verifiedBy: reviewData.verifiedBy,
    })

    // Show success message
    toast.info(`Job requisition ${requestId} has been rejected.`)

    // Reset form view
    setShowReviewForm(false)
    setSelectedRequestId(null)
    setActiveTab("rejected")
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
            <Users className="h-6 w-6" />
            <h1 className="text-lg font-semibold">HR & Approving Authority Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("mr-1 h-4 w-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {showReviewForm && selectedRequest ? (
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowReviewForm(false)
                  setSelectedRequestId(null)
                }}
                className="mr-2"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h2 className="text-xl font-semibold">Review Job Requisition</h2>
            </div>
            <RequestReviewForm
              request={selectedRequest}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Job Requisitions</CardTitle>
                  <CardDescription>View all job requisition requests from departments</CardDescription>
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
                            <th className="px-4 py-3">Requested By</th>
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisitions.map((request) => (
                            <tr key={request.id} className="border-b">
                              <td className="px-4 py-3 font-medium">{request.id}</td>
                              <td className="px-4 py-3">{request.positionTitle}</td>
                              <td className="px-4 py-3">{request.departmentName}</td>
                              <td className="px-4 py-3">{request.requestedBy}</td>
                              <td className="px-4 py-3">{request.submittedDate}</td>
                              <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                              <td className="px-4 py-3">
                                <Button variant="outline" size="sm" onClick={() => handleReviewRequest(request.id)}>
                                  {request.status === "pending" ? "Review" : "View Details"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <FileText className="mb-2 h-10 w-10 text-muted-foreground/60" />
                      <h3 className="mb-1 text-lg font-semibold">No requests found</h3>
                      <p className="text-sm text-muted-foreground">There are no job requisition requests to review.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>Job requisitions awaiting your review and approval</CardDescription>
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
                            <th className="px-4 py-3">Requested By</th>
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Actions</th>
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
                                <td className="px-4 py-3">{request.requestedBy}</td>
                                <td className="px-4 py-3">{request.submittedDate}</td>
                                <td className="px-4 py-3">
                                  <Button variant="outline" size="sm" onClick={() => handleReviewRequest(request.id)}>
                                    Review Request
                                  </Button>
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
                        There are no job requisitions awaiting your review.
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
                            <th className="px-4 py-3">Salary Range</th>
                            <th className="px-4 py-3">Budget</th>
                            <th className="px-4 py-3">Actions</th>
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
                                <td className="px-4 py-3">{request.salaryRange}</td>
                                <td className="px-4 py-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      request.budget === "sufficient"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-yellow-50 text-yellow-700",
                                    )}
                                  >
                                    {request.budget === "sufficient" ? "Sufficient" : "Additional Required"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <Button variant="outline" size="sm" onClick={() => handleReviewRequest(request.id)}>
                                    View Details
                                  </Button>
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
                      <p className="text-sm text-muted-foreground">You haven't approved any job requisitions yet.</p>
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
                            <th className="px-4 py-3">Actions</th>
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
                                  {request.remarks || "No reason provided"}
                                </td>
                                <td className="px-4 py-3">
                                  <Button variant="outline" size="sm" onClick={() => handleReviewRequest(request.id)}>
                                    View Details
                                  </Button>
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
                      <p className="text-sm text-muted-foreground">You haven't rejected any job requisitions.</p>
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

