import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export type StockStatus = {
    __kind__: "inStock";
    inStock: bigint;
} | {
    __kind__: "outOfStock";
    outOfStock: null;
} | {
    __kind__: "limited";
    limited: bigint;
};
export type Principal = Principal;
export interface WhatsAppOrder {
    id: bigint;
    status: OrderStatus;
    customerPrincipal: Principal;
    cartItems: Array<CartItem>;
    whatsappNumber: string;
    timestamp: Time;
}
export interface CartItem {
    customNotes?: string;
    productId: bigint;
    quantity: bigint;
}
export interface Product {
    id: bigint;
    specifications: Array<[string, string]>;
    imageBlob?: ExternalBlob;
    stockStatus: StockStatus;
    name: string;
    description: string;
    category: ProductCategory;
    image: string;
    price?: bigint;
}
export interface UserProfile {
    name: string;
    company?: string;
    phone?: string;
}
export enum OrderStatus {
    new_ = "new",
    rejected = "rejected",
    contacted = "contacted",
    confirmed = "confirmed"
}
export enum ProductCategory {
    wd40Products = "wd40Products",
    compressedAsbestosJointingSheets = "compressedAsbestosJointingSheets",
    nonAsbestosJointingSheets = "nonAsbestosJointingSheets",
    mechanicalPackings = "mechanicalPackings",
    fluidSealants = "fluidSealants"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    addToCart(productId: bigint, quantity: bigint, customNotes: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkStock(productId: bigint): Promise<StockStatus>;
    deleteProduct(id: bigint): Promise<void>;
    deleteProductImage(productId: bigint): Promise<void>;
    filterProductsByStock(status: StockStatus): Promise<Array<Product>>;
    getAllOrders(): Promise<Array<WhatsAppOrder>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCompanyContactGmail(): Promise<string>;
    getCustomDomainRequest(): Promise<string | null>;
    getMyOrders(): Promise<Array<WhatsAppOrder>>;
    getOrder(orderId: bigint): Promise<WhatsAppOrder | null>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getProductsBySearch(searchTerm: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setCustomDomainRequest(domain: string): Promise<void>;
    submitWhatsAppOrder(cartItems: Array<CartItem>, whatsappNumber: string): Promise<bigint>;
    updateCompanyContactGmail(newGmail: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, updatedProduct: Product): Promise<void>;
    uploadProductImage(productId: bigint, externalBlob: ExternalBlob): Promise<void>;
}
