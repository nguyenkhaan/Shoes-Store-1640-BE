//interface dung de khai bao du lieu cho 1 object 
export interface ProductDTO {
    id?: number; 
    name: string, 
    description: string, 
    active: boolean, 
    brandID: number, 
    price: number, 
    thumbnail?: string 
}
export default ProductDTO