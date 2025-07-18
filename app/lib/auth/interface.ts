export interface User {
    id?: string
    email: string
    password: string
    createdAt?: Date
    updatedAt?: Date
    role?: string
    travel_profile: string | null
}