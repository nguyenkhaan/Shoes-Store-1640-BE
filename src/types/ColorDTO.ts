export interface ColorDTO {
  id?: number;
  name: string;
  hex: string;
}

export interface ColorCreateData {
  name: string;
  hex: string;
}

export interface ColorUpdateData {
  name: string;
  hex: string;
}
