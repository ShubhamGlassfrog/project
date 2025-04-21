'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { documentService, ingestionService } from '@/lib/mock-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  PieChart,
  BarChart,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { PieChart as ReChartPie, Pie, Cell, BarChart as ReChartBar, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [ingestions, setIngestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsData, ingData] = await Promise.all([
          documentService.getDocuments(),
          ingestionService.getIngestions()
        ]);
        setDocuments(docsData);
        setIngestions(ingData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Calculate document statistics
  const totalDocuments = documents.length;
  const processedDocs = documents.filter(doc => doc.status === 'processed').length;
  const processingDocs = documents.filter(doc => doc.status === 'processing').length;
  const failedDocs = documents.filter(doc => doc.status === 'failed').length;

  // Data for pie chart
  const pieData = [
    { name: 'Processed', value: processedDocs, color: '#10b981' },
    { name: 'Processing', value: processingDocs, color: '#3b82f6' },
    { name: 'Failed', value: failedDocs, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Create document type distribution data
  const docTypeCount = documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(docTypeCount).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Recent activities from ingestions
  const recentActivities = [...ingestions]
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    .slice(0, 5);

  return (
    <div className="container py-8">
      
      <div className="flex flex-col gap-6">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">
              Here's an overview of your document management system
            </p>
          </div>
          <Link href="/documents">
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {processedDocs} processed, {processingDocs} processing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Processing Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalDocuments > 0 ? Math.round((processedDocs / totalDocuments) * 100) : 0}%
              </div>
              <Progress 
                value={totalDocuments > 0 ? (processedDocs / totalDocuments) * 100 : 0} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Documents
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedDocs}</div>
              <p className="text-xs text-muted-foreground">
                {failedDocs > 0 ? 'Action required' : 'No failed documents'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                1 admin, 4 regular users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activities */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Document Status Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Document Status</CardTitle>
              <CardDescription>Distribution of document processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartPie data={pieData}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </ReChartPie>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No document data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Document Types Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Document Types</CardTitle>
              <CardDescription>Distribution of document formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartBar data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </ReChartBar>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No document data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Activities</CardTitle>
              <CardDescription>Latest document processing activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3">
                      {activity.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      {activity.status === 'in-progress' && (
                        <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      {activity.status === 'failed' && (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{activity.documentTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.status === 'completed' && 'Processing completed'}
                          {activity.status === 'in-progress' && 'Currently processing'}
                          {activity.status === 'failed' && 'Processing failed'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Document Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Upload, organize, and manage all your documents in one place.
              </p>
              <Link href="/documents">
                <Button variant="secondary" className="w-full">
                  Manage Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-5 w-5" />
                <span>Ask Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Get instant answers from your documents using our AI-powered Q&A system.
              </p>
              <Link href="/qa">
                <Button variant="secondary" className="w-full">
                  Go to Q&A
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Ingestion Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Monitor and manage the processing status of your document ingestion.
              </p>
              <Link href="/ingestions">
                <Button variant="secondary" className="w-full">
                  View Ingestions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}