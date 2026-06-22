type NavIconProps = {
  name: string
  className?: string
}

const paths: Record<string, string[]> = {
  home: [
    'M3 11.5 12 4l9 7.5',
    'M5.5 10.5V20h13v-9.5',
    'M9.5 20v-5.5h5V20',
  ],
  inventory: [
    'M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z',
    'M4 7.5v9L12 21l8-4.5v-9',
    'M12 12v9',
  ],
  invoices: [
    'M7 3.5h8.5L19 7v13.5H7V3.5Z',
    'M15.5 3.5V7H19',
    'M9.5 11h7',
    'M9.5 15h7',
  ],
  parties: [
    'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M15.5 10a2.5 2.5 0 1 0 0-5',
    'M3.5 20a5 5 0 0 1 10 0',
    'M14.5 17a4.5 4.5 0 0 1 6 3',
  ],
  finance: [
    'M6 6h12v12H6V6Z',
    'M9 6V4',
    'M15 6V4',
    'M9 18v2',
    'M15 18v2',
    'M8.5 10.5h7',
    'M8.5 13.5h7',
  ],
  delivery: [
    'M4 6h10v9H4V6Z',
    'M14 9h3.5l2.5 3v3h-6V9Z',
    'M7 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'M17 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  ],
  china: [
    'M5 5h14v14H5V5Z',
    'M8 9h8',
    'M8 12h8',
    'M8 15h5',
  ],
  reports: [
    'M5 19V5',
    'M19 19H5',
    'M9 16v-5',
    'M13 16V8',
    'M17 16v-8',
  ],
  settings: [
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M19.5 12a7.6 7.6 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2-1.2L14.7 3h-5.4L9 5.6a8 8 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5a7.6 7.6 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2 1.2l.3 2.6h5.4l.3-2.6a8 8 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z',
  ],
}

export function NavIcon({ name, className }: NavIconProps) {
  const iconPaths = paths[name] ?? paths.home

  return (
    <svg
      className={className ?? 'nav-icon'}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
