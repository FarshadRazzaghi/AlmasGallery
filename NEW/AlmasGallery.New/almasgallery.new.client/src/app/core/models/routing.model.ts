import { Type } from "@angular/core";
import { FrThemeNavigationGroup, FrThemeNavigationItem } from "@fr-theme/common";

export interface NavigationItem extends FrThemeNavigationItem {
  component?: Type<any>;
  children?: NavigationItem[];
}

export interface NavigationGroup extends FrThemeNavigationGroup {
  items: NavigationItem[];
}
