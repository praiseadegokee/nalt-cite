import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
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
  X
} from 'lucide-react';
import type { ChatConversation, ChatMessage, Document } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      toast({ title: 'Error', description: `Failed to send message: ${error.message}`, variant: 'destructive' });
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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    sendMessageMutation.mutate(newMessage);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">NALT Citation Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex h-screen lg:pt-0 pt-16">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:relative z-50 lg:z-auto
          w-80 lg:w-80 h-full bg-white lg:bg-transparent
          flex flex-col gap-4 p-4 lg:p-6
          overflow-y-auto
        `}>
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
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedConversationId === conversation.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedConversationId(conversation.id)}
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
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Knowledge Base Status */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Knowledge Base: {documents.length} documents loaded</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col lg:ml-0 ml-0">
          <Card className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-xl mx-4 lg:mx-6 mb-4 lg:mb-6">
            <CardHeader className="border-b border-gray-100 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {selectedConversationId ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="truncate text-sm lg:text-base">{conversations.find(c => c.id === selectedConversationId)?.title || 'Chat'}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm lg:text-base">Select a conversation</span>
                    </>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Online</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {selectedConversationId ? (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4 lg:p-6">
                    <div className="space-y-4 lg:space-y-6">
                      {messagesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <span>Loading conversation...</span>
                          </div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="max-w-lg mx-auto">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Bot className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to NALT Citation Assistant</h3>
                            <p className="text-gray-600 mb-6">I can help you with Nigerian legal citation standards and formatting. Try asking:</p>
                            <div className="grid gap-3">
                              {[
                                "How do I cite a Nigerian court case using NALT format?",
                                "What is the NALT citation style for statutes?",
                                "How does NALT differ from OSCOLA citation?",
                                "What are the footnote requirements in NALT?"
                              ].map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => setNewMessage(question)}
                                  className="text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-100 transition-all duration-200 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <span className="text-white text-sm font-medium">{index + 1}</span>
                                    </div>
                                    <span className="text-gray-700 font-medium">{question}</span>
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
                            className={`flex gap-4 ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className={`flex gap-2 lg:gap-3 max-w-[95%] lg:max-w-[85%] ${
                              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}>
                              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                message.role === 'user' 
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                                  : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
                              }`}>
                                {message.role === 'user' ? (
                                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                                ) : (
                                  <Bot className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                                )}
                              </div>
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className={`inline-block px-3 lg:px-4 py-2 lg:py-3 rounded-2xl shadow-sm max-w-full ${
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
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4 rounded-b-xl">
                    <div className="flex gap-3 items-end">
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
                          className="min-h-[56px] max-h-32 resize-none border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-2xl pr-12"
                          disabled={sendMessageMutation.isPending}
                        />
                        {sendMessageMutation.isPending && (
                          <div className="absolute bottom-3 right-3">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendMessageMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Press Enter to send, Shift+Enter for new line</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span>Powered by NALT & OSCOLA guides</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Help with Legal Citations</h3>
                    <p className="text-gray-600 mb-6">
                      Start a new conversation or select an existing one to get expert guidance on NALT and OSCOLA citation standards.
                    </p>
                    <Button
                      onClick={() => setShowNewConversation(true)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Conversation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}