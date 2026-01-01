import { useState, useEffect, ReactNode, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AdminLogin } from './AdminLogin';
import { API_BASE } from './api';
import { usePendingChanges } from './PendingChangesContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

interface LogEntry {
  id: number;
  time: string;
  type: 'info' | 'success' | 'error' | 'request' | 'response';
  message: string;
}

let logId = 0;

export function AdminLayout({ children, currentView, onNavigate }: AdminLayoutProps) {
  const { pendingImages, pendingBuilds, pendingRankings, hasChanges, pendingCount, clearAll } = usePendingChanges();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deployError, setDeployError] = useState<string | null>(null);
  const [currentBuilds, setCurrentBuilds] = useState<unknown[]>([]);
  
  // Debug panel state
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<LogEntry[]>([]);
  const [deployProgress, setDeployProgress] = useState<{ current: number; total: number; stage: string } | null>(null);
  
  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
      id: ++logId,
      time: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setDebugLogs(prev => [...prev.slice(-99), entry]);
  }, []);

  useEffect(() => {
    checkAuth();
    fetchCurrentData();
  }, []);

  const fetchCurrentData = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const buildsRes = await fetch(`${API_BASE}/.netlify/functions/admin-builds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (buildsRes.ok) {
        const data = await buildsRes.json();
        setCurrentBuilds(data.builds || []);
      }
    } catch {
      // Ignore
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/.netlify/functions/admin-auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`${API_BASE}/.netlify/functions/admin-auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
    } catch {
      // Ignore
    }
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployStatus('idle');
    setDeployError(null);
    setDeployProgress(null);
    
    const token = localStorage.getItem('admin_token');
    const pendingBuildsArray = Array.from(pendingBuilds.values());
    
    // Accumulate all processed images
    interface ProcessedImage {
      buildId: string;
      index: number;
      fullBase64: string;
      thumbBase64: string;
    }
    const allProcessedImages: ProcessedImage[] = [];
    
    try {
      // Phase 1: Process images in chunks (no commit yet)
      const CHUNK_SIZE = 2;
      const totalImages = pendingImages.length;
      
      if (totalImages > 0) {
        const totalChunks = Math.ceil(totalImages / CHUNK_SIZE);
        addLog('info', `Processing ${totalImages} images in ${totalChunks} chunks`);
        
        for (let i = 0; i < totalImages; i += CHUNK_SIZE) {
          const chunkIndex = Math.floor(i / CHUNK_SIZE);
          const chunk = pendingImages.slice(i, i + CHUNK_SIZE);
          
          setDeployProgress({
            current: i + chunk.length,
            total: totalImages,
            stage: `Processing images ${i + 1}-${Math.min(i + CHUNK_SIZE, totalImages)} of ${totalImages}`,
          });
          
          addLog('request', `POST processImages (chunk ${chunkIndex + 1}/${totalChunks})`);
          
          const res = await fetch(`${API_BASE}/.netlify/functions/admin-deploy`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              processImages: chunk,
              chunkIndex,
              totalChunks,
            }),
          });
          
          const text = await res.text();
          let data;
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            throw new Error(text || 'Invalid response from chunk processing');
          }
          
          if (!res.ok) {
            addLog('error', `Process chunk ${chunkIndex + 1} failed: ${data.error || res.status}`);
            throw new Error(data.error || `Chunk ${chunkIndex + 1} failed`);
          }
          
          // Accumulate processed images
          if (data.processed) {
            allProcessedImages.push(...data.processed);
          }
          
          addLog('success', `Processed chunk ${chunkIndex + 1}/${totalChunks}`);
        }
        
        // Phase 2: Commit images in batches of 5
        const COMMIT_BATCH_SIZE = 5;
        const totalCommitBatches = Math.ceil(allProcessedImages.length / COMMIT_BATCH_SIZE);
        addLog('info', `Committing ${allProcessedImages.length} images in ${totalCommitBatches} batches`);
        
        for (let i = 0; i < allProcessedImages.length; i += COMMIT_BATCH_SIZE) {
          const batchIndex = Math.floor(i / COMMIT_BATCH_SIZE);
          const batch = allProcessedImages.slice(i, i + COMMIT_BATCH_SIZE);
          
          setDeployProgress({
            current: i + batch.length,
            total: allProcessedImages.length,
            stage: `Committing images ${i + 1}-${Math.min(i + COMMIT_BATCH_SIZE, allProcessedImages.length)} of ${allProcessedImages.length}`,
          });
          
          addLog('request', `POST commitImages (batch ${batchIndex + 1}/${totalCommitBatches})`);
          
          const res = await fetch(`${API_BASE}/.netlify/functions/admin-deploy`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              commitImages: batch,
              commitChunkIndex: batchIndex,
              commitTotalChunks: totalCommitBatches,
            }),
          });
          
          const text = await res.text();
          let data;
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            throw new Error(text || 'Invalid response from commit');
          }
          
          if (!res.ok) {
            addLog('error', `Commit batch ${batchIndex + 1} failed: ${data.error || res.status}`);
            throw new Error(data.error || `Commit batch ${batchIndex + 1} failed`);
          }
          
          addLog('success', `Committed batch ${batchIndex + 1}/${totalCommitBatches}`);
        }
      }
      
      // Phase 3: Final deploy - just builds.json + rankings
      setDeployProgress({ current: 0, total: 0, stage: 'Updating builds.json...' });
      addLog('request', `POST finalDeploy (${pendingBuildsArray.length} builds)`);
      
      const res = await fetch(`${API_BASE}/.netlify/functions/admin-deploy`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          finalDeploy: true,
          pendingBuilds: pendingBuildsArray,
          pendingRankings,
          currentBuilds,
        }),
      });
      
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || 'Invalid response');
      }
      
      if (res.ok) {
        addLog('success', 'Deploy complete!');
        setDeployStatus('success');
        clearAll();
        fetchCurrentData();
        setDeployProgress(null);
        setTimeout(() => setDeployStatus('idle'), 4000);
      } else {
        addLog('error', `Final deploy failed: ${data.error}`);
        setDeployError(data.error || 'Deploy failed');
        setDeployStatus('error');
        setTimeout(() => setDeployStatus('idle'), 5000);
      }
    } catch (err) {
      console.error('Deploy error:', err);
      const msg = err instanceof Error ? err.message : 'Deploy failed';
      addLog('error', msg);
      setDeployError(msg);
      setDeployStatus('error');
      setTimeout(() => setDeployStatus('idle'), 5000);
    } finally {
      setDeploying(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ed]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#8b8578] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#5c5647] text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const navItems = [
    { id: 'builds', label: 'Builds', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { id: 'rankings', label: 'Rankings', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-[#f5f3ed]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#d9d5c9] bg-[#eae7dd]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#5c5647] flex items-center justify-center font-bold text-sm text-[#f5f3ed]">
                  MK
                </div>
                <h1 className="text-lg font-semibold text-[#3d3a32]">
                  Admin
                </h1>
              </div>
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      currentView === item.id
                        ? 'bg-[#5c5647] text-[#f5f3ed] shadow-sm'
                        : 'text-[#6b6459] hover:text-[#3d3a32] hover:bg-[#e0dcd0]'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Deploy Progress */}
              {deployProgress && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e0dcd0] text-[#5c5647] text-xs font-mono">
                  {deployProgress.stage}
                </div>
              )}
              
              {/* Pending Changes Indicator */}
              {hasChanges && !deployProgress && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8dcc8] text-[#6b5d3e] text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#c9a55a] animate-pulse" />
                  {pendingCount.images > 0 && <span>{pendingCount.images} images</span>}
                  {pendingCount.builds > 0 && <span>{pendingCount.builds} builds</span>}
                </div>
              )}
              
              {/* Deploy Button */}
              <button
                onClick={handleDeploy}
                disabled={deploying || !hasChanges}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  deployStatus === 'success'
                    ? 'bg-[#6b8f5c] text-white'
                    : deployStatus === 'error'
                    ? 'bg-[#a65d5d] text-white'
                    : hasChanges
                    ? 'bg-[#5c5647] hover:bg-[#4a463a] text-[#f5f3ed] shadow-sm'
                    : 'bg-[#d9d5c9] text-[#8b8578]'
                )}
                title={deployError || undefined}
              >
                {deploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Deploying...
                  </>
                ) : deployStatus === 'success' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Deployed!
                  </>
                ) : deployStatus === 'error' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Failed
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {hasChanges ? 'Deploy' : 'No Changes'}
                  </>
                )}
              </button>
              
              {/* Discard Button */}
              {hasChanges && !deploying && (
                <button
                  onClick={() => {
                    if (confirm(`Discard ${pendingCount.images} images and ${pendingCount.builds} build changes?`)) {
                      clearAll();
                    }
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#a65d5d] hover:bg-[#f0e8e8] transition-colors"
                >
                  Discard
                </button>
              )}
              
              <div className="w-px h-6 bg-[#d9d5c9]" />
              
              {/* Debug Toggle */}
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  showDebug 
                    ? 'bg-[#5c5647] text-[#f5f3ed]' 
                    : 'text-[#6b6459] hover:text-[#3d3a32] hover:bg-[#e0dcd0]'
                )}
                title="Toggle debug panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
              
              <a
                href="#/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#6b6459] hover:text-[#3d3a32] hover:bg-[#e0dcd0] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#a65d5d] hover:bg-[#f0e8e8] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {deployError && deployStatus === 'error' && (
        <div className="bg-[#f0e8e8] border-b border-[#d9c5c5] px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-[#8b5d5d]">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{deployError}</span>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {showDebug && (
        <div className="border-b border-[#d9d5c9] bg-[#2d2d2d] text-[#e0e0e0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-6">
              {/* Pending State */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-[#8b8b8b] uppercase mb-2">Pending State</h3>
                <div className="bg-[#1e1e1e] rounded p-3 text-xs font-mono space-y-2 max-h-48 overflow-auto">
                  <div>
                    <span className="text-[#9cdcfe]">images:</span>{' '}
                    <span className="text-[#b5cea8]">{pendingImages.length}</span>
                    {pendingImages.length > 0 && (
                      <span className="text-[#6a9955]"> [{pendingImages.map(i => `${i.buildId}/${i.index}`).join(', ')}]</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[#9cdcfe]">builds:</span>{' '}
                    <span className="text-[#b5cea8]">{pendingBuilds.size}</span>
                    {pendingBuilds.size > 0 && (
                      <span className="text-[#6a9955]"> [{Array.from(pendingBuilds.keys()).join(', ')}]</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[#9cdcfe]">rankings:</span>{' '}
                    <span className="text-[#b5cea8]">{pendingRankings ? 'modified' : 'null'}</span>
                  </div>
                  <div>
                    <span className="text-[#9cdcfe]">localStorage size:</span>{' '}
                    <span className="text-[#b5cea8]">
                      {(() => {
                        const item = localStorage.getItem('microkeebs_pending_changes');
                        return item ? `${(item.length / 1024).toFixed(1)} KB` : '0 KB';
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Logs */}
              <div className="flex-[2] min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-[#8b8b8b] uppercase">Logs</h3>
                  <button 
                    onClick={() => setDebugLogs([])}
                    className="text-xs text-[#8b8b8b] hover:text-white"
                  >
                    Clear
                  </button>
                </div>
                <div className="bg-[#1e1e1e] rounded p-3 text-xs font-mono max-h-48 overflow-auto">
                  {debugLogs.length === 0 ? (
                    <span className="text-[#6a9955]">No logs yet...</span>
                  ) : (
                    debugLogs.map(log => (
                      <div key={log.id} className="flex gap-2">
                        <span className="text-[#6a9955] flex-shrink-0">{log.time}</span>
                        <span className={cn(
                          'flex-shrink-0',
                          log.type === 'error' && 'text-[#f14c4c]',
                          log.type === 'success' && 'text-[#89d185]',
                          log.type === 'request' && 'text-[#dcdcaa]',
                          log.type === 'response' && 'text-[#9cdcfe]',
                          log.type === 'info' && 'text-[#ce9178]',
                        )}>
                          [{log.type}]
                        </span>
                        <span className="text-[#d4d4d4] break-all">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
