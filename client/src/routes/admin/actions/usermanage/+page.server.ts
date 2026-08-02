import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    users: [
      {
        username: 'Mathias Scherer',
        email: 'asd@asd.com',
        walletid: '123123123',
        active: true,
        balance: '100'
      },
      {
        username: 'Nico',
        email: 'bsd@asd.com',
        walletid: '431413414414',
        active: true,
        balance: '40'
      },
      {
        username: 'Thaila',
        email: 'csd@asd.com',
        walletid: '12345678',
        active: false,
        balance: '30'
      },
      {
        username: 'Marcelo',
        email: 'csd@asd.com',
        walletid: '4314314',
        active: false,
        balance: '30'
      },
      {
        username: 'Leonardo',
        email: 'csd@asd.com',
        walletid: '12345315351678',
        active: false,
        balance: '30'
      },
      {
        username: 'Lassemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
        email: 'csaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad@asd.com',
        walletid: '123455134678888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888',
        active: false,
        balance: '3000000000000000000000000000000000000000000000000000000000'
      },
      {
        username: 'Paulo',
        email: 'csd@asd.com',
        walletid: '123456642164178',
        active: false,
        balance: '30'
      },
      {
        username: 'Francesco',
        email: 'csd@asd.com',
        walletid: '123413441345678',
        active: false,
        balance: '30'
      },
      {
        username: 'Luft',
        email: 'csd@asd.com',
        walletid: '12348654745678',
        active: false,
        balance: '30'
      },
      {
        username: 'Felipe',
        email: 'csd@asd.com',
        walletid: '123445756qe78',
        active: false,
        balance: '30'
      }
    ]
  };
};
