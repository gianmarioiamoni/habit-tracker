export interface Habit {
    _id: string;
    title: string;
    description: string;
    frequency: string;
    startDate: Date;
    progress: Date[]
}