import { ProductResource, Resource, RoutingResource } from "./resource";

export class PersianResource implements Resource {
  remove = 'حذف';
  recommended = 'پیشنهادی';

  routingResource: RoutingResource = {
    navigation: 'جهت یابی',
    dashboards: 'داشبوردها',
    APPS: 'برنامه',
    products: 'محصولات',
    productsList: 'لیست محصولات',
    productsAdd: 'افزودن محصول جدید',
  };
  dropDown = {
    selectItem: 'یک آیتم انتخاب کنید',
  };
  productResource: ProductResource = {
    productInformation: 'اطلاعات محصول',
    productImage: 'عکس محصول',
    productPricing: 'قیمت گذاری',
    productOrganization: 'سازماندهی',
    productVariant: 'انواع',
    productInventory: 'انبارداری',
    name: 'نام',
    description: 'توضیحات',
    stockKeepingUnit: 'SKU',
    barCode: 'بارکد محصول',
    basePrice: 'قیمت پایه',
    discount: 'تخفیف',
    chargeTax: 'اعمال مالیات بر روی محصول',
    inStock: 'محصول موجود در انبار',
    vendor: 'فروشنده',
    category: 'دسته بندی',
    collection: 'مجموعه',
    publishStatus: 'وضعیت',
    tags: 'برچسب ها',
    options: 'گزینه ها',
    variantValue: 'مقدار',
    addNewVariant: 'افزودن نوع جدید',
    addNewCategory: 'افزودن دسته بندی جدید',
    restock: 'انبارگردانی',
    shipping: 'ارسال',
    globalDelivery: 'ارسال جهانی',
    attributes: 'صفات',
    advanced: 'پیشرفته',
    addToStocks: 'افزودن موجودی',
    quantity: "تعداد",
    currentQuantity: "موجودی کالا",
    deliveryQuantity: "کالا در حال ارسال",
    restockedLastTime: "تاریخ آخرین بروز رسانی",
    overallQuantity: "تعداد کل کالا",
    shippingType: 'انواع ارسال',
    sellerFulfilled: 'ارسال توسط فروشنده',
    sellerFulfilledDescription: 'شما مسئول تحویل محصول خواهید بود. هر گونه آسیب یا تاخیر در حمل و نقل ممکن است برای شما هزینه خسارت داشته باشد.',
    companyFullfilled: 'ارسال توسط الماس گالری',
    companyFullfilledDescription: 'محصول شما، مسئولیت ماست. ما با پرداخت هزینه ای ناچیز، فرآیند تحویل را برای شما انجام خواهیم داد.',
    worldwideDelivery: 'ارسال جهانی',
    worldwideDeliveryDescription: "فقط با روش ارسال: توسط گالری الماس انجام می شود",
    selectedCountries: "کشورهای منتخب",
    localDelivery: "ارسال داخلی",
    localDeliveryDescription: "تحویل به کشور محل اقامت خود: آدرس نمایه را تغییر دهید",
    isFragile: 'محصول شکستنی',
    isBiodegradable: 'محصول زیست تخریب پذیر',
    isFrozen: 'محصول منجمد',
    maxAllowedTemperature: 'دمای مورد نیاز',
    expiryDate: 'تاریخ انقضای محصول',
    identifierType: 'نوع شناسه محصول',
    identifier: 'شناسه محصول',
    identifirePlaceHolder: 'شماره {0}',
  };
}
