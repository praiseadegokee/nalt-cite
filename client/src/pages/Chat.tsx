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
    queryKey: ['/api/chat/conversations', selectedConversationId, 'messages'],
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
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', selectedConversationId, 'messages'] });
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NALT Citation Assistant</h1>
          <p className="text-gray-600">Ask questions about NALT guidelines and OSCOLA citation standards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Document Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="text-sm"
                  />
                  {uploadFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 truncate">{uploadFile.name}</span>
                      <Button
                        size="sm"
                        onClick={handleUploadDocument}
                        disabled={uploadDocumentMutation.isPending}
                        className="h-6 px-2 text-xs"
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                      <FileText className="h-3 w-3 text-blue-600" />
                      <span className="flex-1 truncate">{doc.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {doc.documentType?.toUpperCase() || 'DOC'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Conversations
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewConversation(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {showNewConversation && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Conversation title"
                      value={newConversationTitle}
                      onChange={(e) => setNewConversationTitle(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={handleCreateConversation}
                        disabled={createConversationMutation.isPending}
                        className="h-6 px-2 text-xs"
                      >
                        Create
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNewConversation(false)}
                        className="h-6 px-2 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <ScrollArea className="h-48">
                  <div className="space-y-1">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs ${
                          selectedConversationId === conv.id
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedConversationId(conv.id)}
                      >
                        <span className="flex-1 truncate">{conv.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversationMutation.mutate(conv.id);
                          }}
                          className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedConversationId
                    ? conversations.find(c => c.id === selectedConversationId)?.title || 'Chat'
                    : 'Select a conversation to start chatting'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {selectedConversationId ? (
                  <>
                    {/* Messages */}
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        {messagesLoading ? (
                          <div className="text-center text-gray-500">Loading messages...</div>
                        ) : messages.length === 0 ? (
                          <div className="text-center text-gray-500 p-6">
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold mb-2">Welcome to NALT Citation Assistant</h3>
                              <p className="mb-4">Ask questions about Nigerian legal citation standards and formatting. Try asking:</p>
                            </div>
                            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded" 
                                   onClick={() => setNewMessage("How do I cite a Nigerian court case using NALT format?")}>
                                • "How do I cite a Nigerian court case using NALT format?"
                              </div>
                              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                   onClick={() => setNewMessage("What is the NALT citation style for statutes?")}>
                                • "What is the NALT citation style for statutes?"
                              </div>
                              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                   onClick={() => setNewMessage("How does NALT differ from OSCOLA citation?")}>
                                • "How does NALT differ from OSCOLA citation?"
                              </div>
                              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                   onClick={() => setNewMessage("What are the footnote requirements in NALT?")}>
                                • "What are the footnote requirements in NALT?"
                              </div>
                            </div>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div className={`flex gap-3 max-w-[80%] ${
                                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                              }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                                }`}>
                                  {message.role === 'user' ? (
                                    <User className="h-4 w-4 text-white" />
                                  ) : (
                                    <Bot className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div className={`p-3 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  {message.sources && JSON.parse(message.sources).length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <p className="text-xs text-gray-600 mb-1">Sources:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {JSON.parse(message.sources).map((source: string, index: number) => (
                                          <Badge key={index} variant="secondary" className="text-xs">
                                            {source}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <Separator className="my-4" />

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask a question about NALT guidelines or OSCOLA citation standards..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 min-h-[60px] resize-none"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a conversation to start chatting</p>
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