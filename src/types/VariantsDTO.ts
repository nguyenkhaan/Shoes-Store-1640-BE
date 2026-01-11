export interface VariantCreateData {
  productID: number;
  sizeID: number;
  colorID: number;
  quantity: number;
}

export interface VariantUpdateData {
  sizeID?: number;
  colorID?: number;
  quantity?: number;
}

export interface VariantBulkCreateData {
  productID: number;
  variants: Array<{
    sizeID: number;
    colorID: number;
    quantity: number;
  }>;
}
