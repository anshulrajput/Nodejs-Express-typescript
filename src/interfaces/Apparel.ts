export default interface Apparel{
    vendorId: string,
    apparelCode: string,
    sizes: [Size]
}

export interface Size{
    size: string,
    qty: number,
    price: number
}

export interface ApparelDict{
    [key: string]: {
        index: number,
        vendorId: string,
        apparelCode: string,
        sizes: SizeDict
    }
}

export interface SizeDict{
    [key: string]: {
        index: number,
        size: string,
        qty: number,
        price: number
    }
}

export interface SortedApparelDict{
    [key: string]: [{
        vendorId: string,
        qty: number,
        price: number
    }]
}