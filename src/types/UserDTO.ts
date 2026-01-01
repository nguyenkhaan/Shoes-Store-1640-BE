// dto/create-pending-user.dto.ts
export interface UserDTO {
    id?: number; 
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    avatar?: string;  //Cai nao optional thi de ? -> Co hhay khong cung duoc, khong quan trong 
    verify?: boolean; 
  }
//const a : UserDTO; 