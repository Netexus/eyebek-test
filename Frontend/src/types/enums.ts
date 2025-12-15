export enum AttendanceType {
    CheckIn = 0,
    CheckOut = 1
}

export enum AttendanceMethod {
    Facial = 0,
    Manual = 1,
    QR = 2
}

export enum AttendanceStatus {
    Approved = 0,
    Pending = 1,
    Rejected = 2
}

export enum UserRole {
    Admin = 0,
    Manager = 1,
    Employee = 2
}

export enum UserStatus {
    Active = 0,
    Inactive = 1,
    Suspended = 2
}

export enum CompanyStatus {
    Active = 0,
    Inactive = 1,
    Suspended = 2
}

export enum PaymentStatus {
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Refunded = 3
}

export enum PlanCategory {
    Basic = 0,
    Pro = 1,
    Enterprise = 2
}
