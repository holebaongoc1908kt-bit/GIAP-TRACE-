import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  Mic, 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  Check, 
  Play, 
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import { 
  RadarAudioSettings, 
  DEFAULT_AUDIO_SETTINGS, 
  AUDIO_SETTINGS_KEY,
  normalizeVietnameseForSpeech
} from '../../data/radarBattlefieldData';
import { playCabinetClick, playTelegraphBeep } from '../../utils/soundEffects';

interface RadarAudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RadarAudioSettings;
  onSaveSettings: (settings: RadarAudioSettings) => void;
}

export const RadarAudioSettingsModal: React.FC<RadarAudioSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = useState<RadarAudioSettings>(settings);
  const [vietnameseVoices, setVietnameseVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [hasLoadedVoices, setHasLoadedVoices] = useState<boolean>(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Discover and filter Vietnamese speech synthesis voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const findVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      setAllVoices(voices);
      setHasLoadedVoices(true);

      const vi = voices.filter(v => 
        v.lang.toLowerCase().startsWith('vi') || 
        v.lang.toLowerCase().includes('vn') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('tiếng việt')
      );
      setVietnameseVoices(vi);
    };

    findVoices();
    window.speechSynthesis.onvoiceschanged = findVoices;

    // Fast interval probe for browsers where voices load with slight delay
    const interval = setInterval(() => {
      findVoices();
    }, 250);
    const timeout = setTimeout(() => clearInterval(interval), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    playTelegraphBeep();

    const sampleText = normalizeVietnameseForSpeech(
      'Chiến dịch Điện Biên Phủ, ngày 13/3/1954. Dưới sự chỉ huy của Đại tướng Võ Nguyên Giáp, toàn quân đồng loạt tiến công tiêu diệt tập đoàn cứ điểm.'
    );

    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.lang = 'vi-VN';
    utterance.rate = localSettings.rate;
    utterance.pitch = localSettings.pitch;
    utterance.volume = localSettings.volume;

    // Pick configured voice or first Vietnamese voice
    if (localSettings.voiceIndex >= 0 && allVoices[localSettings.voiceIndex]) {
      utterance.voice = allVoices[localSettings.voiceIndex];
    } else if (vietnameseVoices.length > 0) {
      // Prioritize male voice if preferred
      const maleVoice = vietnameseVoices.find(v => 
        v.name.toLowerCase().includes('nam') || 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('minh') ||
        !v.name.toLowerCase().includes('female')
      );
      utterance.voice = maleVoice || vietnameseVoices[0];
    }

    utterance.onstart = () => setIsTestingVoice(true);
    utterance.onend = () => setIsTestingVoice(false);
    utterance.onerror = () => setIsTestingVoice(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    playCabinetClick();
    onSaveSettings(localSettings);
    try {
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(localSettings));
    } catch {}
    onClose();
  };

  const handleReset = () => {
    playCabinetClick();
    setLocalSettings(DEFAULT_AUDIO_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#07130C] border-2 border-[#10B981]/50 rounded-2xl shadow-2xl overflow-hidden text-emerald-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-emerald-500/20 bg-emerald-950/40">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <h3 className="text-xs sm:text-sm font-mono font-bold tracking-wider text-emerald-300 uppercase">
                HỆ THỐNG PHÁT THANH LỊCH SỬ
              </h3>
              <p className="text-[9px] text-emerald-400/70 font-mono">
                Cấu hình giọng đọc thuyết minh & âm thanh chiến trường
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          {/* Vietnamese Voice Status / Warning */}
          {hasLoadedVoices && vietnameseVoices.length === 0 && (
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Chưa phát hiện giọng tiếng Việt cài đặt sẵn trong trình duyệt.</strong>
                <p className="text-[10px] text-amber-300/80 mt-0.5">
                  Khuyên dùng trình duyệt Google Chrome hoặc Microsoft Edge để tự động có giọng đọc tiếng Việt chuẩn (Microsoft Nam / Google Tiếng Việt).
                </p>
              </div>
            </div>
          )}

          {/* Voice Selector Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              CHỌN GIỌNG PHÁT THANH VIÊN
            </label>
            <select
              value={localSettings.voiceIndex}
              onChange={(e) => {
                const idx = Number(e.target.value);
                const voice = allVoices[idx];
                setLocalSettings({ 
                  ...localSettings, 
                  voiceIndex: idx,
                  voiceName: voice ? voice.name : ''
                });
              }}
              className="w-full px-3 py-2 bg-black/60 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value={-1}>Tự động chọn giọng Tiếng Việt chuẩn nhất (Nam / Phim tài liệu)</option>
              {allVoices.map((voice, idx) => {
                const isVi = voice.lang.toLowerCase().includes('vi') || voice.lang.toLowerCase().includes('vn');
                return (
                  <option key={voice.name + idx} value={idx}>
                    {isVi ? '⭐ ' : ''}{voice.name} ({voice.lang}) {isVi ? '— Khuyên dùng' : ''}
                  </option>
                );
              })}
            </select>
            <p className="text-[10px] text-emerald-400/60 font-mono">
              Hệ thống đã chuẩn hóa phiên âm mốc thời gian, tên cứ điểm và ngắt nghỉ câu.
            </p>
          </div>

          {/* Speed / Rate Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-300 font-bold">Tốc độ đọc:</span>
              <span className="text-amber-400 font-bold">{localSettings.rate}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.02"
              value={localSettings.rate}
              onChange={(e) => setLocalSettings({ ...localSettings, rate: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-emerald-500/60">
              <span>Trang nghiêm (0.8x)</span>
              <span>Chuẩn tài liệu (0.95x)</span>
              <span>Nhanh (1.2x)</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-300 font-bold">Âm vực / Trầm ấm:</span>
              <span className="text-amber-400 font-bold">{localSettings.pitch}</span>
            </div>
            <input
              type="range"
              min="0.85"
              max="1.15"
              step="0.02"
              value={localSettings.pitch}
              onChange={(e) => setLocalSettings({ ...localSettings, pitch: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-emerald-500/20 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-emerald-200">Hiển thị phụ đề lời thuyết minh</span>
              <input
                type="checkbox"
                checked={localSettings.showSubtitles}
                onChange={(e) => setLocalSettings({ ...localSettings, showSubtitles: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-emerald-200">Hiệu ứng âm thanh Radar & Mã Morse</span>
              <input
                type="checkbox"
                checked={localSettings.enableRadarSfx}
                onChange={(e) => setLocalSettings({ ...localSettings, enableRadarSfx: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-emerald-200">Tiếng âm thanh hào khí nền</span>
              <input
                type="checkbox"
                checked={localSettings.enableBgm}
                onChange={(e) => setLocalSettings({ ...localSettings, enableBgm: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Test Voice Button */}
          <div className="pt-1">
            <button
              onClick={handleTestVoice}
              disabled={isTestingVoice}
              className={`w-full py-2.5 px-4 rounded-xl border font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isTestingVoice 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                  : 'bg-emerald-900/50 hover:bg-emerald-800/60 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isTestingVoice ? 'Đang phát âm thanh mẫu...' : 'Nghe thử giọng thuyết minh'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-emerald-500/20 bg-black/40">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mặc định
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};
