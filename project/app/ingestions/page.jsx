'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ingestionService } from '@/lib/mock-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, CheckCircle, Clock, AlertTriangle, FileText, RotateCw } from 'lucide-react';

export default function IngestionsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [ingestions, setIngestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingRetry, setProcessingRetry] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchIngestions = async () => {
      try {
        const data = await ingestionService.getIngestions();
        setIngestions(data);
      } catch (error) {
        console.error('Error fetching ingestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchIngestions();
    }
  }, [isAuthenticated]);

  // Set up polling for in-progress ingestions
  useEffect(() => {
    let intervalId;
    
    if (ingestions.some(ing => ing.status === 'in-progress')) {
      intervalId = setInterval(async () => {
        try {
          const data = await ingestionService.getIngestions();
          setIngestions(data);
        } catch (error) {
          console.error('Error polling ingestions:', error);
        }
      }, 2000);
    }
    
    return () => clearInterval(intervalId);
  }, [ingestions]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = async (id) => {
    setProcessingRetry(true);
    
    try {
      await ingestionService.retryIngestion(id);
      
      // Update ingestion data
      const data = await ingestionService.getIngestions();
      setIngestions(data);
      
      toast({
        title: 'Success',
        description: 'Ingestion retry initiated successfully',
      });
    } catch (error) {
      console.error('Error retrying ingestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to retry ingestion',
        variant: 'destructive',
      });
    } finally {
      setProcessingRetry(false);
    }
  };

  // Filter ingestions based on search query
  const filteredIngestions = ingestions.filter(ing =>
    ing.documentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgress = (ingestion) => {
    if (ingestion.status === 'completed') {
      return 100;
    } else if (ingestion.status === 'in-progress') {
      return (ingestion.processedPages / ingestion.totalPages) * 100;
    } else if (ingestion.status === 'failed') {
      return (ingestion.processedPages / ingestion.totalPages) * 100;
    }
    return 0;
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingestion Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage document ingestion processes
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by document title..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Ingestions table */}
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">Ingestion Processes</CardTitle>
            <CardDescription>
              {filteredIngestions.length} ingestion{filteredIngestions.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin mb-2" />
                          <p>Loading ingestion data...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredIngestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No ingestion processes found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIngestions.map((ing) => (
                      <TableRow key={ing.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{ing.documentTitle}</span>
                            <span className="text-xs text-muted-foreground">
                              {ing.processedPages} of {ing.totalPages} pages processed
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(ing.startTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(ing.status)}</TableCell>
                        <TableCell>
                          <div className="w-full max-w-xs">
                            <Progress
                              value={getProgress(ing)}
                              className={`h-2 ${ing.status === 'failed' ? 'bg-red-200' : ''}`}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {ing.status === 'in-progress' ? (
                                <span className="flex items-center gap-1">
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                  Processing...
                                </span>
                              ) : ing.status === 'completed' ? (
                                `Completed in ${
                                  ing.endTime
                                    ? Math.round(
                                        (new Date(ing.endTime) - new Date(ing.startTime)) / 1000
                                      )
                                    : 'N/A'
                                } seconds`
                              ) : ing.status === 'failed' ? (
                                <span className="text-red-500">{ing.error || 'Processing failed'}</span>
                              ) : (
                                'Unknown status'
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ing.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetry(ing.id)}
                              disabled={processingRetry}
                              className="flex items-center gap-1"
                            >
                              <RotateCw className="h-3 w-3" />
                              Retry
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}