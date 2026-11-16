import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  Shuffle, 
  ArrowUpDown, 
  Trophy,
  Star,
  Check,
  X,
  Radio,
  Flame,
  Medal,
  ShieldCheck
} from 'lucide-react';
import { 
  QUIZ_QUESTIONS, 
  MATCH_PAIRS, 
  TIMELINE_SORT_ITEMS 
} from '../data/museumData';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playSuccessChime, playRadarPing } from '../utils/soundEffects';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface ChallengesViewProps {
  isDark: boolean;
  onBackToHome?: () => void;
}

type ChallengeType = 'quiz' | 'match' | 'timeline';

export const ChallengesView: React.FC<ChallengesViewProps> = ({ isDark, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<ChallengeType>('quiz');
  
  // Overall stats
  const [score, setScore] = useState<number>(80);
  const [completedChallenges, setCompletedChallenges] = useState<{ [key: string]: boolean }>({});

  // 1. Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // 2. Match Pairs State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchStatus, setMatchStatus] = useState<'idle' | 'success' | 'wrong'>('idle');

  // 3. Timeline Order State
  const [sortItems, setSortItems] = useState([...TIMELINE_SORT_ITEMS].sort(() => Math.random() - 0.5));
  const [isTimelineCorrect, setIsTimelineCorrect] = useState<boolean | null>(null);

  // Calculate Progress
  const totalSteps = 3;
  const currentCompletedCount = 
    (completedChallenges['quiz'] ? 1 : 0) + 
    (completedChallenges['match'] ? 1 : 0) + 
    (completedChallenges['timeline'] ? 1 : 0);
  const progressPercent = Math.round((currentCompletedCount / totalSteps) * 100);

  // Badges Earned
  const badges = [
    { id: 'b1', name: 'Chiến sĩ Điện Biên', earned: score >= 50, icon: Star, desc: 'Bắt đầu thao trường lịch sử' },
    { id: 'b2', name: 'Bản Lĩnh Trực Giác', earned: score >= 120, icon: Trophy, desc: 'Vượt qua 2 thao trường tác chiến' },
    { id: 'b3', name: 'Chỉ Huy Chiến Dịch', earned: score >= 180, icon: Award, desc: 'Chinh phục toàn bộ các phần thi' },
  ];

  // Quiz Handlers
  const handleSelectQuizOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
    if (isCorrect) {
      playSuccessChime();
      setScore((prev) => prev + 50);
    } else {
      playRadarPing();
    }

    if (currentQuizIndex === QUIZ_QUESTIONS.length - 1) {
      setCompletedChallenges((prev) => ({ ...prev, quiz: true }));
    }
  };

  const handleNextQuestion = () => {
    playRadarPing();
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleResetQuiz = () => {
    playRadarPing();
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  // Match Pair Handlers
  const handleLeftClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    playRadarPing();
    setSelectedLeft(id);
    setMatchStatus('idle');
  };

  const handleRightClick = (matchTarget: string) => {
    if (!selectedLeft) return;
    const targetItem = MATCH_PAIRS.find((p) => p.id === selectedLeft);

    if (targetItem && targetItem.rightMatch === matchTarget) {
      playSuccessChime();
      setMatchedPairs((prev) => {
        const next = [...prev, selectedLeft];
        if (next.length === MATCH_PAIRS.length) {
          setScore((s) => s + 60);
          setCompletedChallenges((c) => ({ ...c, match: true }));
        }
        return next;
      });
      setMatchStatus('success');
      setSelectedLeft(null);
    } else {
      playRadarPing();
      setMatchStatus('wrong');
      setTimeout(() => {
        setMatchStatus('idle');
      }, 1000);
    }
  };

  // Timeline Order Handlers
  const moveItem = (index: number, direction: 'up' | 'down') => {
    playRadarPing();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortItems.length) return;
    const newItems = [...sortItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setSortItems(newItems);
    setIsTimelineCorrect(null);
  };

  const verifyTimelineOrder = () => {
    const isCorrect = sortItems.every((item, idx) => item.correctIndex === idx);
    setIsTimelineCorrect(isCorrect);
    if (isCorrect) {
      playSuccessChime();
      setScore((s) => s + 60);
      setCompletedChallenges((c) => ({ ...c, timeline: true }));
    } else {
      playRadarPing();
    }
  };

  return (
    <div id="challenges-interactive-view" className="space-y-6 pb-28 pt-2">
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between">
        {onBackToHome ? (
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            ← Về trang chủ
          </button>
        ) : (
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            KHÔNG GIAN HUẤN LUYỆN & THỬ THÁCH
          </span>
        )}

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#C41E24] text-white shadow-xs flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span>Thao trường 3 Chặng</span>
        </span>
      </div>

      {/* Hero Banner with the user provided Black and White Combat Photo */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-gray-700 shadow-xl bg-black min-h-[160px] sm:min-h-[200px] flex items-center">
        <img 
          src={getCuratedImage('ChallengesView__001__CHALLENGES_COMBAT_BW')}
          alt="Hình ảnh lịch sử chiến sĩ xung trận khói lửa hào hùng"
          className="absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getCuratedImage('ChallengesView__002__VIETNAM_PEOPLES_ARMY');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#C41E24] text-white">
              QUÂN KHÍ LỊCH SỬ
            </span>
            <span className="text-xs font-mono text-gray-300">
              TƯ LIỆU THAO TRƯỜNG TÁC CHIẾN
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            Đấu trường Trí tuệ & Thao trường Chiến dịch
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 mt-1.5 leading-relaxed drop-shadow-xs">
            Thử thách bản lĩnh tham mưu, tôi luyện ý chí kiên định và tinh thần quả cảm của người lính Cụ Hồ qua các thử thách lịch sử.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid: 4 cols for score/badge sidebar, 8 cols for active arena on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Sidebar Column (4 cols on lg): Score, Badges, Progress */}
        <div className="lg:col-span-4 space-y-4">
          <div 
            id="challenge-score-header"
            className={`rounded-3xl border-2 p-5 shadow-sm transition-all ${
              isDark 
                ? 'bg-[#112239] border-[#1E3A5F] text-white' 
                : 'bg-white border-gray-200 text-[#1F2937]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#C41E24] text-yellow-300 shadow-md">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#C41E24] dark:text-[#F59E0B] font-bold">
                    Điểm Thao Trường
                  </p>
                  <p className="text-2xl font-extrabold leading-tight">
                    {score} <span className="text-xs font-medium text-gray-400">điểm</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {progressPercent}% Hoàn tất
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden mt-4">
              <div 
                className="bg-gradient-to-r from-[#C41E24] to-[#F59E0B] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Badges Section */}
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Huy hiệu quân vụ đã đạt
              </p>
              <div className="grid grid-cols-3 gap-2">
                {badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                        b.earned
                          ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#0F2747] dark:text-[#F59E0B] shadow-xs'
                          : 'border-dashed border-gray-300 dark:border-gray-800 opacity-40 text-gray-400'
                      }`}
                      title={b.desc}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold truncate max-w-full">{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols on lg): Challenge Arenas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Mode Navigation Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-gray-200 dark:bg-[#112239] text-xs font-extrabold">
            <button
              onClick={() => {
                playRadarPing();
                setActiveTab('quiz');
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                activeTab === 'quiz'
                  ? 'bg-[#C41E24] text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              1. Trắc nghiệm Tác chiến
            </button>
            <button
              onClick={() => {
                playRadarPing();
                setActiveTab('match');
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                activeTab === 'match'
                  ? 'bg-[#C41E24] text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              2. Ghép cặp Địa danh
            </button>
            <button
              onClick={() => {
                playRadarPing();
                setActiveTab('timeline');
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                activeTab === 'timeline'
                  ? 'bg-[#C41E24] text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              3. Sắp xếp Mốc son
            </button>
          </div>

          {/* TAB 1: TRẮC NGHIỆM */}
          {activeTab === 'quiz' && (
            <div 
              id="quiz-container"
              className={`rounded-3xl border-2 p-6 transition-all ${
                isDark ? 'bg-[#112239] border-[#1E3A5F]' : 'bg-white border-gray-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C41E24] dark:text-[#F59E0B]">
                  Câu hỏi {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Làm lại
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#0F2747] dark:text-white leading-relaxed mb-5">
                {QUIZ_QUESTIONS[currentQuizIndex].question}
              </h3>

              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuizIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                  
                  let btnStyle = isDark 
                    ? 'bg-[#0A182D] border-gray-700 hover:border-gray-500 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-800';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400 line-through';
                    } else {
                      btnStyle = 'opacity-50 border-gray-200 dark:border-gray-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerSubmitted && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50 dark:bg-black/30 border border-amber-300 dark:border-amber-800 text-xs leading-relaxed">
                  <p className="font-bold text-[#C41E24] dark:text-[#F59E0B]">Giải thích lịch sử:</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </p>
                  
                  <div className="mt-3 text-right">
                    {currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? (
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 rounded-xl bg-[#C41E24] text-white font-bold text-xs hover:brightness-110 cursor-pointer shadow-md"
                      >
                        Câu tiếp theo →
                      </button>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Bạn đã hoàn thành xuất sắc chặng 1!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GHÉP CẶP ĐỊA DANH */}
          {activeTab === 'match' && (
            <div 
              id="match-pairs-container"
              className={`rounded-3xl border-2 p-6 ${
                isDark ? 'bg-[#112239] border-[#1E3A5F]' : 'bg-white border-gray-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#C41E24] dark:text-[#F59E0B] uppercase">
                  Ghép cặp: Địa danh & Dấu mốc lịch sử
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {matchedPairs.length} / {MATCH_PAIRS.length} Cặp đã ghép
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cột trái: Địa danh */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">1. Chọn Địa danh</p>
                  {MATCH_PAIRS.map((pair) => {
                    const isMatched = matchedPairs.includes(pair.id);
                    const isSelected = selectedLeft === pair.id;

                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched}
                        onClick={() => handleLeftClick(pair.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 line-through'
                            : isSelected
                            ? 'bg-[#C41E24] border-[#C41E24] text-white shadow-md'
                            : isDark
                            ? 'bg-[#0A182D] border-gray-700 hover:border-gray-500 text-white'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-800'
                        }`}
                      >
                        {pair.leftTitle}
                      </button>
                    );
                  })}
                </div>

                {/* Cột phải: Sự kiện tương ứng */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">2. Nối Sự kiện</p>
                  {MATCH_PAIRS.map((pair) => {
                    const isMatched = matchedPairs.includes(pair.id);

                    return (
                      <button
                        key={`r-${pair.id}`}
                        disabled={isMatched || !selectedLeft}
                        onClick={() => handleRightClick(pair.rightMatch)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : matchStatus === 'wrong'
                            ? 'bg-red-500/20 border-red-500 text-red-600'
                            : isDark
                            ? 'bg-[#0A182D] border-gray-700 hover:border-[#F59E0B] text-gray-200'
                            : 'bg-gray-50 border-gray-200 hover:border-[#C41E24] text-gray-800'
                        }`}
                      >
                        {pair.rightMatch}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SẮP XẾP TIMELINE */}
          {activeTab === 'timeline' && (
            <div 
              id="timeline-sort-container"
              className={`rounded-3xl border-2 p-6 ${
                isDark ? 'bg-[#112239] border-[#1E3A5F]' : 'bg-white border-gray-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#C41E24] dark:text-[#F59E0B] uppercase">
                  Sắp xếp các mốc son lịch sử theo thứ tự thời gian
                </span>
                <span className="text-xs font-mono text-gray-400">Dùng nút mũi tên ↑ ↓</span>
              </div>

              <div className="space-y-2.5">
                {sortItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      isDark ? 'bg-[#0A182D] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C41E24] text-white flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === sortItems.length - 1}
                        className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={verifyTimelineOrder}
                  className="px-5 py-2.5 rounded-xl bg-[#C41E24] text-white font-extrabold text-xs hover:brightness-110 shadow-md cursor-pointer"
                >
                  Kiểm tra kết quả
                </button>

                {isTimelineCorrect === true && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Chính xác tuyệt đối! (+60 điểm)
                  </span>
                )}
                {isTimelineCorrect === false && (
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    Chưa đúng thứ tự, hãy thử sắp xếp lại nhé!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
