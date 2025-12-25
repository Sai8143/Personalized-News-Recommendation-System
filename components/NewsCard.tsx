
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, MessageCircle, BarChart2, Target, Bookmark } from 'lucide-react';
import { NewsArticle } from '../types';
import { verifyNews } from '../services/geminiService';

interface NewsCardProps {
  article: NewsArticle;
  onChatClick: (article: NewsArticle) => void;
  onArticleRead: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onChatClick, onArticleRead }) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: string; explanation: string } | null>(null);

  const handleVerify = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setVerifying(true);
    const result = await verifyNews(article);
    setVerificationResult(result);
    setVerifying(false);
  };

  const getStatusIcon = () => {
    const status = verificationResult?.status || article.factCheckStatus;
    if (status === 'verified') return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    if (status === 'debunked') return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    if (status === 'suspicious') return <ShieldQuestion className="w-4 h-4 text-amber-500" />;
    return <ShieldQuestion className="w-4 h-4 text-slate-300" />;
  };

  return (
    <div 
      onClick={() => onArticleRead(article)}
      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-indigo-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {article.isIndian && (
            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg">India Focus</span>
          )}
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black rounded-full uppercase tracking-widest border border-white/50 shadow-sm">
            {article.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-indigo-600 rounded-full transition-all border border-white/30">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/40 shadow-sm">
            <Target className="w-3 h-3 text-indigo-600" />
            <span className="text-[10px] font-black text-slate-900">{article.similarityScore}% Relevancy</span>
          </div>
        </div>
      </div>

      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">
            {article.source}
          </span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust: {article.credibilityScore}%</span>
          </div>
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-900 leading-[1.3] mb-4 group-hover:text-indigo-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
          {article.summary}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
            >
              {verifying ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-600 border-t-transparent"></div>
              ) : getStatusIcon()}
              {verificationResult ? verificationResult.status : 'Check Fact'}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onChatClick(article); }}
              className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
            >
              <MessageCircle className="w-4 h-4" />
              Analyze
            </button>
          </div>
          
          <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
        </div>

        {verificationResult && (
          <div className={`mt-5 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 border ${
            verificationResult.status === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
            verificationResult.status === 'debunked' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'
          }`}>
            <p className="font-black mb-1 uppercase text-[9px] tracking-[0.15em]">{verificationResult.status} Verification</p>
            <p className="text-xs font-bold leading-relaxed">{verificationResult.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
