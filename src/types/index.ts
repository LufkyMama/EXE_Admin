export type Role = 'Admin' | 'Staff' | 'User';
// subscription_type: Free=1, Vip_25=2, Vip_50=3
export type SubscriptionType = 1 | 2 | 3;


export type User = {
  id: number | string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  role: Role;                    // số
  dateOfBirth?: string | null;   // "0001-01-01" coi như null khi hiển thị
  subscriptionType: SubscriptionType; // số
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