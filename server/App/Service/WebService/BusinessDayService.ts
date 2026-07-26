export interface BusinessDayService
{
    isBusinessDay(date: Date): Promise<boolean>;
}