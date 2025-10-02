export type Role = 'Admin' | 'Staff' | 'User';
// subscription_type: Free=1, Vip_25=2, Vip_50=3
export type SubscriptionType = 1 | 2 | 3;


export type User = {
  id: number | string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;

  // BE trả số: 1=Admin, 2=User, 3=Staff (ví dụ)
  role: 1 | 2 | 3;

  // 1=Free, 2=VIP25, 3=VIP50 (ví dụ)
  subscriptionType: 1 | 2 | 3;

  // optional BE fields
  createdAt?: string;
};

export type AuthResult = {
  token: string;
  user: User;
};


export interface Challenge {
id: string;
name: string;
description: string;
startDate: string; // ISO
endDate: string; // ISO
isComplete: boolean;
}


export interface Transaction {
id: string;
name: string;
totalPayment: number;
paymentDate: string; // ISO
status: 'Success' | 'Pending' | 'Denied' | string;
reason?: string;
}