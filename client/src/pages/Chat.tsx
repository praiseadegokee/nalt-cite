import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/use-seo';
import { 
  MessageCircle, 
  Plus, 
  Trash2, 
  Send, 
  FileText,
  BookOpen,
  Scale,
  Menu,
  X,
  Upload,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck,
  FileCheck2
} from 'lucide-react';
import type { ChatConversation, ChatMessage, Document } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

const LEGAL_PRESETS = [
  {
    icon: Scale,
    title: 'Nigerian Case Law',
    subtitle: 'Supreme Court, Court of Appeal, NWLR & unreported suits',
    prompt: 'How do I cite a Nigerian reported case (e.g. NWLR) and an unreported case according to the NALT Guide?'
  },
  {
    icon: FileText,
    title: 'Convert Foreign Citation',
    subtitle: 'Transform APA, Harvard, or OSCOLA into NALT format',
    prompt: 'Please convert this citation into standard NALT format: Ojo, A. (2018). Constitutional Developments in Nigeria. Nigerian Law Journal, 22(1), 45-67.'
  },
  {
    icon: BookmarkCheck,
    title: 'Statutes & Constitution',
    subtitle: 'CFRN 1999 (as amended), Federal Acts & Subsidiary Legislation',
    prompt: 'What are the exact NALT rules for citing the Constitution of the Federal Republic of Nigeria 1999 and federal statutes in footnotes vs bibliography?'
  },
  {
    icon: BookOpen,
    title: 'LLM & PhD Thesis Structure',
    subtitle: 'Doctrinal vs Non-doctrinal chapters, abstracts & margins',
    prompt: 'What are the mandatory chapter structures and abstract word count limits for a Master dissertation versus a PhD thesis under the NALT format?'
  }
];

