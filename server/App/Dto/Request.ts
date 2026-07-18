import { z } from 'zod';

export const paymentByWalletIdDTO = z.object({
    toWalletId: z.string().nonempty().nonoptional(),
    amount: z.coerce.number().positive().nonoptional(),
    description: z.string().optional().nullable(),
});

export type PaymentByWalletIdDTO = z.infer<typeof paymentByWalletIdDTO>;