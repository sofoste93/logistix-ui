import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Language = 'en' | 'de' | 'fr';
export type Theme = 'light' | 'dark' | 'system';

const TEXT = {
  en: {
    dashboard: 'Control center', routes: 'Routes', bookings: 'Bookings', settings: 'Settings', help: 'Help',
    operations: 'Ocean freight operations', welcome: 'Every shipment. One clear horizon.',
    subtitle: 'Plan corridors, reserve capacity and follow the flow from one calm workspace.',
    activeRoutes: 'Active routes', openBookings: 'Bookings', available: 'Available capacity', utilization: 'Utilization',
    viewRoutes: 'View routes', newBooking: 'New booking', live: 'API connected', offline: 'API unavailable',
    language: 'Language', appearance: 'Appearance', light: 'Light', dark: 'Dark', system: 'System',
    reduceMotion: 'Reduce motion', close: 'Close', helpTitle: 'How Logistix works',
    helpText: 'The Angular interface sends typed JSON requests to the Quarkus REST API. A booking validates the route segment and reduces capacity atomically.',
    localData: 'This educational edition keeps data in memory. Restarting the API restores the demonstration dataset.'
  },
  de: {
    dashboard: 'Leitstand', routes: 'Routen', bookings: 'Buchungen', settings: 'Einstellungen', help: 'Hilfe',
    operations: 'Seefracht-Operationen', welcome: 'Jede Sendung. Ein klarer Horizont.',
    subtitle: 'Korridore planen, Kapazität buchen und Warenströme in einem ruhigen Arbeitsbereich verfolgen.',
    activeRoutes: 'Aktive Routen', openBookings: 'Buchungen', available: 'Freie Kapazität', utilization: 'Auslastung',
    viewRoutes: 'Routen ansehen', newBooking: 'Neue Buchung', live: 'API verbunden', offline: 'API nicht erreichbar',
    language: 'Sprache', appearance: 'Darstellung', light: 'Hell', dark: 'Dunkel', system: 'System',
    reduceMotion: 'Bewegung reduzieren', close: 'Schließen', helpTitle: 'So funktioniert Logistix',
    helpText: 'Die Angular-Oberfläche sendet typisierte JSON-Anfragen an die Quarkus REST API. Eine Buchung prüft das Routensegment und reduziert die Kapazität atomar.',
    localData: 'Diese Lernversion hält Daten im Speicher. Ein API-Neustart stellt die Demonstrationsdaten wieder her.'
  },
  fr: {
    dashboard: 'Salle de contrôle', routes: 'Itinéraires', bookings: 'Réservations', settings: 'Réglages', help: 'Aide',
    operations: 'Opérations de fret maritime', welcome: 'Chaque expédition. Un horizon clair.',
    subtitle: 'Planifiez les corridors, réservez la capacité et suivez les flux depuis un espace serein.',
    activeRoutes: 'Itinéraires actifs', openBookings: 'Réservations', available: 'Capacité disponible', utilization: 'Utilisation',
    viewRoutes: 'Voir les itinéraires', newBooking: 'Nouvelle réservation', live: 'API connectée', offline: 'API indisponible',
    language: 'Langue', appearance: 'Apparence', light: 'Clair', dark: 'Sombre', system: 'Système',
    reduceMotion: 'Réduire les animations', close: 'Fermer', helpTitle: 'Comment fonctionne Logistix',
    helpText: 'L’interface Angular envoie des requêtes JSON typées à l’API REST Quarkus. Une réservation valide le segment puis réduit la capacité de façon atomique.',
    localData: 'Cette édition pédagogique conserve les données en mémoire. Redémarrer l’API restaure le jeu de démonstration.'
  }
} as const;

type TranslationKey = keyof typeof TEXT.en;

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly document = inject(DOCUMENT);
  readonly language = signal<Language>(this.readLanguage());
  readonly theme = signal<Theme>(this.readTheme());
  readonly reduceMotion = signal(localStorage.getItem('logistix-motion') === 'reduce');

  constructor() {
    this.applyDocumentPreferences();
  }

  t(key: TranslationKey): string {
    return TEXT[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem('logistix-language', language);
    this.document.documentElement.lang = language;
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem('logistix-theme', theme);
    this.document.documentElement.dataset['theme'] = theme;
  }

  setReduceMotion(reduce: boolean): void {
    this.reduceMotion.set(reduce);
    localStorage.setItem('logistix-motion', reduce ? 'reduce' : 'full');
    this.document.documentElement.classList.toggle('reduce-motion', reduce);
  }

  private applyDocumentPreferences(): void {
    this.document.documentElement.lang = this.language();
    this.document.documentElement.dataset['theme'] = this.theme();
    this.document.documentElement.classList.toggle('reduce-motion', this.reduceMotion());
  }

  private readLanguage(): Language {
    const value = localStorage.getItem('logistix-language');
    return value === 'de' || value === 'fr' ? value : 'en';
  }

  private readTheme(): Theme {
    const value = localStorage.getItem('logistix-theme');
    return value === 'light' || value === 'dark' ? value : 'system';
  }
}
