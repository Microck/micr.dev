import { useContext } from 'react';
import { PendingChangesContext } from './pending-changes-context';

export function usePendingChanges() {
  const context = useContext(PendingChangesContext);
  if (!context) {
    throw new Error('usePendingChanges must be used within PendingChangesProvider');
  }
  return context;
}
