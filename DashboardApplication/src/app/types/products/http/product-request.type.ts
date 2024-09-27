import { BaseHttpRequest } from "../../../helper/http/http.interface.ts";

export type ProductRequest =
  BaseHttpRequest & {
    hasChargeTax?: boolean;
    isInStock?: boolean;
    isFragile?: boolean;
    isBiodegradable?: boolean;
    isFrozen?: boolean;
    hasExpiryDate?: boolean;

    name?: string;
    barCode?: string;
    sku?: string;
    description?: string;
    identifier?: string;
    image?: string;

    basePrice?: number;
    discountPrice?: number;
    vendorId?: number;
    categoryId?: number;
    collectionId?: number;
    identifierType?: number;
    quantity?: number;
    shippingType?: number;
    globalDeliveryType?: number;
    allowedTemperature?: number;

    expiryDate?: Date;
    tags?: string;
    variants?: string;
    globalDeliveryCountries?: string[];
  }
