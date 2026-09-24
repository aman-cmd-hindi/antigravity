import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  RefreshCw,
  Compass,
  Check,
  X,
  Info,
  BookMarked,
  Lightbulb
} from 'lucide-react';
import { COLLEGES_DATA } from '../../data/cbtQuestions';

export default function CbtResultsCard({
  resultsSummary,
  sessionQuestions = [],
  answers = {},
  restartTest,
  colleges = COLLEGES_DATA
}) {
  const [expandedRationale, setExpandedRationale] = useState({});

  const mathCount = sessionQuestions.filter(q => q.subject === 'Mathematics').length;
  const physicsCount = sessionQuestions.filter(q => q.subject === 'Physics').length;
  const chemistryCount = sessionQuestions.filter(q => q.subject === 'Chemistry').length;

  return (
    <div className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 w-full text-zinc-100">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-amber-400">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
              Mock Assessment Diagnostic
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            MHT-CET Standard Diagnostic Protocol · Performance & Percentile Matrix
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={restartTest}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-white border border-zinc-300 rounded shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reattempt Test
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
          >
            Return to Syllabus
          </Link>
        </div>
      </div>

      {/* Score and Stats block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Dial */}
        <div className="bg-zinc-950/80 rounded-md p-5 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
            Composite Aggregate
          </span>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="#27272a"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="#6366f1"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={326.7}
                strokeDashoffset={
                  326.7 - (326.7 * (resultsSummary?.totalScore || 0)) / (resultsSummary?.maxScore || 1)
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-mono font-bold text-zinc-100">
                {resultsSummary?.totalScore ?? 0}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                / {resultsSummary?.maxScore ?? 0} Marks
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 py-1 px-2.5 rounded font-mono text-xs">
            Percentile: <span className="text-emerald-400 font-bold">{resultsSummary?.percentile ?? 0}%ile</span>
          </div>
        </div>

        {/* Subject Breakdown Card */}
        <div className="bg-zinc-950/80 rounded-md p-5 border border-zinc-800 flex flex-col justify-between space-y-4 md:col-span-2">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
              Subject Vector Breakdown
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              MHT-CET Weight: Math (2x) · Physics (1x) · Chem (1x)
            </span>
          </div>

          <div className="space-y-3">
            {/* Math */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Mathematics
                </span>
                <span className="font-mono text-zinc-300">
                  {resultsSummary?.mathScore ?? 0} / {mathCount * 2} Marks
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-blue-500 rounded transition-all duration-500"
                  style={{ width: `${mathCount > 0 ? ((resultsSummary?.mathScore || 0) / (mathCount * 2)) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Attempted: {resultsSummary?.mathAttempted || 0}/{mathCount}</span>
                <span>Accuracy: {resultsSummary?.mathAttempted > 0 ? Math.round(((resultsSummary.mathScore / 2) / resultsSummary.mathAttempted) * 100) : 0}%</span>
              </div>
            </div>

            {/* Physics */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Physics
                </span>
                <span className="font-mono text-zinc-300">
                  {resultsSummary?.physicsScore ?? 0} / {physicsCount} Marks
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-amber-500 rounded transition-all duration-500"
                  style={{ width: `${physicsCount > 0 ? ((resultsSummary?.physicsScore || 0) / physicsCount) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Attempted: {resultsSummary?.physicsAttempted || 0}/{physicsCount}</span>
                <span>Accuracy: {resultsSummary?.physicsAttempted > 0 ? Math.round((resultsSummary.physicsScore / resultsSummary.physicsAttempted) * 100) : 0}%</span>
              </div>
            </div>

            {/* Chemistry */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Chemistry
                </span>
                <span className="font-mono text-zinc-300">
                  {resultsSummary?.chemistryScore ?? 0} / {chemistryCount} Marks
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-emerald-500 rounded transition-all duration-500"
                  style={{ width: `${chemistryCount > 0 ? ((resultsSummary?.chemistryScore || 0) / chemistryCount) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Attempted: {resultsSummary?.chemistryAttempted || 0}/{chemistryCount}</span>
                <span>Accuracy: {resultsSummary?.chemistryAttempted > 0 ? Math.round((resultsSummary.chemistryScore / resultsSummary.chemistryAttempted) * 100) : 0}%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5" /> {resultsSummary?.correctCount || 0} Correct
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <X className="w-3.5 h-3.5" /> {resultsSummary?.incorrectCount || 0} Incorrect
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Info className="w-3.5 h-3.5" /> {sessionQuestions.length - (resultsSummary?.correctCount || 0) - (resultsSummary?.incorrectCount || 0)} Unattempted
            </span>
          </div>
        </div>
      </div>

      {/* College Predictor Section */}
      <div className="bg-zinc-950 rounded-md p-5 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-200">
              Maharashtra Engineering Cutoff Projection
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Cap Round Historical Reference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {colleges.map((col, idx) => {
            const isEligible = (resultsSummary?.percentile || 0) >= col.minPercentile;
            const diff = ((resultsSummary?.percentile || 0) - col.minPercentile).toFixed(2);
            return (
              <div
                key={idx}
                className={`p-3.5 rounded border transition-colors flex flex-col justify-between space-y-2 ${
                  isEligible
                    ? 'bg-zinc-900/60 border-emerald-500/30'
                    : 'bg-zinc-900/20 border-zinc-800/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-medium text-xs text-zinc-200 leading-snug">
                      {col.name}
                    </h4>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 border ${
                        isEligible
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                          : 'bg-rose-950/40 border-rose-900 text-rose-400'
                      }`}
                    >
                      {isEligible ? 'Eligible' : 'Cutoff Deficit'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400 mt-1">{col.stream}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono border-t border-zinc-800/80 pt-2 text-zinc-400">
                  <span>Threshold: {col.minPercentile}%ile</span>
                  {isEligible ? (
                    <span className="text-emerald-400">+{diff}%ile clearance</span>
                  ) : (
                    <span className="text-rose-400">{diff}%ile margin</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Answer Review section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <BookMarked className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Itemized Audit & Rationale Repository
          </h3>
        </div>

        <div className="space-y-2.5">
          {sessionQuestions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            const isAttempted = userAnswer !== undefined;
            const isOpen = expandedRationale[q.id];

            return (
              <div
                key={q.id}
                className={`bg-zinc-950 rounded border transition-colors ${
                  isAttempted
                    ? isCorrect
                      ? 'border-emerald-900/60'
                      : 'border-rose-900/60'
                    : 'border-zinc-800'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() =>
                    setExpandedRationale(prev => ({ ...prev, [q.id]: !prev[q.id] }))
                  }
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-900/40 border-none bg-transparent"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded font-mono text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border ${
                        q.subject === 'Mathematics'
                          ? 'bg-blue-950/40 text-blue-400 border-blue-900'
                          : q.subject === 'Physics'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-900'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                      }`}
                    >
                      {q.subject}
                    </span>
                    <span className="text-xs text-zinc-400 font-sans">
                      {q.topic}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {q.year || 'PYQ'}
                    </span>

                    {/* Attempt status */}
                    {isAttempted ? (
                      isCorrect ? (
                        <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" /> Correct (+{q.subject === 'Mathematics' ? 2 : 1})
                        </span>
                      ) : (
                        <span className="text-rose-400 text-[10px] font-mono flex items-center gap-1">
                          <X className="w-3 h-3" /> Incorrect (0)
                        </span>
                      )
                    ) : (
                      <span className="text-zinc-500 text-[10px] font-mono">
                        Unattempted
                      </span>
                    )}
                  </div>

                  <span className="text-zinc-500 text-xs font-mono">
                    {isOpen ? 'Collapse [-]' : 'Inspect [+]'}
                  </span>
                </button>

                {/* Body */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-zinc-800/80 space-y-3 text-xs">
                    <p className="text-zinc-200 font-medium leading-relaxed">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((option, oIdx) => {
                        const isCorrectOption = oIdx === q.correct;
                        const isUserChosen = oIdx === userAnswer;

                        let optBorder = 'border-zinc-800 bg-zinc-900/30 text-zinc-400';
                        if (isCorrectOption) {
                          optBorder = 'border-emerald-800 bg-emerald-950/30 text-emerald-300 font-medium';
                        } else if (isUserChosen) {
                          optBorder = 'border-rose-800 bg-rose-950/30 text-rose-300 font-medium';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded border flex items-center gap-2.5 ${optBorder}`}
                          >
                            <span
                              className={`w-5 h-5 rounded text-[10px] font-mono flex items-center justify-center border ${
                                isCorrectOption
                                  ? 'bg-emerald-900 border-emerald-700 text-white'
                                  : isUserChosen
                                  ? 'bg-rose-900 border-rose-700 text-white'
                                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-snug flex-1">{option}</span>
                            {isCorrectOption && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {!isCorrect && isUserChosen && <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Rationale */}
                    <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 flex items-center gap-1.5">
                        <Info className="w-3 h-3" /> Step-by-Step Derivation
                      </span>
                      <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                        {q.rationale}
                      </p>
                    </div>

                    {/* Hint */}
                    {q.hint && (
                      <div className="p-2.5 bg-amber-950/20 rounded border border-amber-900/30 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 flex items-center gap-1.5">
                          <Lightbulb className="w-3 h-3 text-amber-400" /> Core Axiom / Hint
                        </span>
                        <p className="text-zinc-400 leading-relaxed text-xs">
                          {q.hint}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
