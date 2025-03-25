"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { JobRequisition } from "../lib/types"

// Sample initial data
const initialRequisitions: JobRequisition[] = [
  {
    id: "REQ-001",
    positionTitle: "Senior Software Engineer",
    departmentName: "Engineering",
    startDate: "2023-04-15",
    skills: "React, Node.js, TypeScript, 5+ years experience",
    explanation: "Need to expand the development team for new product launch",
    duration: "permanent",
    endDate: null,
    status_employment: "full-time",
    requestedBy: "John Smith",
    requestSignature: "",
    submittedDate: "2023-03-15",
    status: "approved",
    salaryRange: "$90,000 - $120,000",
    budget: "sufficient",
    approvedBy: "Jane Wilson",
    approvalSignature: "",
    verifiedBy: "HR Department",
    approvedDate: "2023-03-18",
    remarks: "Approved with budget allocation for Q2",
  },
  {
    id: "REQ-002",
    positionTitle: "Marketing Specialist",
    departmentName: "Marketing",
    startDate: "2023-05-01",
    skills: "Digital marketing, SEO, content creation",
    explanation: "Need additional support for upcoming product campaign",
    duration: "temporary",
    endDate: "2023-09-30",
    status_employment: "full-time",
    requestedBy: "Sarah Johnson",
    requestSignature: "",
    submittedDate: "2023-03-20",
    status: "rejected",
    salaryRange: "$60,000 - $75,000",
    budget: "additional",
    approvedBy: "Jane Wilson",
    approvalSignature: "",
    verifiedBy: "HR Department",
    approvedDate: "2023-03-22",
    remarks: "Position on hold due to budget constraints",
  },
  {
    id: "REQ-003",
    positionTitle: "HR Assistant",
    departmentName: "Human Resources",
    startDate: "2023-04-10",
    skills: "HR administration, onboarding experience, HRIS knowledge",
    explanation: "Current HR team is understaffed for upcoming hiring initiatives",
    duration: "permanent",
    endDate: null,
    status_employment: "part-time",
    requestedBy: "Michael Brown",
    requestSignature: "",
    submittedDate: "2023-03-25",
    status: "pending",
    salaryRange: "",
    budget: "",
    approvedBy: "",
    approvalSignature: "",
    verifiedBy: "",
    approvedDate: null,
    remarks: null,
  },
]

interface RequisitionContextType {
  requisitions: JobRequisition[]
  addRequisition: (requisition: Omit<JobRequisition, "id" | "submittedDate" | "status" | "approvedDate">) => void
  updateRequisition: (id: string, updates: Partial<JobRequisition>) => void
  getRequisitionById: (id: string) => JobRequisition | undefined
}

const RequisitionContext = createContext<RequisitionContextType | undefined>(undefined)

export function RequisitionProvider({ children }: { children: ReactNode }) {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>([])

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedRequisitions = localStorage.getItem("jobRequisitions")
    if (storedRequisitions) {
      setRequisitions(JSON.parse(storedRequisitions))
    } else {
      setRequisitions(initialRequisitions)
      localStorage.setItem("jobRequisitions", JSON.stringify(initialRequisitions))
    }
  }, [])

  // Save to localStorage whenever requisitions change
  useEffect(() => {
    if (requisitions.length > 0) {
      localStorage.setItem("jobRequisitions", JSON.stringify(requisitions))
    }
  }, [requisitions])

  const addRequisition = (
    requisitionData: Omit<JobRequisition, "id" | "submittedDate" | "status" | "approvedDate">,
  ) => {
    const newRequisition: JobRequisition = {
      ...requisitionData,
      id: `REQ-${(requisitions.length + 1).toString().padStart(3, "0")}`,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      approvedDate: null,
    }

    setRequisitions((prev) => [newRequisition, ...prev])
  }

  const updateRequisition = (id: string, updates: Partial<JobRequisition>) => {
    setRequisitions((prev) => prev.map((req) => (req.id === id ? { ...req, ...updates } : req)))
  }

  const getRequisitionById = (id: string) => {
    return requisitions.find((req) => req.id === id)
  }

  return (
    <RequisitionContext.Provider
      value={{
        requisitions,
        addRequisition,
        updateRequisition,
        getRequisitionById,
      }}
    >
      {children}
    </RequisitionContext.Provider>
  )
}

export function useRequisitions() {
  const context = useContext(RequisitionContext)
  if (context === undefined) {
    throw new Error("useRequisitions must be used within a RequisitionProvider")
  }
  return context
}

