import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Plus, Trash2, Upload, FileText, Bot, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { ChatConversation, ChatMessage, Document } from '@shared/schema';

export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      setSelectedConversationId(conversation.id);
      setShowNewConversation(false);
      setNewConversationTitle('');
      toast({ title: 'Conversation created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create conversation', variant: 'destructive' });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, question }: { conversationId: number; question: string }) => {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${selectedConversationId}/messages`] });
      setNewMessage('');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/chat/upload-document', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/documents'] });
      setUploadFile(null);
      if (result.success) {
        toast({ title: 'Document uploaded successfully', description: result.message });
      } else {
        toast({ title: 'Upload failed', description: result.message, variant: 'destructive' });
      }
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to upload document', variant: 'destructive' });
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/chat/conversations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete conversation');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      if (selectedConversationId === conversations.find(c => c.id === selectedConversationId)?.id) {
        setSelectedConversationId(null);
      }
      toast({ title: 'Conversation deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete conversation', variant: 'destructive' });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select first conversation if none selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    sendMessageMutation.mutate({ conversationId: selectedConversationId, question: newMessage });
  };

  const handleCreateConversation = () => {
    if (!newConversationTitle.trim()) return;
    createConversationMutation.mutate(newConversationTitle);
  };

  const handleUploadDocument = () => {
    if (!uploadFile) return;
    uploadDocumentMutation.mutate(uploadFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
    } else {
      toast({ title: 'Error', description: 'Please select a PDF file', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NALT Citation Assistant</h1>
              <p className="text-sm text-gray-600">AI-powered legal citation guidance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Knowledge Base Status */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <FileText className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-800 font-medium truncate">
                        {doc.filename?.replace('_Complete_Guide.pdf', '').replace('_Guide.pdf', '') || doc.title}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-700 font-medium">AI Ready</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Documents indexed for intelligent search</p>
                </div>
              </CardContent>
            </Card>

            {/* Conversations */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between text-gray-700">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Conversations
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowNewConversation(true)}
                    className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {showNewConversation && (
                  <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg border">
                    <Input
                      placeholder="Name your conversation..."
                      value={newConversationTitle}
                      onChange={(e) => setNewConversationTitle(e.target.value)}
                      className="text-sm border-0 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateConversation();
                        if (e.key === 'Escape') setShowNewConversation(false);
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleCreateConversation}
                        disabled={createConversationMutation.isPending}
                        className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        Create
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowNewConversation(false)}
                        className="h-7 px-3 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <ScrollArea className="h-64">
                  <div className="space-y-1">
                    {conversations.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No conversations yet</p>
                        <p className="text-xs">Create one to get started</p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer text-sm transition-all duration-200 ${
                            selectedConversationId === conv.id
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                          onClick={() => setSelectedConversationId(conv.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium text-gray-900">{conv.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(conv.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversationMutation.mutate(conv.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
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

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-white/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {selectedConversationId ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                        <span>{conversations.find(c => c.id === selectedConversationId)?.title || 'Chat'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <span>Select a conversation to start</span>
                      </div>
                    )}
                  </CardTitle>
                  {selectedConversationId && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>AI Assistant Online</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {selectedConversationId ? (
                  <>
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-6">
                      <div className="space-y-6">
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
                              <div className={`flex gap-3 max-w-[85%] ${
                                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                              }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  message.role === 'user' 
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                                    : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
                                }`}>
                                  {message.role === 'user' ? (
                                    <User className="h-5 w-5 text-white" />
                                  ) : (
                                    <Bot className="h-5 w-5 text-white" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
                                    message.role === 'user'
                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                                  }`}>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
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
    </div>
  );
}