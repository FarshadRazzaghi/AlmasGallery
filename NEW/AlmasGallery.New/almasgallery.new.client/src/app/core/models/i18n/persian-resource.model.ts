import * as models from "@core/models";

export class PersianResource implements models.Resource {
  yes: string = 'بله';
  no: string = 'خیر';
  add: string = 'افزودن';
  update: string = 'بروزرسانی';
  cancel: string = 'لغو';
  remove: string = 'حذف';
  submit: string = 'ثبت';
  back: string = 'بازگشت';
  refresh: string = 'بارگذاری';
  validationResource: models.ValidationResource = {
    regexErrorMessage: 'مقدار وارد شده یک الگوی معتبر Regex نیست.',
    matchRegexErrorMessage: 'مقدار وارد شده با الگوی Regex مورد نیاز مطابقت ندارد.',
    matchRegexErrorMessageWithParameters: 'مقدار وارد شده با الگوی {0} مورد نیاز مطابقت ندارد.',
    equalOrGreaterErrorMessage: 'مقدار نباید برابر یا بیشتر از مقدار حداکثر باشد.',
    betweenErrorMessage: 'مقدار باید بین مقدار حداقل و حداکثر باشد.',
    betweenErrorMessageWithParameters: 'مقدار باید بین {0} و {1} باشد.',
  };
  conditionResource: models.ConditionResource = {
    equals: 'برابر',
    notEquals: 'نابرابر',
    contains: 'شامل',
    notContains: 'ناشامل',
    higherThan: 'بزرگتر',
    higherThanEquals: 'بزرگتر برابر',
    lowerThan: 'کوچکتر',
    lowerThanEquals: 'کوچکتر برابر',
    noCondition: 'بدون شرط'
  };
  enumResource: models.EnumResource = {
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
    },
  };
  routingResource: models.RoutingResource = {
    error: {
      error: 'خطا',
      forbidden: 'دسترسی غیرمجاز',
      notFound: 'صفحه پیدا نشد',
      serverError: 'خطای سرور',
    },
    navigation: {
      navigation: 'ناوبری',
      dashboard: 'داشبورد',
    },
    appManagement: {
      appManagement: 'تنظیمات',
      customFieldGroups: 'فیلد سفارشی',
      customFieldGroupList: 'لیست فیلد‌های سفارشی',
      customFieldGroupAdd: 'افزودن فیلد سفارشی',
      customFieldGroupEdit: 'ویرایش فیلد سفارشی',
      customFieldGroupEditWithParameter: 'ویرایش فیلد سفارشی "{0}"',
    },
    productManagement: {
      productManagement: 'مدیریت محصول',
      productCategories: 'گروه محصول',
      productCategoryList: 'لیست گروه محصول‌ها',
      productCategoryAdd: 'افزودن گروه محصول',
      productCategoryEdit: 'ویرایش گروه محصول',
      productCategoryEditWithParameter: 'ویرایش گروه محصول "{0}"',
    }
  };
  customFieldGroupResource: models.CustomFieldGroupResource = {
    baseInfo: 'اطلاعات پایه',
    name: 'نام گروه',
    entityType: 'نوع گروه',
    customFields: 'فیلدهای سفارشی',
    noCustomFields: 'فیلد سفارشی افزوده نشده',
    deleteConfirmationMessage: 'نسبت به حذف این فیلد سفارشی مطمئن هستید؟',
  };
  customFieldResource: models.CustomFieldResource = {
    name: 'نام',
    dataType: 'نوع مقدار',
    helpText: 'متن کمکی',
    placeHolder: 'Place Holder',
    regex: 'Regex',
    initialValue: 'مقدار اولیه',
    isRequired: 'الزامی',
    isMultiLine: 'Multiline',
    applyCurrentDate: 'تاریخ روز',
    isActive: 'فعال',
    maxValue: 'مقدار حداکثر',
    minValue: 'مقدار حداقل',
    parent: 'والد',
    parentCondition: 'شرط والد',
  };
  productCategoryResource: models.ProductCategoryResource = {
    baseInfo: 'اطلاعات پایه',
    name: 'نام',
    parent: 'والد',
    description: 'توضیحات',
    isActive: 'فعال',
    order: 'ردیف',
    customFieldGroups: 'گروه های فیلد سفارشی',
    customFieldGroup: 'گروه فیلد سفارشی',
    addNewCustomFieldGroup: 'افزودن گروه فیلد سفارشی جدید',
    customFieldGroupLocation: 'موقعیت گروه فیلد سفارشی',
    deleteConfirmationMessage: 'نسبت به حذف این گروه محصول مطمئن هستید؟',
  }
}
