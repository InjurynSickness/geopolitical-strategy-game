import { useState } from "react";
import { MenuButton } from "./MenuButton";
import { Trash2 } from "lucide-react";

interface SaveGame {
  id: string;
  name: string;
  date: string;
  country: string;
  flagColor: string;
}

interface LoadGameMenuProps {
  onBack: () => void;
  onConfirmLoad: () => void;
}

export function LoadGameMenu({ onBack, onConfirmLoad }: LoadGameMenuProps) {
  const [activeTab, setActiveTab] = useState<"local" | "cloud">("local");
  const [selectedSave, setSelectedSave] = useState<SaveGame | null>(null);

  // Mock saves for now - will be replaced with real data later
  const mockSaves: SaveGame[] = [
    { id: "1", name: "Germany - 1936", date: "Nov 12, 2025 9:30 PM", country: "Germany", flagColor: "#CC0000" },
    { id: "2", name: "France - 1937", date: "Nov 11, 2025 8:15 PM", country: "France", flagColor: "#0055A4" },
    { id: "3", name: "USA - 1938", date: "Nov 10, 2025 7:00 PM", country: "USA", flagColor: "#B22234" },
  ];

  const saves = activeTab === "local" ? mockSaves : [];

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/terrain.png')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-[420px] bg-gradient-to-b from-stone-900/95 to-black/95 border-2 border-amber-900/60 shadow-2xl">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-700/80" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-700/80" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-700/80" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-700/80" />

        {/* Tabs */}
        <div className="flex gap-2 p-3 pb-0">
          <button
            onClick={() => setActiveTab("local")}
            className={`flex-1 py-2 px-4 border border-amber-900/60 tracking-[0.15em] uppercase text-[11px] transition-colors ${
              activeTab === "local"
                ? "bg-gradient-to-b from-amber-900/50 to-amber-950/60 text-amber-100/90 border-amber-700/80"
                : "bg-gradient-to-b from-stone-800/40 to-stone-900/50 text-amber-100/50 hover:text-amber-100/70"
            }`}
          >
            Local
          </button>
          <button
            onClick={() => setActiveTab("cloud")}
            className={`flex-1 py-2 px-4 border border-amber-900/60 tracking-[0.15em] uppercase text-[11px] transition-colors ${
              activeTab === "cloud"
                ? "bg-gradient-to-b from-amber-900/50 to-amber-950/60 text-amber-100/90 border-amber-700/80"
                : "bg-gradient-to-b from-stone-800/40 to-stone-900/50 text-amber-100/50 hover:text-amber-100/70"
            }`}
          >
            Cloud
          </button>
        </div>

        {/* Save games list */}
        <div className="p-3">
          <div
            className="relative bg-black/80 border border-amber-900/40 min-h-[380px] max-h-[380px] overflow-y-auto"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                rgba(0, 0, 0, 0.2),
                rgba(0, 0, 0, 0.2) 10px,
                rgba(0, 0, 0, 0.3) 10px,
                rgba(0, 0, 0, 0.3) 20px
              )`
            }}
          >
            {/* Corner decorations for list */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-700/40 pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-amber-700/40 pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-amber-700/40 pointer-events-none z-10" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-700/40 pointer-events-none z-10" />

            {activeTab === "local" && saves.length > 0 ? (
              <div className="p-2 space-y-1">
                {saves.map((save) => (
                  <button
                    key={save.id}
                    onClick={() => setSelectedSave(save)}
                    className={`w-full flex items-center gap-3 p-2 group transition-colors ${
                      selectedSave?.id === save.id
                        ? "bg-amber-900/30 border border-amber-700/60"
                        : "bg-stone-900/60 border border-transparent hover:bg-stone-800/60 hover:border-amber-900/40"
                    }`}
                  >
                    {/* Flag placeholder */}
                    <div
                      className="w-10 h-8 border border-amber-900/60 flex-shrink-0"
                      style={{ backgroundColor: save.flagColor }}
                    />

                    {/* Save info */}
                    <div className="flex-1 text-left">
                      <div className="text-amber-100/90 tracking-wider" style={{ fontSize: '12px' }}>
                        {save.name}
                      </div>
                      <div className="text-amber-100/60 tracking-wide" style={{ fontSize: '10px' }}>
                        {save.date}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Future: implement delete
                      }}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-900/30 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500/80" />
                    </button>
                  </button>
                ))}
              </div>
            ) : activeTab === "cloud" ? (
              <div className="flex items-center justify-center min-h-[364px]">
                <span className="text-amber-100/40 tracking-wider text-[11px]">
                  NO CLOUD SAVES FOUND
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[364px]">
                <span className="text-amber-100/40 tracking-wider text-[11px]">
                  NO SAVES FOUND
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-3 pb-3">
          <div className="flex-1">
            <MenuButton onClick={onBack}>Back</MenuButton>
          </div>
          <div className="flex-1">
            <MenuButton
              onClick={onConfirmLoad}
              disabled={!selectedSave}
            >
              Load
            </MenuButton>
          </div>
        </div>
      </div>
    </div>
  );
}
