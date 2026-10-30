/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  History,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Filter,
  Calendar,
  X,
  ExternalLink,
  BarChart3,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import { Language, TestResultRecord, TestStatus } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';
import { TestStatisticsDashboard } from './TestStatisticsDashboard';

interface HistoryScreenProps {
  currentLanguage: Language;
  history: TestResultRecord[];
  onSelectRecord: (record: TestResultRecord) => void;
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onSeedData: () => void;
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  currentLanguage,
  history,
  onSelectRecord,
  onClearHistory,
  onDeleteRecord,
  onSeedData,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'statistics'>('records');
  const [statusFilter, setStatusFilter] = useState<'all' | TestStatus>('all');
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<TestResultRecord | null>(null);

  const t = TRANSLATIONS[currentLanguage];

  const filtered = history.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t.statusSafe}
          </span>
        );
      case 'suspicious':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {t.statusSuspicious}
          </span>
        );
      case 'unsafe':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            {t.statusUnsafe}
          </span>
        );
    }
  };

  const handleExportAll = () => {
    playSound('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PureSnap_History_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Export all tests as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your test history?')) {
                  playSound('alert');
                  onClearHistory();
                }
              }}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Clear all test history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Title & Tab Switcher */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-700" />
            <span>{t.recentTests} &amp; Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your local food testing log and visualize test frequency &amp; purity rates over time.
          </p>
        </div>

        {/* View Switcher: Records Log vs Statistics Dashboard */}
        <div className="flex items-center p-1 bg-gray-100 rounded-2xl border border-gray-200">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('records');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Test Records Log ({history.length})</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('statistics');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Test Statistics Dashboard</span>
            <span className="text-[9px] uppercase px-1 py-0.2 bg-emerald-600 text-emerald-100 rounded-sm">
              Charts
            </span>
          </button>
        </div>
      </div>

      {/* Conditionally render Statistics Dashboard or Records List */}
      {activeTab === 'statistics' ? (
        <TestStatisticsDashboard
          history={history}
          onSeedData={onSeedData}
          currentLanguage={currentLanguage}
        />
      ) : (
        <div className="space-y-4">
          {/* Quick link to Statistics */}
          <div
            onClick={() => {
              playSound('click');
              setActiveTab('statistics');
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800">
                  View Test Frequency &amp; Success Rates Over Time
                </h4>
                <p className="text-[11px] text-gray-500">
                  Interactive Recharts dashboard displaying test distribution and purity trends.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'safe', 'suspicious', 'unsafe'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  playSound('click');
                  setStatusFilter(filter);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                  statusFilter === filter
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? `All (${history.length})` : filter}
              </button>
            ))}
          </div>

          {/* History Items List */}
          {filtered.length === 0 ? (
            <div className="p-8 rounded-3xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-3">
              <History className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-medium">{t.noRecentTests}</p>
              <button
                onClick={() => {
                  playSound('click');
                  onSeedData();
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Load Sample Testing History</span>
              </button>
            </div>
          ) : (
        <div className="space-y-2.5">
          {filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => {
                playSound('click');
                setSelectedRecordDetail(record);
              }}
              className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-xl border border-gray-300 shadow-inner shrink-0"
                  style={{ backgroundColor: record.extractedColor.hex }}
                  title={record.extractedColor.hex}
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {record.testName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span className="font-semibold text-gray-700">{record.foodName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(record.status)}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

      {/* Detailed Record Modal */}
      {selectedRecordDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-500 uppercase">Test Record Details</span>
              <button
                onClick={() => setSelectedRecordDetail(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedRecordDetail.testName}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedRecordDetail.timestamp).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(selectedRecordDetail.status)}
              </div>

              {/* Image thumbnail if saved */}
              {selectedRecordDetail.imageThumbnail && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-video">
                  <img
                    src={selectedRecordDetail.imageThumbnail}
                    alt="Strip photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Color Data */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border border-gray-300 shadow-inner shrink-0"
                  style={{ backgroundColor: selectedRecordDetail.extractedColor.hex }}
                />
                <div className="text-xs space-y-0.5 font-mono">
                  <p className="font-bold text-gray-900">HEX: {selectedRecordDetail.extractedColor.hex}</p>
                  <p className="text-gray-500">
                    H:{selectedRecordDetail.extractedColor.h}° S:{selectedRecordDetail.extractedColor.s}% V:{selectedRecordDetail.extractedColor.v}%
                  </p>
                  <p className="text-gray-500">Confidence: {selectedRecordDetail.confidence}</p>
                </div>
              </div>

              {selectedRecordDetail.notes && (
                <p className="text-xs text-gray-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  {selectedRecordDetail.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    onDeleteRecord(selectedRecordDetail.id);
                    setSelectedRecordDetail(null);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <button
                  onClick={() => {
                    onSelectRecord(selectedRecordDetail);
                    setSelectedRecordDetail(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Open Full Result</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
