import { z } from 'zod';

export const paymentByWalletIdDTO = z.object({
    toWalletId: z.string().nonempty().nonoptional(),
    amount: z.coerce.number().positive().nonoptional(),
    description: z.string().optional().nullable(),
});

export type PaymentByWalletIdDTO = z.infer<typeof paymentByWalletIdDTO>;


export const statementQueryStringSchema = z.object({
    month: z.coerce.number().nonnegative(),
    year: z.coerce.number().nonnegative()
})

export type StatementQueryStringSchema = z.infer<typeof statementQueryStringSchema>


export const getWalletParamsSchema = z.object({
    walletId: z.coerce.string().nonempty().nonoptional()
});

export type GetWalletParamsSchema = z.infer<typeof getWalletParamsSchema>;


export const chargeParamsSchema = z.object({
    chargeId: z.coerce.string().nonoptional()
});

export type ChargeParamsSchema = z.infer<typeof chargeParamsSchema>;


// id: string,
// issuerWalletId: string,
// amount: number,
// description?: string | null,
export const createChargeDTO = z.object({
    amount: z.coerce.number().positive().nonoptional(),
    description: z.coerce.string().optional()
});

export type CreateChargeDTO = z.infer<typeof createChargeDTO>;