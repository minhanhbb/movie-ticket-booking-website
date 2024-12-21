

export interface PayMethod {
  id: string;
  pay_method_name: string;
  status: 'Normal' | 'Ban';        // enum;
}
