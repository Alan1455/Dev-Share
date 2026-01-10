import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  ChevronLeft, 
  Zap, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import toast from 'react-hot-toast';


const EditorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, loadingAuth] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('Ready');
  const [isDirty, setIsDirty] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const id = searchParams.get('id');
  const editorRef = useRef(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setUserProfile(snap.data());
      };
      fetchProfile();
    }
  }, [user]);

  const limits = useMemo(() => {
    const level = userProfile?.level || 'guest';
    if (level === 'premium') return { type: 'PRO', count: 100, chars: 100000 };
    if (level === 'member') return { type: 'MEMBER', count: 30, chars: 5000 };
    return { type: 'GUEST', count: 5, chars: 500 };
  }, [userProfile]);

  const handleSync = async () => {
    if (code.length > limits.chars) {
      toast.error(`字數超出限制！當前上限為 ${limits.chars} 字`, {
        icon: '🚫',
        duration: 3000
      });
      return;
    }

    if (!id || id === 'new-file') {
      const q = query(collection(db, "snippets"), where("authorId", "==", user?.uid || "guest"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size >= limits.count) {
        toast.error(`篇數已達上限 (${limits.count} 篇)`, {
          icon: '👑',
        });
        return;
      }
    }

    setStatus('Syncing...');
    const targetId = (id === 'new-file' || !id) ? `ds-${Math.random().toString(36).slice(2, 9)}` : id;

    try {
      const syncPromise = setDoc(doc(db, "snippets", targetId), {
        code,
        authorId: user?.uid || "guest",
        authorName: user?.displayName || "Anonymous",
        updatedAt: serverTimestamp(),
        language,
        charCount: code.length
      }, { merge: true });

      await toast.promise(syncPromise, {
        loading: '正在同步至雲端...',
        success: '同步成功！',
        error: '同步失敗，請檢查權限。',
      });

      if (id !== targetId) setSearchParams({ id: targetId });
      setIsDirty(false);
      setStatus('Synced');
      setShowShareModal(true); 
      setTimeout(() => setStatus('Ready'), 2000);
    } catch (err) {
      console.error("Sync Error:", err);
      setStatus('Sync Error');
    }
  };

  const handleLocalSave = useCallback(() => {
    setIsDirty(true);
    setStatus('Draft Saved (Local)');
    toast('草稿已暫存！', { icon: '💾' });
    setTimeout(() => setStatus('Ready'), 2000);
  }, []);

  const detectLanguage = (c) => {
    const val = c.toLowerCase();
    if (val.includes('import ') || val.includes('const ') || val.includes('function ')) return 'javascript';
    if (val.includes('def ') || val.includes('print(')) return 'python';
    if (val.includes('<html') || val.includes('</div>')) return 'html';
    if (val.includes('{') && val.includes('margin:')) return 'css';
    return 'javascript';
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme('dev-share-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.selectionBackground': '#3b82f64d',
        'editor.lineHighlightBackground': '#ffffff05',
        'editorCursor.foreground': '#3b82f6',
      }
    });
    monaco.editor.setTheme('dev-share-dark');

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleLocalSave();
    });

    editor.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Space) {
        e.stopPropagation(); 
      }
    });

    setTimeout(() => editor.layout(), 100);
  };

  useEffect(() => {
    if (id && id !== 'new-file') {
      const load = async () => {
        const snap = await getDoc(doc(db, "snippets", id));
        if (snap.exists()) {
          setCode(snap.data().code || '');
          setLanguage(snap.data().language || 'javascript');
          setIsDirty(false);
        }
      };
      load();
    }
  }, [id]);

  const shareUrl = `${window.location.origin}/Dev-Share/#/editor?id=${id}`;

  if (loadingAuth) return <div className="h-screen bg-[#050505] flex items-center justify-center font-mono text-white/20 uppercase tracking-widest">Booting Editor...</div>;

  return (
    <div className="h-screen flex flex-col bg-[#050505] pt-24 pb-6 px-6 overflow-hidden relative">
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-panel p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Check size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">已上傳至雲端</h3>
                </div>
                <button onClick={() => setShowShareModal(false)} className="text-white/20 hover:text-white transition-colors p-2"><X size={24}/></button>
              </div>
              <p className="text-sm text-white/50 mb-6 leading-relaxed font-medium">代碼已上傳至雲端。複製下方連結即可與團隊分享：</p>
              <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl items-center mb-4 overflow-hidden">
                <input readOnly value={shareUrl} className="bg-transparent flex-1 text-xs font-mono px-3 outline-none text-blue-400 truncate" />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    toast.success('連結已複製');
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-blue-600 p-3.5 rounded-xl hover:bg-blue-500 transition-all active:scale-90"
                >
                  {copied ? <Check size={18} className="text-white"/> : <Copy size={18} className="text-white"/>}
                </button>
              </div>
              <button onClick={() => setShowShareModal(false)} className="w-full py-4 text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">Close Panel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel h-16 rounded-2xl flex items-center justify-between px-6 mb-6 shadow-2xl shrink-0">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate('/')} className="text-white/40 hover:text-blue-400 transition-colors p-2 cursor-pointer transition-all"><ChevronLeft size={24} /></button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-black">Workspace</span>
              {isDirty && <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">未儲存</span>}
              <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold uppercase">{limits.type}</span>
            </div>
            <span className="text-sm font-mono text-white/80 truncate max-w-[200px]">{id || 'NEW_UNSAVED_DRAFT'}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">{status}</span>
          <button onClick={handleSync} className="bg-blue-600 hover:bg-blue-500 px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-white">
            <Zap size={14}/> 上傳至雲端
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="w-16 glass-panel rounded-[2rem] flex flex-col items-center py-10 gap-10 text-white/5 shrink-0 border-white/5">
          <Code2 size={20} className="text-blue-500" />
          <Zap size={20} className="text-yellow-500" />
          <Terminal size={20} className="text-purple-500" />
        </div>

        <div className="flex-1 glass-panel rounded-[2.5rem] p-6 relative flex flex-col min-w-0 border-white/5">
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(v) => {
                setCode(v || '');
                setIsDirty(true);
                setLanguage(detectLanguage(v || ''));
              }}
              options={{
                fontSize: 16,
                lineHeight: 24,
                minimap: { enabled: false },
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', monospace",
                cursorBlinking: "expand",
                cursorSmoothCaretAnimation: "on",
                lineNumbersMinChars: 4,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                padding: { top: 16 },
                wordWrap: "on",
                renderLineHighlight: "all",
                selectionHighlight: true,
                fixedOverflowWidgets: true,
                letterSpacing: 0,
                disableLayerHinting: true, 
                matchBrackets: "always",
              }}
              onMount={(editor, monaco) => {
                  handleEditorDidMount(editor, monaco);

                  document.fonts.ready.then(() => {
                    monaco.editor.remeasureFonts();
                    editor.layout();
                  });

                  const resizeObserver = new ResizeObserver(() => {
                    editor.layout();
                  });

                  const container = editor.getDomNode()?.parentElement;
                  if (container) resizeObserver.observe(container);
              }}
            />
          </div>
          <div className="h-10 border-t border-white/5 mt-4 flex items-center justify-between px-2">
            <div className="flex gap-8 text-[10px] font-mono uppercase tracking-[0.2em]">
              <div className="flex flex-col relative">
                <span className="text-white/30">Length</span>
                <span className={code.length > limits.chars ? "text-red-500 font-black animate-pulse" : "text-white/40"}>
                  {code.length} / {limits.chars}
                </span>
                {code.length > limits.chars && (
                  <div className="absolute -top-12 left-0 bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-2 shadow-xl animate-bounce whitespace-nowrap">
                    <ShieldAlert size={12}/> 字數已超出等級上限
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white/30">Engine</span>
                <span className="text-blue-400 font-black">{language.toUpperCase()}</span>
              </div>
            </div>
            <div className="text-[12px] text-white/40 font-mono italic">
              Save draft: Ctrl+S
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;

