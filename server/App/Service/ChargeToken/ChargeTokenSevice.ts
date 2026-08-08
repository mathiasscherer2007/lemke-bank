export interface ChargeTokenService
{
    generate(payload, ): string;
    verify(): void;
}

export const ChargeTokenService = 'ChargeTokenService';