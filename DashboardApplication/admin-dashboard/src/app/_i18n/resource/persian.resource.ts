import { CustomFieldResource, EnumResource, ProductResource, Resource, RoutingResource, ProductCategoryResource } from "./resource";

export class PersianResource implements Resource {
	remove = 'حذف';
	add = 'افزودن';
	edit = 'ویرایش';
	update = 'بروز رسانی';
	cancel = 'لغو';
	recommended = 'پیشنهادی';
	backToPrevious = 'بازگشت';
	submit = 'تایید';
	yes = 'بله';
	no = 'خیر';
	refresh = 'بارگذاری مجدد';

	dropDown = {
		selectItem: 'یک آیتم انتخاب کنید',
	};

	routingResource: RoutingResource = {
		navigation: 'جهت یابی',
		dashboards: 'داشبورد',
		settings: 'تنظیمات',
		customFields: 'فیلدهای سفارشی',
		customFieldsAdd: 'افزودن فیلد سفارشی جدید',
		products: 'محصولات',
		productsList: 'لیست محصولات',
		productsAdd: 'افزودن محصول جدید',
		productCategories: 'گروه محصولات',
		productCategoriesAdd: 'افزودن گروه محصول جدید',
		productCategoriesList: 'لیست گروه محصولات',
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
		companyFulfilled: 'ارسال توسط الماس گالری',
		companyFulfilledDescription: 'محصول شما، مسئولیت ماست. ما با پرداخت هزینه ای ناچیز، فرآیند تحویل را برای شما انجام خواهیم داد.',
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
		identifierPlaceHolder: 'شماره {0}',
	};
	productCategoryResource: ProductCategoryResource = {
		name: 'نام',
		parent: 'والد',
		noParent: 'بدون والد',
		customFieldGroup: 'گروه فیلدهای سفارشی',
		customFieldLocation: 'موقعیت فیلدهای سفارشی',
		isActive: 'فعال',
		addNewCustomField: 'افزودن گروه جدید',
		description: 'توضیحات',
		deleteConfirmationMessage: "نسبت به حذف این گروه محصول مطمئن هستید؟",
	};
	customFieldResource: CustomFieldResource = {
		groupName: 'نام گروه',
		groupEntityType: 'نوع گروه',
		name: 'نام',
		dataType: 'نوع مقدار',
		helpText: 'متن کمکی',
		placeHolder: 'Place Holder',
		regex: 'Regex',
		initialValue: 'مقدار اولیه',
		isRequired: 'الزامی',
		isMultiLine: 'Multiline',
		applyCurrentDate: 'تاریخ روز',
		noParentCondition: 'بدون شرط',
		isActive: 'فعال',
		maxValue: 'بیشترین مقدار',
		minValue: 'کمترین مقدار',
		minValueCustomErrorMessage: "نمی تواند بزرگتر یا مساوی بیشترین مقدار باشد.",
		initialValueNumberCustomErrorMessage: "مقدار باید بین کمترین مقدار و بیشترین مقدار باشد.",
		deleteConfirmationMessage: "نسبت به حذف این فیلد سفارشی مطمئن هستید؟",
		parent: "والد",
		parentCondition: "شرط والد",
		noOptions: "گزینه ای افزوده نشده",
	};
	enumResources: EnumResource = {
		customFieldGroupType: {
			product: 'محصول',
		},
		customFieldGroupLocationType: {
			pageSection: 'صفحه محصول',
			pricingSection: 'بخش قیمت گذاری',
			descriptionSection: 'بخش توضیحات',
		},
		customFieldDataType: {
			number: 'مقدار عددی',
			string: 'رشته کاراکتر متنی',
			date: 'تاریخ',
			boolean: 'بله/خیر',
		}
	};
}
