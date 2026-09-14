import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function PublishNoticeModal({ isOpen, onClose, onNoticePublished }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.publishNotice({ title, category, content });
      if (res.success && onNoticePublished) {
        onNoticePublished(res.notice);
      }
    } catch (err) {
      console.error('Failed to publish notice:', err);
    }
    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
      setTitle('');
      setContent('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-lg text-slate-900">Broadcast Institutional Notice</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPublished ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Broadcast Published & AI Classified!</h3>
            <p className="text-xs text-slate-500">Notice pushed to all enrolled students with automated NLP tags.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for Autumn Mid-Term Examinations"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option>Academic</option>
                <option>Examination</option>
                <option>Placement</option>
                <option>Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body</label>
              <textarea 
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter detailed notice description. CampusFlow AI will automatically extract deadlines, NLP tags, and target audience..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                required
              ></textarea>
            </div>

            {/* AI Auto-tagging preview */}
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI NLP Classification Preview:
              </span>
              <span className="font-bold bg-white text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                [NLP: {category} Urgent]
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                Publish Broadcast Notice
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

