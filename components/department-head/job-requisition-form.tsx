"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Textarea } from "../../components/ui/textarea"
import { SignatureCanvas } from "../../components/signature-canvas"
import type { FormData } from "../../lib/types"

interface JobRequisitionFormProps {
  onSubmit: (formData: FormData) => void
}

export function JobRequisitionForm({ onSubmit }: JobRequisitionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    positionTitle: "",
    departmentName: "",
    startDate: "",
    skills: "",
    explanation: "",
    duration: "permanent",
    endDate: null,
    status_employment: "full-time",
    requestedBy: "",
    requestSignature: "",
    salaryRange: "",
    budget: "",
    approvedBy: "",
    approvalSignature: "",
    verifiedBy: "",
    remarks: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset endDate if duration is changed to permanent
      ...(name === "duration" && value === "permanent" ? { endDate: null } : {}),
    }))
  }

  const handleSignature = (field: string, data: string) => {
    setFormData((prev) => ({ ...prev, [field]: data }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.positionTitle || !formData.departmentName || !formData.requestedBy || !formData.requestSignature) {
      alert("Please fill in all required fields and sign the form.")
      setIsSubmitting(false)
      return
    }

    // Simulate form submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit(formData)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Job Requisition</CardTitle>
        <CardDescription>Fill out the job requisition details and sign the form.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="requisition-form" onSubmit={handleSubmit} className="space-y-4">
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Expected Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills & Other Qualities Required</Label>
            <Textarea id="skills" name="skills" value={formData.skills} onChange={handleChange} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">State Brief Explanation Why Required</Label>
            <Textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Position Duration</Label>
            <RadioGroup
              value={formData.duration}
              onValueChange={(value) => handleRadioChange("duration", value)}
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
                    value={formData.endDate || ""}
                    onChange={handleChange}
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
              value={formData.status_employment}
              onValueChange={(value) =>
                handleRadioChange("status_employment", value as "full-time" | "part-time" | "contract")
              }
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
            <Input id="requestedBy" name="requestedBy" value={formData.requestedBy} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>
              Digital Signature <span className="text-red-500">*</span>
            </Label>
            <SignatureCanvas
              onSave={(data) => handleSignature("requestSignature", data)}
              existingSignature={formData.requestSignature}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="requisition-form" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

