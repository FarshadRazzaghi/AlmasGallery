import { FrButtonColor, FrButtonType } from '@fr-widget/sdk/button';

export type HeaderActionButton =
  | HeaderButton
  | HeaderWaitingButton
  | HeaderLinkButton;

// Base structure for all header buttons
interface BaseHeaderButton {
  readonly identifierName: string;
  readonly text: string;
  readonly color: FrButtonColor;
  readonly cssClasses?: string[];
  readonly title?: string;
  readonly isVisible?: boolean;
  readonly isEnable?: boolean;
}

// Button that performs a local action
export interface HeaderButton extends BaseHeaderButton {
  readonly directive: 'button';
  readonly type: FrButtonType;
  readonly iconClass?: string;
  onClick: (event: MouseEvent) => void;
}

// Button with waiting state
export interface HeaderWaitingButton extends BaseHeaderButton {
  readonly directive: 'waiting';
  readonly type: FrButtonType;
  isWaiting: boolean;
  onClick: (event: MouseEvent) => void;
}

// Button that navigates (internal or external)
export interface HeaderLinkButton extends BaseHeaderButton {
  readonly directive: 'link';
  readonly target: '_top' | '_self' | '_parent' | '_blank';
  readonly routeLink: string;
  readonly iconClass?: string;
  readonly isExternalLink: boolean;
}
