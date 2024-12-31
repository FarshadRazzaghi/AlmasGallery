import { FrButtonColor, FrButtonType } from '@fr-widget/sdk/button';

export type HeaderActionButton = NavigationHeaderWaiting | NavigationHeaderButton | NavigationHeaderLink;

interface NavigationHeader {
  readonly identifierName: string;
  readonly directive: string;
  readonly text: string;
  readonly color: FrButtonColor;
  cssClasses?: string[];
  title?: string;
  isVisible?: boolean;
  isEnable?: boolean;
}

interface NavigationHeaderWaiting extends NavigationHeader {
  readonly directive: 'waiting';
  readonly type: FrButtonType;
  isWaiting: boolean;
  onClick: ($event: MouseEvent) => void;
}

interface NavigationHeaderButton extends NavigationHeader {
  readonly directive: 'button';
  readonly type: FrButtonType;
  iconClass?: string;
  onClick: ($event: MouseEvent) => void;
}

interface NavigationHeaderLink extends NavigationHeader {
  readonly directive: 'link';
  readonly target: '_top' | '_self' | '_parent' | '_blank';
  readonly routeLink: string;
  iconClass?: string;
  isExternalLink: boolean;
}
