import { Reminder } from "./Reminder.modal";

export interface Location{
    locationID: string,
    title: string,
    streetAddress: string,
    radius: number,
    radiusUnit: string,
    reminders?: Reminder[]
}
