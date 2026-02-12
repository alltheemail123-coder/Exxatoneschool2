import React from 'react';

// FontAwesome icon mapping with semantic names
export const fontAwesomeIcons = {
  // Navigation
  home: 'fa-home',
  bell: 'fa-bell',
  compass: 'fa-compass',
  heart: 'fa-heart',
  doorOpen: 'fa-door-open',
  calendar: 'fa-calendar',
  building: 'fa-building',
  users: 'fa-users',
  graduationCap: 'fa-graduation-cap',
  clock: 'fa-clock',
  book: 'fa-book',
  lifeRing: 'fa-life-ring',
  gear: 'fa-gear',
  circleQuestion: 'fa-circle-question',
  // Data & layout
  'layer-group': 'fa-layer-group',
  'chart-bar': 'fa-chart-bar',
  // Communication
  'inbox': 'fa-inbox',
  // Legacy aliases
  'door-open': 'fa-door-open',
  'graduation-cap': 'fa-graduation-cap',
  'book-open': 'fa-book-open',
  'life-buoy': 'fa-life-ring',
  'settings-2': 'fa-gear',
  // AI
  starChristmas: 'fa-star-christmas',
} as const;

export type IconName = keyof typeof fontAwesomeIcons;
export type IconWeight = 'light' | 'regular' | 'solid' | 'duotone' | 'thin';

interface FontAwesomeIconProps {
  name: IconName;
  weight?: IconWeight;
  spin?: boolean;
  pulse?: boolean;
  className?: string;
}

const weightPrefixes: Record<IconWeight, string> = {
  light: 'fal',
  regular: 'far',
  solid: 'fas',
  duotone: 'fad',
  thin: 'fat',
};

export function FontAwesomeIcon({
  name,
  weight = 'regular',
  spin = false,
  pulse = false,
  className = '',
}: FontAwesomeIconProps) {
  const iconClass = fontAwesomeIcons[name];
  const prefix = weightPrefixes[weight];
  const animationClass = spin ? 'fa-spin' : pulse ? 'fa-pulse' : '';

  return (
    <i
      className={`${prefix} ${iconClass} ${animationClass} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1,
      }}
      aria-hidden="true"
    />
  );
}
