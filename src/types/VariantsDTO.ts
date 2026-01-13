export interface VariantCreateData {
  productID: number;
  size: number;
  colorID: number;
  quantity: number;
}

export interface VariantUpdateData {
  size?: number;
  colorID?: number;
  quantity?: number;
}

export interface VariantBulkCreateData {
  productID: number;
  variants: Array<{
    size: number;
    colorID: number;
    quantity: number;
  }>;
}
