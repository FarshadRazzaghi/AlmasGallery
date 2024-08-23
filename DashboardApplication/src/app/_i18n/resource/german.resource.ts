import { FrResource } from '@fr-widget/i18n';
import { Resource } from './resource';

export const ThemeGermanResource: FrResource = {
  close: 'schließen',
  dismiss: 'zurückweisen',
  submit: 'einreichen',
  saveChanges: 'Änderungen speichern',
  collapse: 'Zusammenbruch',
  refresh: 'Aktualisierung',
  expand: 'expandieren',
  more: 'mehr',
  minimize: 'Minimieren',
  fullScreen: 'Ganzer Bildschirm',
  notifications: 'Benachrichtigungen',
  search: 'Suchen',
  changeLanguage: 'Sprache ändern',
  darkMode: 'dunkler Modus',
  lightMode: 'Lichtmodus',
  validationResource: {
    required: 'Dieses Feld ist erforderlich.',
    minLength: 'Der Wert ist kurz. Die Mindestlänge für den Wert muss {2} Zeichen betragen.',
    maxLength: 'Der Wert ist lang. Die maximale Länge für den Wert muss {2} Zeichen betragen.',
    min: 'Der eingegebene Wert muss größer als {2} sein.',
    max: 'Der eingegebene Wert muss kleiner als {2} sein.',
    pattern: {
      emailInvalidFormat: 'Die eingegebene E-Mail-Adresse hat ein ungültiges Format.',
      numberOnlyInvalidFormat: 'Nur Zahlenzeichen zulässig.',
    }
  }
}

export class GermanResource implements Resource {
  list: string = 'Liste';
  detail: string = 'Detail';
  navigation: string = 'Navigation';
  dashboards: string = 'Dashboards';
  analytics: string = 'Analyse';
  EWallet: string = 'E-Wallet';
  APPS: string = 'APPS';
  calendar: string = 'Kalender';
  chat: string = 'Chat';
  CRM: string = 'CRM';
  ECommerce: string = 'E-Commerce';
  products: string = 'Produkte';
  productDetail: string = 'Produktdetails';
  orders: string = 'Bestellungen';
  orderDetail: string = 'Bestelldetails';
  customers: string = 'Kunden';
  shoppingCart: string = 'Warenkorb';
  checkout: string = 'Kasse';
  sellers: string = 'Verkäufer';
  email: string = 'E-Mail';
  inbox: string = 'Posteingang';
  readEmail: string = 'E-Mail lesen';
  projects: string = 'Projekte';
  gantt: string = 'Gantt';
  createProject: string = 'Projekt erstellen';
  socialFeed: string = 'Social Feed';
  tasks: string = 'Aufgaben';
  kanbanBoard: string = 'Kanban-Board';
  fileManage: string = 'Datei verwalten';
  custom: string = 'Benutzerdefinierte';
  pages: string = 'Seiten';
  profile: string = 'Profil';
  profile_2: string = 'Profil 2';
  FAQ: string = 'FAQ';
  pricing: string = 'Preise';
  maintenance: string = 'Wartung';
  authentication: string = 'Authentifizierung';
  error: string = 'Fehler';
  starterPage: string = 'Startseite';
  withPreloader: string = 'Mit Preloader';
  timeline: string = 'Zeitleiste';
  landing: string = 'Landingpage';
  layouts: string = 'Layouts';
  horizontal: string = 'Horizontal';
  detached: string = 'Getrennt';
  invoice: string = 'Rechnung';
  fullView: string = 'Vollansicht';
  fullscreenView: string = 'Vollbildansicht';
  hoverMenu: string = 'Hover-Menü';
  compact: string = 'Kompakt';
  iconView: string = 'Symbolansicht';
  components: string = 'Komponenten';
  accordionAndCollapse: string = 'Akkordeon & Reduzieren';
  alerts: string = 'Warnungen';
  avatars: string = 'Avatare';
  badges: string = 'Badges';
  breadcrumbs: string = 'Breadcrumbs';
  buttons: string = 'Buttons';
  cards: string = 'Karten';
  carousel: string = 'Karussell';
  dropdowns: string = 'Dropdowns';
  embedVideo: string = 'Video einbetten';
  grid: string = 'Raster';
  listGroup: string = 'Liste Gruppe';
  modal: string = 'Modal';
  notifications: string = 'Benachrichtigungen';
  offcanvas: string = 'Offcanvas';
  placeholders: string = 'Platzhalter';
  pagination: string = 'Seitennummerierung';
  popovers: string = 'Popovers';
}