export default function Chat() {
  useSEO({
    title: "NALT Research Studio - Official Legal Citation Assistant",
    description: "Interactive legal research workbench for Nigerian legal writing and NALT citation standards. Powered by official NALT Bluebook (Series No. 2, 2021) and OSCOLA 4th Edition.",
    keywords: "NALT citation assistant, Nigerian legal research, NALT Bluebook, OSCOLA legal citation, legal writing workbench, Nigerian law citation",
    canonicalUrl: "https://naltcite.replit.app/chat"
  });

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showDocDrawer, setShowDocDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ['/api/chat/conversations'],
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/conversations/${selectedConversationId}/messages`],
    enabled: !!selectedConversationId,
  });

  // Fetch available documents
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ['/api/chat/documents'],
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/chat/conversations', { title });
      return response.json();
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      setSelectedConversationId(conversation.id);
      setShowNewConversation(false);
      setNewConversationTitle('');
      
      if (newMessage.trim()) {
        setTimeout(() => {
          sendMessageMutation.mutate(newMessage);
        }, 80);
      }
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to create session: ${error.message}`, variant: 'destructive' });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest('POST', `/api/chat/conversations/${selectedConversationId}/messages`, { question });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${selectedConversationId}/messages`] });
      setNewMessage('');
    },
    onError: (error: any) => {
      if (error.message.includes('404') || error.message.includes('access denied')) {
        queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
        toast({ title: 'Session Expired', description: 'Please start a new research session.', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: `Failed to process inquiry: ${error.message}`, variant: 'destructive' });
      }
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/chat/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      setSelectedConversationId(null);
      toast({ title: 'Session Removed', description: 'Research session has been deleted.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to delete session: ${error.message}`, variant: 'destructive' });
    },
  });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/chat/upload-document', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        return response.json();
      });
      
      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/documents'] });
      toast({ 
        title: 'Document Added', 
        description: `Successfully indexed ${results.length} document${results.length > 1 ? 's' : ''} into the NALT knowledge base.` 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/chat/documents/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/documents'] });
      toast({ title: 'Document Removed', description: 'Reference manual removed from knowledge base.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to delete document: ${error.message}`, variant: 'destructive' });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files);
    }
    event.target.value = '';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (!selectedConversationId && !createConversationMutation.isPending) {
      const title = newMessage.length > 40 ? newMessage.substring(0, 40) + '...' : newMessage;
      createConversationMutation.mutate(title);
      return;
    }
    
    if (selectedConversationId) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: 'Copied to Clipboard', description: 'Citation content copied.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendMessageMutation.isPending]);

  // Auto-select most recent
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      const mostRecent = [...conversations].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      setSelectedConversationId(mostRecent.id);
    }
  }, [conversations, selectedConversationId]);

  const activeConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Studio Bar */}
      <div className="bg-[#1c3877] text-white border-b border-[#0f2047]/30 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wider uppercase text-blue-200">NALT Research Studio</span>
          <span className="hidden md:inline text-white/40">|</span>
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
            <span>Grounded in Official NALT Bluebook (2021) & OSCOLA (4th Ed)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDocDrawer(!showDocDrawer)}
            className="h-7 text-xs text-white/90 hover:text-white hover:bg-white/10 px-2.5 rounded"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5 text-blue-300" />
            <span>Knowledge Base ({documents.length} docs)</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 transition-transform duration-200 ease-in-out
            fixed lg:static z-40 top-0 left-0 bottom-0
            w-72 bg-white border-r border-slate-200
            flex flex-col
          `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#1c3877] text-white flex items-center justify-center font-serif font-bold text-sm">
                N
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 leading-tight">Research Sessions</h2>
                <p className="text-[11px] text-slate-500">History & active queries</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-7 w-7 p-0 text-slate-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New Session Button */}
          <div className="p-3 border-b border-slate-100">
            {showNewConversation ? (
              <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="text"
                  placeholder="Session title..."
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1c3877]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newConversationTitle.trim()) {
                        createConversationMutation.mutate(newConversationTitle);
                      }
                    } else if (e.key === 'Escape') {
                      setShowNewConversation(false);
                    }
                  }}
                />
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (newConversationTitle.trim()) {
                        createConversationMutation.mutate(newConversationTitle);
                      }
                    }}
                    disabled={!newConversationTitle.trim() || createConversationMutation.isPending}
                    className="flex-1 h-7 text-xs bg-[#1c3877] hover:bg-[#142752] text-white"
                  >
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewConversation(false)}
                    className="h-7 text-xs text-slate-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowNewConversation(true)}
                className="w-full h-8 text-xs font-medium bg-[#1c3877] hover:bg-[#142752] text-white shadow-xs rounded flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Research Session</span>
              </Button>
            )}
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium text-slate-600">No active sessions</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Start an inquiry below to begin</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => {
                  const isSelected = selectedConversationId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversationId(conv.id);
                        setSidebarOpen(false);
                      }}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded text-xs cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[#1c3877]/10 text-[#1c3877] font-medium' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                        <MessageCircle className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-[#1c3877]' : 'text-slate-400'}`} />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversationMutation.mutate(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reference Manual Status in Sidebar Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Primary Guidelines</span>
              <Badge variant="outline" className="text-[10px] font-normal py-0 h-4 border-slate-300">Active</Badge>
            </div>
            <div className="space-y-1 text-slate-500">
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-[#1c3877]" />
                <span className="truncate">NALT Monograph (2021)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-blue-600" />
                <span className="truncate">OSCOLA (4th Edition)</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Studio Work Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          {/* Work Area Header */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-8 px-2.5 text-slate-600"
              >
                <Menu className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Sessions</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                  {activeConversation ? activeConversation.title : 'Legal Citation & Formatting Assistant'}
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Verified answers from official Nigerian legal formatting standards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.txt"
                multiple
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="h-8 text-xs border-slate-300 text-slate-700 hover:text-[#1c3877] hover:border-[#1c3877]"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                <span className="hidden sm:inline">Upload Legal PDF</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>

          {/* Reference Document Drawer (Collapsible) */}
          {showDocDrawer && (
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Active Knowledge Base Materials
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDocDrawer(false)}
                  className="h-6 w-6 p-0 text-slate-400"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-start justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-slate-900 truncate">{doc.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="uppercase font-semibold text-[#1c3877]">{doc.documentType}</span>
                        <span>·</span>
                        <span>{doc.filename}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDocumentMutation.mutate(doc.id)}
                      className="h-5 w-5 p-0 text-slate-400 hover:text-red-600 shrink-0"
                      title="Remove manual"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              {messagesLoading ? (
                <div className="flex items-center justify-center py-20 text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-[#1c3877] rounded-full animate-spin mr-3"></div>
                  <span className="text-xs font-medium">Retrieving legal consultation records...</span>
                </div>
              ) : messages.length === 0 ? (
                /* Editorial Welcome / Preset Grid */
                <div className="py-6 sm:py-10 space-y-8">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1c3877] text-white shadow-sm font-serif font-bold text-lg mb-2">
                      §
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
                      NALT Citation & Legal Research Assistant
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Consult the official Nigerian Association of Law Teachers Uniform Format, convert foreign referencing styles, or structure academic dissertations.
                    </p>
                  </div>

                  {/* Preset Action Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {LEGAL_PRESETS.map((preset, idx) => {
                      const Icon = preset.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setNewMessage(preset.prompt);
                            if (!selectedConversationId) {
                              createConversationMutation.mutate(preset.title);
                            }
                          }}
                          className="group p-4 bg-white border border-slate-200 hover:border-[#1c3877] rounded-lg shadow-xs hover:shadow-sm cursor-pointer transition-all duration-150 flex flex-col justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded bg-slate-100 group-hover:bg-[#1c3877]/10 text-slate-700 group-hover:text-[#1c3877] transition-colors shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs font-semibold text-slate-900 group-hover:text-[#1c3877] transition-colors flex items-center gap-1">
                                <span>{preset.title}</span>
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </h3>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                {preset.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="space-y-6">
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        {/* Speaker & Timestamp Header */}
                        <div className="flex items-center gap-2 mb-1.5 px-1 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {isUser ? 'You' : 'NALT Guide Assistant'}
                          </span>
                          <span>·</span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Content Container */}
                        <div 
                          className={`max-w-full sm:max-w-[85%] rounded-lg p-4 sm:p-5 text-sm leading-relaxed ${
                            isUser 
                              ? 'bg-[#1c3877] text-white shadow-xs' 
                              : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                          }`}
                        >
                          {/* Message Body */}
                          <div className="whitespace-pre-wrap break-words space-y-3 font-normal">
                            {msg.content}
                          </div>

                          {/* Sources Cited Badge */}
                          {!isUser && msg.sources && (
                            <div className="mt-4 pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mb-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#1c3877]" />
                                <span>Official Reference Authorities:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {JSON.parse(msg.sources).map((src: string, i: number) => (
                                  <span 
                                    key={i}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-[#1c3877] font-medium border border-slate-200"
                                  >
                                    {src}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Footer for Assistant Answers */}
                          {!isUser && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                              <span className="text-[11px]">Nigerian Legal Citation Standard</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                className="h-7 text-xs text-slate-600 hover:text-[#1c3877] hover:bg-slate-100 px-2 rounded"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                    <span className="text-emerald-700 font-medium">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                    <span>Copy Citation</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Pending Assistant Indicator */}
                  {sendMessageMutation.isPending && (
                    <div className="flex flex-col items-start space-y-1">
                      <div className="text-[11px] font-semibold text-slate-600 px-1">
                        Consulting NALT Knowledge Base...
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs text-xs text-slate-500 flex items-center gap-2.5">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-[#1c3877] rounded-full animate-spin"></div>
                        <span>Retrieving rules and formulating citation...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Composer / Input Dock */}
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4 shrink-0 shadow-sm">
            <div className="max-w-4xl mx-auto space-y-2">
              <div className="relative flex items-end gap-2 bg-[#F8FAFC] border border-slate-300 focus-within:border-[#1c3877] focus-within:ring-1 focus-within:ring-[#1c3877] rounded-lg p-1.5 transition-all">
                <Textarea
                  placeholder="Ask a question about NALT rules, or paste a citation to convert..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[46px] max-h-36 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                  disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending || createConversationMutation.isPending}
                  className="h-9 px-3 bg-[#1c3877] hover:bg-[#142752] text-white rounded shrink-0 shadow-xs text-xs font-medium transition-colors"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  <span>Send</span>
                </Button>
              </div>

              {/* Composer Shortcuts & Guidelines info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">Enter</kbd> to submit, <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">Shift+Enter</kbd> for newline</span>
                <span className="hidden sm:inline">Compliant with NALT Uniform Format (2021)</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
