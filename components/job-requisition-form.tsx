"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Loader2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Textarea } from "../components/ui/textarea"
import { useToast } from "../hooks/use-toast"
import { SignatureCanvas } from "../components/signature-canvas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

export function JobRequisitionForm() {
  const toast = useToast()
  const router = useRouter()
  const [step, setStep] = useState<"department" | "approval">("department")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formApproved, setFormApproved] = useState(false)

  const [formData, setFormData] = useState({
    positionTitle: "",
    departmentName: "",
    startDate: "",
    skills: "",
    explanation: "",
    duration: "permanent",
    endDate: "",
    status: "full-time",
    requestedBy: "",
    requestSignature: "",
    // Approval section
    salaryRange: "",
    budget: "sufficient",
    approvedBy: "",
    approvalSignature: "",
    remarks: "",
    verifiedBy: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignature = (field: string, data: string) => {
    setFormData((prev) => ({ ...prev, [field]: data }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.positionTitle || !formData.departmentName || !formData.requestedBy || !formData.requestSignature) {
      toast.error("Please fill in all required fields and sign the form.")
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
      toast.success("Your job requisition has been sent to HR & Approving Authority.")
      setStep("approval")
    }, 1500)
  }

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault()
    setIsApproving(true)

    // Validate approval form
    if (!formData.salaryRange || !formData.approvedBy || !formData.approvalSignature || !formData.verifiedBy) {
      toast.error("Please fill in all required fields and sign the form.")
      setIsApproving(false)
      return
    }

    // Simulate approval process
    setTimeout(() => {
      setIsApproving(false)
      setFormApproved(true)
      toast.success("The job requisition has been approved and the department head has been notified.")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={step} value={step} onValueChange={(value) => setStep(value as "department" | "approval")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="department" disabled={formApproved}>
            1️⃣ Department Head
            {formSubmitted && <Check className="ml-2 h-4 w-4" />}
          </TabsTrigger>
          <TabsTrigger value="approval" disabled={!formSubmitted || formApproved}>
            2️⃣ HR & Approving Authority
            {formApproved && <Check className="ml-2 h-4 w-4" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Department Head Request</CardTitle>
              <CardDescription>Fill out the job requisition details and sign the form.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="department-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="positionTitle">
                      Position Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="positionTitle"
                      name="positionTitle"
                      value={formData.positionTitle}
                      onChange={handleChange}
                      disabled={formSubmitted}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departmentName">
                      Department Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="departmentName"
                      name="departmentName"
                      value={formData.departmentName}
                      onChange={handleChange}
                      disabled={formSubmitted}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Expected Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      disabled={formSubmitted}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills & Other Qualities Required</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    disabled={formSubmitted}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">State Brief Explanation Why Required</Label>
                  <Textarea
                    id="explanation"
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleChange}
                    disabled={formSubmitted}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position Duration</Label>
                  <RadioGroup
                    value={formData.duration}
                    onValueChange={(value) => handleRadioChange("duration", value)}
                    disabled={formSubmitted}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="permanent" id="permanent" />
                      <Label htmlFor="permanent">Permanent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="temporary" id="temporary" />
                      <Label htmlFor="temporary">Temporary</Label>
                      {formData.duration === "temporary" && (
                        <Input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          disabled={formSubmitted}
                          className="ml-2 w-40"
                          placeholder="End Date"
                        />
                      )}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Status of Employment</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => handleRadioChange("status", value)}
                    disabled={formSubmitted}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part-time" id="part-time" />
                      <Label htmlFor="part-time">Part-Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-time" id="full-time" />
                      <Label htmlFor="full-time">Full-Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="contract" id="contract" />
                      <Label htmlFor="contract">Contract</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedBy">
                    Requested By <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="requestedBy"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleChange}
                    disabled={formSubmitted}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Digital Signature <span className="text-red-500">*</span>
                  </Label>
                  <SignatureCanvas
                    onSave={(data) => handleSignature("requestSignature", data)}
                    disabled={formSubmitted}
                    existingSignature={formData.requestSignature}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {formSubmitted ? (
                <div className="flex items-center">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Submitted
                  </Badge>
                  <Button variant="ghost" className="ml-2" onClick={() => setStep("approval")}>
                    Go to Approval <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button type="submit" form="department-form" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>HR & Approving Authority</CardTitle>
              <CardDescription>Review the job requisition and approve or reject it.</CardDescription>
            </CardHeader>
            <CardContent>
              {formSubmitted ? (
                <form id="approval-form" onSubmit={handleApprove} className="space-y-4">
                  <Alert className="mb-4">
                    <AlertTitle>Job Requisition Details</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Position:</strong> {formData.positionTitle}
                        </div>
                        <div>
                          <strong>Department:</strong> {formData.departmentName}
                        </div>
                        <div>
                          <strong>Start Date:</strong> {formData.startDate || "Not specified"}
                        </div>
                        <div>
                          <strong>Duration:</strong>{" "}
                          {formData.duration === "permanent" ? "Permanent" : `Temporary (until ${formData.endDate})`}
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          {formData.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </div>
                        <div>
                          <strong>Requested By:</strong> {formData.requestedBy}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="salaryRange">
                      Salary Range <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="salaryRange"
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleChange}
                      disabled={formApproved}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Budget</Label>
                    <RadioGroup
                      value={formData.budget}
                      onValueChange={(value) => handleRadioChange("budget", value)}
                      disabled={formApproved}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approvedBy">
                      Approved By (Operations Manager) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="approvedBy"
                      name="approvedBy"
                      value={formData.approvedBy}
                      onChange={handleChange}
                      disabled={formApproved}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Digital Signature (Operations Manager) <span className="text-red-500">*</span>
                    </Label>
                    <SignatureCanvas
                      onSave={(data) => handleSignature("approvalSignature", data)}
                      disabled={formApproved}
                      existingSignature={formData.approvalSignature}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks (HR Department)</Label>
                    <Textarea
                      id="remarks"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      disabled={formApproved}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verifiedBy">
                      Verified By (HR Department) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="verifiedBy"
                      name="verifiedBy"
                      value={formData.verifiedBy}
                      onChange={handleChange}
                      disabled={formApproved}
                      required
                    />
                  </div>
                </form>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">Waiting for department head submission...</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {formApproved ? (
                <div className="w-full">
                  <Alert className="bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle>Approved Successfully</AlertTitle>
                    <AlertDescription>
                      The job requisition has been approved and the department head has been notified.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setStep("department")}
                    disabled={!formSubmitted || isApproving}
                  >
                    Back to Request
                  </Button>
                  <Button type="submit" form="approval-form" disabled={!formSubmitted || isApproving}>
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Approve & Notify Department"
                    )}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

