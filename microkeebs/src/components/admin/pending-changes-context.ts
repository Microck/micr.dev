import { createContext } from 'react';
import type { PendingChangesContextType } from './pending-changes-types';

export const PendingChangesContext = createContext<PendingChangesContextType | null>(null);
