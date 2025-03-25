export interface JobRequisition {
    id: string
    positionTitle: string
    departmentName: string
    startDate: string
    skills: string
    explanation: string
    duration: "permanent" | "temporary"
    endDate: string | null
    status_employment: "full-time" | "part-time" | "contract"
    requestedBy: string
    requestSignature: string
    submittedDate: string
    status: "pending" | "approved" | "rejected"
  
    // HR & Approving Authority fields
    salaryRange: string
    budget: "sufficient" | "additional" | ""
    approvedBy: string
    approvalSignature: string
    verifiedBy: string
    approvedDate: string | null
    remarks: string | null
  }
  
  export type FormData = Omit<JobRequisition, "id" | "submittedDate" | "status" | "approvedDate">
  
  