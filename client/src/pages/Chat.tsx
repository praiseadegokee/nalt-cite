import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/use-seo';
import { 
  MessageCircle, 
  Plus, 
  Trash2, 
  Send, 
  Bot, 
  User, 
  FileText,
  BookOpen,
  Sparkles,
  Menu,
  X,
  Upload
} from 'lucide-react';
import type { ChatConversation, ChatMessage, Document } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export default function Chat() {
  useSEO({
    title: "AI Legal Assistant - NALT Citation Help & Legal Writing Support",
    description: "Get instant help with NALT citations and legal writing from our AI assistant. Ask questions about Nigerian law citations, convert between citation formats, and get expert guidance on legal research.",
    keywords: "AI legal assistant, NALT citation help, legal writing assistant, Nigerian law AI, citation conversion, legal research help, NALT guide AI",
    canonicalUrl: "https://naltcite.replit.app/chat"
  });

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      console.log('Creating conversation with title:', title);
      const response = await apiRequest('POST', '/api/chat/conversations', { title });
      console.log('Response status:', response.status);
      return response.json();
    },
    onSuccess: (conversation) => {
      console.log('Conversation created successfully:', conversation);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      setSelectedConversationId(conversation.id);
      setShowNewConversation(false);
      setNewConversationTitle('');
      
      // Auto-send the pending message if we have one
      if (newMessage.trim()) {
        setTimeout(() => {
          sendMessageMutation.mutate(newMessage);
        }, 100);
      }
      
      toast({ title: 'Success', description: 'Conversation created successfully' });
    },
    onError: (error) => {
      console.error('Conversation creation failed:', error);
      toast({ title: 'Error', description: `Failed to create conversation: ${error.message}`, variant: 'destructive' });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (question: string) => {
      console.log('Sending message:', question);
      const response = await apiRequest('POST', `/api/chat/conversations/${selectedConversationId}/messages`, { question });
      console.log('Message sent successfully');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${selectedConversationId}/messages`] });
      setNewMessage('');
      toast({ title: 'Success', description: 'Message sent successfully' });
    },
    onError: (error) => {
      console.error('Message sending failed:', error);
      // If it's a session/access error, refresh conversations to sync session
      if (error.message.includes('404') || error.message.includes('access denied')) {
        queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
        toast({ title: 'Error', description: 'Session expired. Please try again.', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: `Failed to send message: ${error.message}`, variant: 'destructive' });
      }
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting conversation:', id);
      const response = await apiRequest('DELETE', `/api/chat/conversations/${id}`);
      console.log('Conversation deleted successfully');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      setSelectedConversationId(null);
      toast({ title: 'Success', description: 'Conversation deleted successfully' });
    },
    onError: (error) => {
      console.error('Conversation deletion failed:', error);
      toast({ title: 'Error', description: `Failed to delete conversation: ${error.message}`, variant: 'destructive' });
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
      const successCount = results.length;
      toast({ 
        title: 'Success', 
        description: `${successCount} document${successCount > 1 ? 's' : ''} uploaded successfully` 
      });
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      toast({ title: 'Error', description: `Upload failed: ${error.message}`, variant: 'destructive' });
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
      toast({ title: 'Success', description: 'Document removed successfully' });
    },
    onError: (error) => {
      console.error('Failed to delete document:', error);
      toast({ title: 'Error', description: `Failed to delete document: ${error.message}`, variant: 'destructive' });
    },
  });

  // Handle file upload
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
      // Auto-create conversation if none exists
      const title = newMessage.length > 50 ? newMessage.substring(0, 50) + '...' : newMessage;
      createConversationMutation.mutate(title);
      return;
    }
    
    if (selectedConversationId) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const handleCreateConversation = () => {
    if (!newConversationTitle.trim()) return;
    createConversationMutation.mutate(newConversationTitle);
  };

  const handleDeleteConversation = (id: number) => {
    deleteConversationMutation.mutate(id);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the sidebar itself or the open button
        if (!target.closest('[data-sidebar]') && !target.closest('[data-sidebar-trigger]')) {
          setSidebarOpen(false);
        }
      }
    };

    if (sidebarOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sidebarOpen]);

  // Auto-select most recent conversation if available
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      // Select the most recent conversation
      const mostRecent = conversations.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      setSelectedConversationId(mostRecent.id);
    }
  }, [conversations.length, selectedConversationId]);

  // Show welcome screen when no conversations exist
  const showWelcomeScreen = conversations.length === 0 && !selectedConversationId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div 
          data-sidebar
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            fixed lg:relative z-40 lg:z-auto top-0 left-0
            w-80 h-full lg:h-auto lg:min-h-screen bg-white lg:bg-transparent
            flex flex-col gap-4 p-4 lg:p-6
            overflow-y-auto shadow-xl lg:shadow-none
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Header - Hidden on mobile */}
          <Card className="hidden lg:block bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">NALT Citation Assistant</div>
                  <div className="text-xs text-gray-500 font-normal">Powered by AI</div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* New Conversation */}
          {showNewConversation ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 space-y-3">
                <Textarea
                  placeholder="Enter conversation title..."
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateConversation}
                    disabled={!newConversationTitle.trim() || createConversationMutation.isPending}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewConversation(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              onClick={() => setShowNewConversation(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          )}

          {/* Conversations List */}
          <Card className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] lg:h-[400px]">
                <div className="p-4 space-y-2">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs text-gray-400 mt-1">Start a new chat to get help</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedConversationId === conversation.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedConversationId(conversation.id);
                          setSidebarOpen(false);
                        }}
                      >
                      <MessageCircle className={`h-4 w-4 flex-shrink-0 ${
                        selectedConversationId === conversation.id ? 'text-white' : 'text-gray-400'
                      }`} />
                      <span className="flex-1 text-sm font-medium truncate">{conversation.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ${
                          selectedConversationId === conversation.id 
                            ? 'hover:bg-white/20 text-white' 
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>


        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-screen">
          <Card className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-xl m-2 sm:m-4 lg:mx-6 lg:mb-6 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-gray-100 p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-white" />
                  </div>
                  <span className="truncate text-sm lg:text-base font-medium">NALT Citation Assistant</span>
                </CardTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Online</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSidebarOpen(true);
                    }}
                    data-sidebar-trigger
                    className="lg:hidden flex items-center gap-2 text-xs px-3 py-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 transition-all duration-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chats</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto">
                <ScrollArea className="h-full">
                  <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
                    {showWelcomeScreen ? (
                      <div className="text-center py-8 lg:py-12 px-4">
                        <div className="max-w-lg mx-auto">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Bot className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Welcome to NALT Citation Assistant</h3>
                          <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">I can help you with Nigerian legal citation standards and formatting. Start by asking a question below, or try these examples:</p>
                          <div className="grid gap-2 lg:gap-3">
                            {[
                              "How do I cite a Nigerian court case using NALT format?",
                              "What is the NALT citation style for statutes?", 
                              "How does NALT differ from OSCOLA citation?",
                              "What are the footnote requirements in NALT?"
                            ].map((question, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setNewMessage(question);
                                  setSidebarOpen(false);
                                }}
                                className="text-left p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-100 transition-all duration-200 group"
                              >
                                <div className="flex items-center gap-2 lg:gap-3">
                                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <span className="text-white text-xs lg:text-sm font-medium">{index + 1}</span>
                                  </div>
                                  <span className="text-gray-700 text-sm lg:text-base font-medium leading-tight">{question}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : selectedConversationId ? (
                      messagesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <span>Loading conversation...</span>
                          </div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-8 lg:py-12 px-4">
                          <div className="max-w-lg mx-auto">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Bot className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Welcome to NALT Citation Assistant</h3>
                            <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">I can help you with Nigerian legal citation standards and formatting. Try asking:</p>
                            <div className="grid gap-2 lg:gap-3">
                              {[
                                "How do I cite a Nigerian court case using NALT format?",
                                "What is the NALT citation style for statutes?",
                                "How does NALT differ from OSCOLA citation?",
                                "What are the footnote requirements in NALT?"
                              ].map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setNewMessage(question);
                                    setSidebarOpen(false);
                                  }}
                                  className="text-left p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-100 transition-all duration-200 group"
                                >
                                  <div className="flex items-center gap-2 lg:gap-3">
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                      <span className="text-white text-xs lg:text-sm font-medium">{index + 1}</span>
                                    </div>
                                    <span className="text-gray-700 text-sm lg:text-base font-medium leading-tight">{question}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-2 sm:gap-4 ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className={`flex gap-2 lg:gap-3 max-w-[90%] sm:max-w-[85%] ${
                              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}>
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                message.role === 'user' 
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                                  : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
                              }`}>
                                {message.role === 'user' ? (
                                  <User className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                                ) : (
                                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                                )}
                              </div>
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm max-w-full ${
                                  message.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                                }`}>
                                  <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.content}</div>
                                  {message.sources && JSON.parse(message.sources).length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-300/50">
                                      <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-600">Sources</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {JSON.parse(message.sources).map((source: string, index: number) => (
                                          <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                                          >
                                            {source.length > 30 ? `${source.substring(0, 30)}...` : source}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className={`text-xs text-gray-500 ${
                                  message.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      <div className="text-center py-8 lg:py-12 px-4">
                        <div className="max-w-lg mx-auto">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Bot className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Welcome to NALT Citation Assistant</h3>
                          <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">I can help you with Nigerian legal citation standards and formatting. Start by asking a question below, or try these examples:</p>
                          <div className="grid gap-2 lg:gap-3">
                            {[
                              "How do I cite a Nigerian court case using NALT format?",
                              "What is the NALT citation style for statutes?", 
                              "How does NALT differ from OSCOLA citation?",
                              "What are the footnote requirements in NALT?"
                            ].map((question, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setNewMessage(question);
                                  setSidebarOpen(false);
                                }}
                                className="text-left p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-100 transition-all duration-200 group"
                              >
                                <div className="flex items-center gap-2 lg:gap-3">
                                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <span className="text-white text-xs lg:text-sm font-medium">{index + 1}</span>
                                  </div>
                                  <span className="text-gray-700 text-sm lg:text-base font-medium leading-tight">{question}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-100 bg-gray-50/50 p-3 sm:p-4 lg:p-4 flex-shrink-0">
                <div className="flex gap-2 lg:gap-3 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Ask about NALT guidelines, citation formats, or legal writing standards..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[44px] sm:min-h-[48px] lg:min-h-[56px] max-h-32 resize-none border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-2xl pr-12 text-sm lg:text-base"
                      disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
                    />
                    {(sendMessageMutation.isPending || createConversationMutation.isPending) && (
                      <div className="absolute bottom-3 right-3">
                        <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending || createConversationMutation.isPending}
                    className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {(sendMessageMutation.isPending || createConversationMutation.isPending) ? (
                      <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
                    <span className="sm:hidden">Tap send or press Enter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>AI Assistant Online</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}