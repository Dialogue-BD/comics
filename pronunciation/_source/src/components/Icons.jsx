import React from 'react';

const P = (d, extra = {}) => (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`ico ${props.className || ''}`} {...extra}>
    {d}
  </svg>
);

export const IPlay = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" className={`ico ${props.className || ''}`}><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
);
export const IPause = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" className={`ico ${props.className || ''}`}><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
);
export const IReplay = P(<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>);
export const IArrowR = P(<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>);
export const IArrowL = P(<><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>);
export const IMenu = P(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>);
export const IClose = P(<><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>);
export const ITv = P(<><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>);
export const IMic = P(<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></>);
export const IStop = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" className={`ico ${props.className || ''}`}><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
);
export const ICheck = P(<path d="M5 12.5l4.5 4.5L19 7" />);
export const IEar = P(<><path d="M6 9a6 6 0 1 1 12 0c0 3-2 4-3 5.5S13.5 18 12 19.5 8 20 8 17" /><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-1.5 3.5" /></>);
export const IMouth = P(<><path d="M3 12c3-3 6-4 9-4s6 1 9 4c-3 3-6 4-9 4s-6-1-9-4z" /><path d="M3 12h18" /></>);
export const IGame = P(<><rect x="2.5" y="7" width="19" height="11" rx="5.5" /><path d="M7.5 10.5v4" /><path d="M5.5 12.5h4" /><circle cx="15.5" cy="11.5" r=".6" fill="currentColor" /><circle cx="17.5" cy="13.8" r=".6" fill="currentColor" /></>);
export const IHand = P(<><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" /><path d="M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5" /><path d="M14 10.5V5.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.6-2.1L2.6 15.9a1.6 1.6 0 0 1 2.3-2.2L8 16" /></>);
export const IPrint = P(<><path d="M6 9V3h12v6" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v7H7z" /></>);
export const IBook = P(<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>);
export const ISpark = P(<><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M5.6 5.6l2.8 2.8" /><path d="M15.6 15.6l2.8 2.8" /><path d="M18.4 5.6l-2.8 2.8" /><path d="M8.4 15.6l-2.8 2.8" /></>);
export const IThroat = P(<><path d="M9 3c0 4-2 6-2 10a5 5 0 0 0 10 0c0-4-2-6-2-10" /><path d="M10 13h4" /><path d="M10.5 16h3" /></>);
export const STEP_ICON = { ear: IEar, mouth: IMouth, game: IGame };
