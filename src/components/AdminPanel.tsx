import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const TABS_API = "https://functions.poehali.dev/1b2432d8-8d89-4323-9619-a7a916717197";
const MEDIA_API = "https://functions.poehali.dev/f7c2a792-6b23-43ba-82db-06b15e63050a";

const TAB_LABELS: Record<string, string> = {
  north: "Северяне",
  privilege: "Льготный стаж",
  teachers: "Учителя",
  doctors: "Медики",
  mvd: "МВД / МЧС",
};

interface TabData {
  tab_id: string;
  title: string;
  subtitle: string;
  description: string;
  conditions: string[];
  mistakes: string[];
  badge: string;
  updated_at?: string;
}

interface MediaFile {
  id: number;
  tab_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("north");
  const [tabData, setTabData] = useState<TabData | null>(null);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTab(activeTab);
    loadMedia(activeTab);
  }, [activeTab]);

  async function loadTab(tabId: string) {
    setTabData(null);
    const res = await fetch(`${TABS_API}?tab_id=${tabId}`);
    const data = await res.json();
    setTabData(data);
  }

  async function loadMedia(tabId: string) {
    const res = await fetch(`${MEDIA_API}?tab_id=${tabId}`);
    const data = await res.json();
    setMedia(Array.isArray(data) ? data : []);
  }

  async function saveTab() {
    if (!tabData) return;
    setSaving(true);
    await fetch(TABS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tabData),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const fileType = file.type.startsWith("image/") ? "image"
      : file.type.startsWith("video/") ? "video"
      : "pdf";
    const base64 = await toBase64(file);
    await fetch(MEDIA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tab_id: activeTab,
        file_data: base64,
        file_name: file.name,
        file_type: fileType,
        content_type: file.type,
      }),
    });
    setUploading(false);
    loadMedia(activeTab);
  }

  async function deleteMedia(id: number) {
    await fetch(`${MEDIA_API}?media_id=${id}`, { method: "DELETE" });
    setMedia((m) => m.filter((f) => f.id !== id));
  }

  function toBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        res(result.split(",")[1]);
      };
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  function updateCondition(i: number, val: string) {
    if (!tabData) return;
    const updated = [...tabData.conditions];
    updated[i] = val;
    setTabData({ ...tabData, conditions: updated });
  }

  function addCondition() {
    if (!tabData) return;
    setTabData({ ...tabData, conditions: [...tabData.conditions, ""] });
  }

  function removeCondition(i: number) {
    if (!tabData) return;
    setTabData({ ...tabData, conditions: tabData.conditions.filter((_, idx) => idx !== i) });
  }

  function updateMistake(i: number, val: string) {
    if (!tabData) return;
    const updated = [...tabData.mistakes];
    updated[i] = val;
    setTabData({ ...tabData, mistakes: updated });
  }

  function addMistake() {
    if (!tabData) return;
    setTabData({ ...tabData, mistakes: [...tabData.mistakes, ""] });
  }

  function removeMistake(i: number) {
    if (!tabData) return;
    setTabData({ ...tabData, mistakes: tabData.mistakes.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[hsl(var(--navy))] rounded-xl flex items-center justify-center">
              <Icon name="Settings" size={18} className="text-[hsl(var(--gold))]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[hsl(var(--navy))]">Панель редактирования</h2>
              <p className="text-xs text-gray-400">Изменения сохраняются в базе данных</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Icon name="X" size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="px-8 pt-5 pb-0 flex gap-2 overflow-x-auto border-b border-gray-100 pb-0">
          {Object.entries(TAB_LABELS).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl whitespace-nowrap border-b-2 transition-all ${
                activeTab === id
                  ? "text-[hsl(var(--navy))] border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!tabData ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[hsl(var(--navy))] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="px-8 py-6 space-y-6">

            {/* Basic fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Заголовок</label>
                <input
                  value={tabData.title}
                  onChange={(e) => setTabData({ ...tabData, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[hsl(var(--navy))] focus:outline-none focus:border-[hsl(var(--gold))] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Подзаголовок</label>
                <input
                  value={tabData.subtitle}
                  onChange={(e) => setTabData({ ...tabData, subtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[hsl(var(--navy))] focus:outline-none focus:border-[hsl(var(--gold))] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Значок (badge)</label>
              <input
                value={tabData.badge}
                onChange={(e) => setTabData({ ...tabData, badge: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[hsl(var(--navy))] focus:outline-none focus:border-[hsl(var(--gold))] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Описание</label>
              <textarea
                value={tabData.description}
                onChange={(e) => setTabData({ ...tabData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[hsl(var(--navy))] focus:outline-none focus:border-[hsl(var(--gold))] transition-colors resize-none"
              />
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Icon name="CheckCircle" size={13} className="text-[hsl(var(--gold))]" />
                  Условия назначения
                </label>
                <button onClick={addCondition} className="text-xs text-[hsl(var(--navy))] border border-[hsl(var(--navy))]/20 px-3 py-1 rounded-lg hover:bg-[hsl(var(--navy))] hover:text-white transition-all flex items-center gap-1">
                  <Icon name="Plus" size={12} /> Добавить
                </button>
              </div>
              <div className="space-y-2">
                {tabData.conditions.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-6 h-6 bg-[hsl(var(--gold))]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-2.5 text-xs font-bold text-[hsl(var(--gold))]">{i + 1}</div>
                    <input
                      value={c}
                      onChange={(e) => updateCondition(i, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[hsl(var(--gold))] transition-colors"
                    />
                    <button onClick={() => removeCondition(i)} className="w-9 h-9 mt-1 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon name="Trash2" size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mistakes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Icon name="AlertTriangle" size={13} className="text-red-400" />
                  Частые ошибки СФР
                </label>
                <button onClick={addMistake} className="text-xs text-[hsl(var(--navy))] border border-[hsl(var(--navy))]/20 px-3 py-1 rounded-lg hover:bg-[hsl(var(--navy))] hover:text-white transition-all flex items-center gap-1">
                  <Icon name="Plus" size={12} /> Добавить
                </button>
              </div>
              <div className="space-y-2">
                {tabData.mistakes.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-2.5">
                      <Icon name="X" size={12} className="text-red-400" />
                    </div>
                    <input
                      value={m}
                      onChange={(e) => updateMistake(i, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-300 transition-colors"
                    />
                    <button onClick={() => removeMistake(i)} className="w-9 h-9 mt-1 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon name="Trash2" size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media upload */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Icon name="Paperclip" size={13} className="text-gray-400" />
                  Медиафайлы (фото, видео, PDF)
                </label>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-xs text-[hsl(var(--navy))] border border-[hsl(var(--navy))]/20 px-3 py-1 rounded-lg hover:bg-[hsl(var(--navy))] hover:text-white transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Icon name={uploading ? "Loader" : "Upload"} size={12} className={uploading ? "animate-spin" : ""} />
                  {uploading ? "Загрузка..." : "Загрузить файл"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
                />
              </div>

              {media.length === 0 ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[hsl(var(--gold))] transition-colors"
                >
                  <Icon name="Upload" size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Перетащите файлы или нажмите для выбора</p>
                  <p className="text-xs text-gray-300 mt-1">JPG, PNG, MP4, PDF — до 50 МБ</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {media.map((f) => (
                    <div key={f.id} className="relative group border border-gray-100 rounded-2xl overflow-hidden bg-gray-50">
                      {f.file_type === "image" && (
                        <img src={f.file_url} alt={f.file_name} className="w-full h-28 object-cover" />
                      )}
                      {f.file_type === "video" && (
                        <div className="h-28 flex items-center justify-center bg-[hsl(var(--navy))]/10">
                          <Icon name="Play" size={32} className="text-[hsl(var(--navy))]" />
                        </div>
                      )}
                      {f.file_type === "pdf" && (
                        <div className="h-28 flex items-center justify-center bg-red-50">
                          <Icon name="FileText" size={32} className="text-red-400" />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{f.file_name}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={f.file_url} target="_blank" rel="noreferrer" className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50">
                          <Icon name="ExternalLink" size={12} className="text-gray-600" />
                        </a>
                        <button onClick={() => deleteMedia(f.id)} className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center hover:bg-red-50">
                          <Icon name="Trash2" size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer hover:border-[hsl(var(--gold))] transition-colors"
                  >
                    <Icon name="Plus" size={22} className="text-gray-300 mb-1" />
                    <p className="text-xs text-gray-300">Добавить</p>
                  </div>
                </div>
              )}
            </div>

            {/* Save button */}
            <div className="pt-2 flex items-center gap-4 border-t border-gray-100">
              <button
                onClick={saveTab}
                disabled={saving}
                className="flex-1 py-3.5 bg-[hsl(var(--navy))] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Icon name={saving ? "Loader" : saved ? "Check" : "Save"} size={16} className={saving ? "animate-spin" : ""} />
                {saving ? "Сохраняю..." : saved ? "Сохранено!" : "Сохранить изменения"}
              </button>
              <button onClick={onClose} className="px-6 py-3.5 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
                Закрыть
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
