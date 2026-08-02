import { ExternalBusinessDayServiceException } from "../../Exception/ExternalServiceException.js";
import { BusinessDayService } from "./BusinessDayService.js";

export class BrasilApiBusinessDayService implements BusinessDayService
{
    constructor(
        private readonly API_URL: string
    ){}

    public async isBusinessDay(date: Date): Promise<boolean>
    {
        const weekDay = date.getDay();
        if(weekDay === 0 || weekDay === 6) return false;
        
        const holidays = await this.getHolidays(date.getFullYear());
        return !holidays.has(date.toDateString());
    }

    private async getHolidays(year: number): Promise<Set<string>>
    {
        const response = await fetch(
            this.API_URL + '/' + year,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if(!response.ok){
            throw new ExternalBusinessDayServiceException();
        }

        const data = await response.json();
        const holidays = new Set<string>();

        for(const entry of data as any[]){
            holidays.add(new Date(entry.date).toDateString());
            console.log(new Date(entry.date).toDateString())
        }
        
        return holidays;
    }
}