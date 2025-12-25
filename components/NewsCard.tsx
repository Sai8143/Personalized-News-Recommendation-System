
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, MessageCircle, BarChart2 } from 'lucide-react';
import { NewsArticle } from '../types';
import { verifyNews } from '../services/geminiService';

interface NewsCardProps {
  article: NewsArticle;
  onChatClick: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onChatClick }) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: string; explanation: string } | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    const result = await verifyNews(article);
    setVerificationResult(result);
    setVerifying(false);
  };

  const getStatusIcon = () => {
    const status = verificationResult?.status || article.factCheckStatus;
    if (status === 'verified') return <ShieldCheck className="w-5 h-5 text-green-500" />;
    if (status === 'debunked') return <ShieldAlert className="w-5 h-5 text-red-500" />;
    if (status === 'suspicious') return <ShieldQuestion className="w-5 h-5 text-yellow-500" />;
    return <ShieldQuestion className="w-5 h-5 text-gray-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'bg-green-100 text-green-700';
    if (score > 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative">
        <img 
          src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/450`} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {article.isIndian && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded uppercase">India</span>
          )}
          <span className="px-2 py-1 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold rounded shadow-sm">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{article.source}</span>
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${getScoreColor(article.credibilityScore)}`}>
            <BarChart2 className="w-3 h-3" />
            Cred: {article.credibilityScore}%
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              {verifying ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              ) : getStatusIcon()}
              {verificationResult ? 'Verified' : 'Check Authenticity'}
            </button>
            <button 
              onClick={() => onChatClick(article)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Analyze
            </button>
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-600"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {verificationResult && (
          <div className={`mt-3 p-3 rounded-lg text-xs ${
            verificationResult.status === 'verified' ? 'bg-green-50 text-green-800' :
            verificationResult.status === 'debunked' ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
          }`}>
            <p className="font-bold mb-1 uppercase text-[10px] tracking-widest">{verificationResult.status} Evidence:</p>
            {verificationResult.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
