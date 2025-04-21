'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { qaService } from '@/lib/mock-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Send, Search, User, Bot, FileText, Info, Sparkles } from 'lucide-react';

export default function QAPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user query to conversations
    const newQuery = {
      id: Date.now().toString(),
      type: 'query',
      content: query,
      timestamp: new Date().toISOString(),
    };
    
    setConversations(prev => [...prev, newQuery]);
    setQuery('');
    setIsProcessing(true);
    
    try {
      // Add placeholder response
      const placeholderId = Date.now().toString() + '-placeholder';
      setConversations(prev => [
        ...prev,
        {
          id: placeholderId,
          type: 'response',
          content: '',
          sources: [],
          timestamp: new Date().toISOString(),
          loading: true,
        },
      ]);
      
      // Get actual response
      const response = await qaService.askQuestion(newQuery.content);
      
      // Replace placeholder with actual response
      setConversations(prev => 
        prev.map(item => 
          item.id === placeholderId
            ? {
                id: Date.now().toString(),
                type: 'response',
                content: response.answer,
                sources: response.sources,
                timestamp: new Date().toISOString(),
                loading: false,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error getting answer:', error);
      
      // Replace placeholder with error message
      setConversations(prev => 
        prev.map(item => 
          item.id.includes('-placeholder')
            ? {
                id: Date.now().toString(),
                type: 'error',
                content: 'Sorry, there was an error processing your question. Please try again.',
                timestamp: new Date().toISOString(),
                loading: false,
              }
            : item
        )
      );
      
      toast({
        title: 'Error',
        description: 'Failed to get an answer',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      
      // Focus input after response
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearConversation = () => {
    setConversations([]);
  };

  // Sample questions
  const sampleQuestions = [
    "What were our revenue figures for Q2 2023?",
    "Summarize our marketing strategy for this year",
    "What are the key points in the employee handbook?",
    "What are the main specifications of our product?",
    "What does our client contract template include?",
  ];

  const handleSampleQuestion = (question) => {
    setQuery(question);
    
    // Focus and select text in input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Q&A</h1>
          <p className="text-muted-foreground">
            Ask questions about your documents and get instant answers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Sample questions */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Sample Questions
                </h3>
                <div className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-sm p-2 h-auto"
                      onClick={() => handleSampleQuestion(question)}
                    >
                      <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate text-left">{question}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Help card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Ask specific questions for better results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Include relevant keywords from your documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Check the sources to verify the information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Q&A area */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col h-[calc(100vh-13rem)]">
              <CardContent className="flex flex-col p-0 h-full">
                {/* Conversation area */}
                <ScrollArea className="flex-1 p-4">
                  {conversations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Ask any question about your documents</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Get instant answers based on the information contained in your uploaded documents.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
                        {sampleQuestions.slice(0, 4).map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start text-sm"
                            onClick={() => handleSampleQuestion(question)}
                          >
                            <Search className="h-3 w-3 mr-2" />
                            <span className="truncate">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {conversations.map((item) => (
                        <div key={item.id}>
                          {item.type === 'query' && (
                            <div className="flex gap-3 mb-4">
                              <div className="flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{user?.name || 'You'}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="mt-1 text-foreground">
                                  {item.content}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {(item.type === 'response' || item.type === 'error') && (
                            <div className="flex gap-3">
                              <div className="flex h-8 w-8 rounded-full bg-blue-100 items-center justify-center flex-shrink-0">
                                <Bot className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">DocuQuery AI</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  {item.loading ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <div className="flex gap-1">
                                        <span className="animate-bounce">•</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                                      </div>
                                      <span>Generating answer</span>
                                    </div>
                                  ) : item.type === 'error' ? (
                                    <div className="text-destructive">{item.content}</div>
                                  ) : (
                                    <div>
                                      <p className="text-foreground">{item.content}</p>
                                      
                                      {item.sources && item.sources.length > 0 && (
                                        <div className="mt-3">
                                          <Tabs defaultValue="sources">
                                            <TabsList className="grid w-full grid-cols-1 h-auto">
                                              <TabsTrigger value="sources" className="text-xs py-1">
                                                Sources ({item.sources.length})
                                              </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="sources" className="mt-2">
                                              <div className="space-y-2">
                                                {item.sources.map((source, idx) => (
                                                  <div key={idx} className="bg-muted/50 rounded-md p-3 text-sm">
                                                    <div className="flex items-start gap-2">
                                                      <FileText className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                                      <div>
                                                        <div className="font-medium">{source.title}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                          Uploaded on {source.uploadDate}
                                                        </div>
                                                        <div className="mt-1 text-muted-foreground">
                                                          {source.excerpt}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </TabsContent>
                                          </Tabs>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                
                {/* Action bar */}
                {conversations.length > 0 && (
                  <div className="p-2 border-t flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearConversation}
                    >
                      Clear conversation
                    </Button>
                  </div>
                )}
                
                {/* Input area */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Ask a question about your documents..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pr-10"
                        ref={inputRef}
                        disabled={isProcessing}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        disabled={isProcessing || !query.trim()}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ask any question about the content of your uploaded documents.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}