import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { BuildsList } from './BuildsList';
import { BuildEditor } from './BuildEditor';
import { RankingsEditor } from './RankingsEditor';
import { PendingChangesProvider } from './PendingChangesContext';

interface KeyboardBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: 'MX' | 'EC';
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: Record<string, string | undefined>;
}

export function AdminPage() {
  const [currentView, setCurrentView] = useState('builds');
  const [selectedBuild, setSelectedBuild] = useState<KeyboardBuild | null>(null);
  const [builds, setBuilds] = useState<{ id: string; title: string }[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Fetch builds for rankings editor
    const fetchBuilds = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch('/.netlify/functions/admin-builds', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBuilds(data.builds.map((b: KeyboardBuild) => ({ id: b.id, title: b.title })));
        }
      } catch {
        // Ignore errors
      }
    };
    fetchBuilds();
  }, [refreshKey]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedBuild(null);
  };

  const handleSelectBuild = (build: KeyboardBuild) => {
    setSelectedBuild(build);
  };

  const handleSaveBuild = () => {
    setSelectedBuild(null);
    setRefreshKey(k => k + 1);
  };

  const handleDeleteBuild = () => {
    setSelectedBuild(null);
    setRefreshKey(k => k + 1);
  };

  const renderContent = () => {
    if (currentView === 'builds') {
      if (selectedBuild) {
        return (
          <BuildEditor
            build={selectedBuild}
            onSave={handleSaveBuild}
            onDelete={selectedBuild.id ? handleDeleteBuild : undefined}
            onCancel={() => setSelectedBuild(null)}
          />
        );
      }
      return (
        <BuildsList
          key={refreshKey}
          onSelectBuild={handleSelectBuild}
        />
      );
    }

    if (currentView === 'rankings') {
      return <RankingsEditor builds={builds} />;
    }

    return null;
  };

  return (
    <PendingChangesProvider>
      <AdminLayout currentView={currentView} onNavigate={handleNavigate}>
        {renderContent()}
      </AdminLayout>
    </PendingChangesProvider>
  );
}
