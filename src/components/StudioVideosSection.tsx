import React, { useState, useRef } from 'react';
import {
  Video,
  Upload,
  Play,
  Pause,
  Film,
  CheckCircle2,
  Trash2,
  Sparkles,
  Plus,
  X,
  FileVideo,
  Volume2,
} from 'lucide-react';
import { triggerConfetti } from '../lib/confetti';
import { STUDIO_VIDEOS } from '../data/mockData';
import { StudioVideo, DesignTheme } from '../types';

interface StudioVideosSectionProps {
  theme: DesignTheme;
}

export const StudioVideosSection: React.FC<StudioVideosSectionProps> = ({
  theme,
}) => {
  const [videos, setVideos] = useState<StudioVideo[]>(STUDIO_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<StudioVideo>(STUDIO_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'timelapse' | 'process' | 'workshop' | 'lettering'>('process');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !uploadTitle.trim()) return;

    const newVid: StudioVideo = {
      id: `custom-vid-${Date.now()}`,
      title: uploadTitle.trim(),
      duration: '0:45 min',
      videoUrl: previewUrl,
      posterUrl:
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      category: uploadCategory,
      description: uploadDesc.trim() || 'Frischer Atelier-Video-Einblick aus Richterswil.',
      uploadedAt: 'Gerade eben',
      isCustomUpload: true,
    };

    setVideos([newVid, ...videos]);
    setActiveVideo(newVid);
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadDesc('');
    setUploadedFile(null);
    setPreviewUrl(null);

    triggerConfetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const togglePlay = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        mainVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    if (activeVideo.id === id && updated.length > 0) {
      setActiveVideo(updated[0]);
    }
  };

  return (
    <section
      id="videos"
      className="py-16 md:py-24 transition-colors duration-300 border-t"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.primaryColor,
              }}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Atelier-Filme & Videoclips</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-light font-serif tracking-tight"
              style={{ color: theme.textPrimary }}
            >
              Einblicke in den Malprozess: <br className="hidden sm:inline" />
              <span className="italic font-normal">Kleine Filme direkt aus dem Atelier</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
              Erlebe, wie Pinselstriche gesetzt werden, Farben auf dem Büttenpapier verschmelzen
              und Holztafeln entstehen. Du kannst hier auch eigene Atelier-Filme direkt hochladen.
            </p>
          </div>

          {/* Upload Button */}
          <button
            id="btn-open-video-upload-modal"
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 flex items-center gap-2 cursor-pointer shrink-0"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Upload className="w-4 h-4" />
            <span>Eigenes Video hochladen</span>
          </button>
        </div>

        {/* Video Theatre Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Large Player (Left 8 cols) */}
          <div
            className="lg:col-span-8 rounded-2xl overflow-hidden border shadow-lg"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="relative aspect-16/9 bg-black flex items-center justify-center group overflow-hidden">
              <video
                ref={mainVideoRef}
                key={activeVideo.id}
                src={activeVideo.videoUrl}
                poster={activeVideo.posterUrl}
                className="w-full h-full object-cover"
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Custom Play Overlay Badge if paused */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                  aria-label="Video abspielen"
                >
                  <Play className="w-7 h-7 fill-neutral-900 ml-1" />
                </button>
              )}

              {activeVideo.isCustomUpload && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                  ✨ Selbst hochgeladenes Video
                </div>
              )}
            </div>

            {/* Video description bar */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Kategorie: {activeVideo.category.toUpperCase()} · {activeVideo.uploadedAt}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  Dauer: {activeVideo.duration}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-light text-neutral-900">
                {activeVideo.title}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                {activeVideo.description}
              </p>
            </div>
          </div>

          {/* Video Playlist Sidebar (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-semibold text-sm text-neutral-900 px-1 flex items-center justify-between">
              <span>Alle Atelier-Clips ({videos.length})</span>
              <span className="text-xs text-neutral-400 font-normal">Klicken zum Abspielen</span>
            </h3>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {videos.map((vid) => {
                const isActive = activeVideo.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setActiveVideo(vid);
                      setIsPlaying(false);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 group relative ${
                      isActive
                        ? 'border-neutral-900 bg-white shadow-md ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-neutral-50/70 hover:bg-white hover:border-neutral-300'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <img
                        src={vid.posterUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-white text-neutral-900' : 'bg-black/60 text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 rounded text-[9px] bg-black/80 text-white font-mono">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h4
                        className={`text-xs font-serif font-medium line-clamp-1 ${
                          isActive ? 'text-neutral-900 font-bold' : 'text-neutral-700'
                        }`}
                      >
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 line-clamp-1">
                        {vid.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{vid.uploadedAt}</span>
                        {vid.isCustomUpload && (
                          <span className="text-emerald-600 font-medium">Eigener Upload</span>
                        )}
                      </div>
                    </div>

                    {/* Delete button if custom upload */}
                    {vid.isCustomUpload && (
                      <button
                        onClick={(e) => handleDeleteVideo(vid.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-rose-500 hover:bg-rose-50 transition-opacity self-start"
                        title="Video entfernen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Video Upload Modal */}
      {showUploadModal && (
        <div
          id="video-upload-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                    Neuen Atelier-Film hochladen
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Kurze Videos (MP4, WebM, MOV) direkt einbinden
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-neutral-500 p-6 rounded-2xl bg-neutral-50 text-center cursor-pointer transition-colors space-y-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700">
                  <FileVideo className="w-6 h-6" />
                </div>

                {uploadedFile ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-700">
                      ✓ Datei ausgewählt: {uploadedFile.name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">
                      Videodatei hier ablegen oder anklicken zum Auswählen
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Unterstützt MP4, WebM, MOV (Smartphone-Reels & Timelapses)
                    </p>
                  </div>
                )}
              </div>

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Titel des Videos *
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="z.B. Nass-in-Nass Technik im Atelier..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Kategorie
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none bg-white font-medium"
                >
                  <option value="process">Malprozess & Aquarell-Verlauf</option>
                  <option value="lettering">Hand-Lettering & Kalligraphie</option>
                  <option value="timelapse">Zeitraffer (Timelapse)</option>
                  <option value="workshop">Workshop & Atelier-Atmosphäre</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Kurze Beschreibung (optional)
                </label>
                <textarea
                  rows={2}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Was sieht man in diesem kurzen Clip?"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!previewUrl || !uploadTitle.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md hover:scale-105 disabled:opacity-40 transition-all cursor-pointer"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Video zur Galerie hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
