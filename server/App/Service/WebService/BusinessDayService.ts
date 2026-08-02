export interface BusinessDayService
{
    isBusinessDay(date: Date): Promise<boolean>;
}

export const BusinessDayService = 'BusinessDayService';