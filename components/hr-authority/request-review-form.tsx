"use client"

import type React from "react"

import { useState } from "react"
import { Check, Loader2, X } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Textarea } from "../../components/ui/textarea"
import { SignatureCanvas } from "../../components/signature-canvas"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Separator } from "../../components/ui/separator"
import type { JobRequisition } from "../../lib/types"

interface RequestReviewFormProps {
  request: JobRequisition
  onApprove: (requestId: string, reviewData: any) => void
  onReject: (requestId: string, reviewData: any) => void
}

export function RequestReviewForm({ request, onApprove, onReject }: RequestReviewFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  const [reviewData, setReviewData] = useState({
    salaryRange: request.salaryRange || "",
    budget: request.budget || "sufficient",
    remarks: request.remarks || "",
    approvedBy: request.approvedBy || "",
    approvalSignature: request.approvalSignature || "",
    verifiedBy: request.verifiedBy || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReviewData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setReviewData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignature = (field: string, data: string) => {
    setReviewData((prev) => ({ ...prev, [field]: data }))
  }

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!reviewData.salaryRange || !reviewData.approvedBy || !reviewData.approvalSignature || !reviewData.verifiedBy) {
      alert("Please fill in all required fields and sign the form.")
      return
    }

    setAction("approve")
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      onApprove(request.id, reviewData)
    }, 1000)
  }

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!reviewData.remarks || !reviewData.approvedBy || !reviewData.approvalSignature || !reviewData.verifiedBy) {
      alert("Please provide a reason for rejection, fill in all required fields, and sign the form.")
      return
    }

    setAction("reject")
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      onReject(request.id, reviewData)
    }, 1000)
  }

  const isReadOnly = request.status !== "pending"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Job Requisition: {request.id}</CardTitle>
        <CardDescription>
          {isReadOnly
            ? "View the details of this job requisition"
            : "Review the job requisition details and approve or reject the request"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTitle>Request Details</AlertTitle>
          <AlertDescription>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Position:</strong> {request.positionTitle}
              </div>
              <div>
                <strong>Department:</strong> {request.departmentName}
              </div>
              <div>
                <strong>Requested By:</strong> {request.requestedBy}
              </div>
              <div>
                <strong>Submitted Date:</strong> {request.submittedDate}
              </div>
              <div>
                <strong>Start Date:</strong> {request.startDate || "Not specified"}
              </div>
              <div>
                <strong>Duration:</strong>{" "}
                {request.duration === "permanent" ? "Permanent" : `Temporary (until ${request.endDate})`}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {request.status_employment?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
                  "Not specified"}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Skills & Other Qualities Required</Label>
          <div className="rounded-md border border-input bg-muted/50 p-3 text-sm">
            {request.skills || "Not specified"}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Explanation Why Required</Label>
          <div className="rounded-md border border-input bg-muted/50 p-3 text-sm">
            {request.explanation || "Not specified"}
          </div>
        </div>

        <Separator />

        <form id="review-form" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salaryRange">Salary Range {!isReadOnly && <span className="text-red-500">*</span>}</Label>
            {isReadOnly ? (
              <div className="rounded-md border border-input bg-muted/50 p-3 text-sm">
                {request.salaryRange || "Not specified"}
              </div>
            ) : (
              <Input
                id="salaryRange"
                name="salaryRange"
                value={reviewData.salaryRange}
                onChange={handleChange}
                required={!isReadOnly}
                disabled={isReadOnly}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Budget</Label>
            {isReadOnly ? (
              <div className="rounded-md border border-input bg-muted/50 p-3 text-sm">
                {request.budget === "sufficient"
                  ? "Sufficient Budget"
                  : request.budget === "additional"
                    ? "Requires Additional Budget"
                    : "Not specified"}
              </div>
            ) : (
              <RadioGroup
                value={reviewData.budget}
                onValueChange={(value) => handleRadioChange("budget", value)}
                disabled={isReadOnly}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sufficient" id="sufficient" />
                  <Label htmlFor="sufficient">Sufficient Budget</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="additional" id="additional" />
                  <Label htmlFor="additional">Requires Additional Budget</Label>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks / Reason {!isReadOnly && <span className="text-red-500">*</span>}</Label>
            {isReadOnly ? (
              <div className="rounded-md border border-input bg-muted/50 p-3 text-sm">
                {request.remarks || "No remarks provided"}
              </div>
            ) : (
              <Textarea
                id="remarks"
                name="remarks"
                value={reviewData.remarks}
                onChange={handleChange}
                rows={3}
                required={!isReadOnly}
                disabled={isReadOnly}
              />
            )}
          </div>

          {!isReadOnly && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="approvedBy">
                    Approved By (Operations Manager) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="approvedBy"
                    name="approvedBy"
                    value={reviewData.approvedBy}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verifiedBy">
                    Verified By (HR Department) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="verifiedBy"
                    name="verifiedBy"
                    value={reviewData.verifiedBy}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Digital Signature (Operations Manager) <span className="text-red-500">*</span>
                </Label>
                <SignatureCanvas
                  onSave={(data) => handleSignature("approvalSignature", data)}
                  existingSignature={reviewData.approvalSignature}
                />
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isReadOnly ? (
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        ) : (
          <>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing && action === "reject" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rejecting...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" /> Reject Request
                </>
              )}
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              {isProcessing && action === "approve" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Approve Request
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

