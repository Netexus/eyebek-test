import { PlanCategory } from './enums';

export interface Plan {
    id: string;
    category: PlanCategory;
    price: number;
    duration: number;
    description: string;
    userCapacity: number;
    features: string[];
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
