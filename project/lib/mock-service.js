// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    title: 'Annual Report 2023',
    type: 'PDF',
    size: '2.3 MB',
    uploadedBy: 'Admin User',
    uploadDate: '2023-12-10',
    status: 'processed',
    content: 'This annual report outlines the financial performance of the company in 2023...'
  },
  {
    id: '2',
    title: 'Product Specifications',
    type: 'DOCX',
    size: '1.5 MB',
    uploadedBy: 'Regular User',
    uploadDate: '2024-01-15',
    status: 'processing',
    content: 'The product specifications include details about dimensions, materials, and manufacturing processes...'
  },
  {
    id: '3',
    title: 'Employee Handbook',
    type: 'PDF',
    size: '3.7 MB',
    uploadedBy: 'Admin User',
    uploadDate: '2023-11-05',
    status: 'processed',
    content: 'This handbook provides guidelines for all employees regarding company policies, benefits, and procedures...'
  },
  {
    id: '4',
    title: 'Marketing Strategy',
    type: 'PPTX',
    size: '5.2 MB',
    uploadedBy: 'Regular User',
    uploadDate: '2024-02-20',
    status: 'failed',
    content: 'The marketing strategy outlines our approach to digital marketing, social media campaigns, and traditional advertising...'
  },
  {
    id: '5',
    title: 'Client Contract Template',
    type: 'DOCX',
    size: '0.8 MB',
    uploadedBy: 'Admin User',
    uploadDate: '2023-10-30',
    status: 'processed',
    content: 'This contract template establishes the terms and conditions for client engagements...'
  },
];

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-09-01',
    lastLogin: '2024-04-01',
    status: 'active'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    createdAt: '2023-10-15',
    lastLogin: '2024-03-28',
    status: 'active'
  },
  {
    id: '3',
    name: 'Google User',
    email: 'google@example.com',
    role: 'user',
    createdAt: '2024-01-10',
    lastLogin: '2024-03-30',
    status: 'active'
  },
  {
    id: '4',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'editor',
    createdAt: '2023-11-05',
    lastLogin: '2024-02-15',
    status: 'inactive'
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2024-02-20',
    lastLogin: '2024-03-25',
    status: 'active'
  },
];

// Mock ingestion data
const mockIngestions = [
  {
    id: '1',
    documentId: '1',
    documentTitle: 'Annual Report 2023',
    startTime: '2023-12-10T10:30:00',
    endTime: '2023-12-10T10:35:00',
    status: 'completed',
    processedPages: 45,
    totalPages: 45
  },
  {
    id: '2',
    documentId: '2',
    documentTitle: 'Product Specifications',
    startTime: '2024-01-15T14:20:00',
    endTime: null,
    status: 'in-progress',
    processedPages: 12,
    totalPages: 28
  },
  {
    id: '3',
    documentId: '3',
    documentTitle: 'Employee Handbook',
    startTime: '2023-11-05T09:15:00',
    endTime: '2023-11-05T09:22:00',
    status: 'completed',
    processedPages: 60,
    totalPages: 60
  },
  {
    id: '4',
    documentId: '4',
    documentTitle: 'Marketing Strategy',
    startTime: '2024-02-20T16:40:00',
    endTime: '2024-02-20T16:42:00',
    status: 'failed',
    processedPages: 10,
    totalPages: 35,
    error: 'Invalid format in slides 11-15'
  },
  {
    id: '5',
    documentId: '5',
    documentTitle: 'Client Contract Template',
    startTime: '2023-10-30T11:05:00',
    endTime: '2023-10-30T11:07:00',
    status: 'completed',
    processedPages: 12,
    totalPages: 12
  },
];

// Generate an answer based on query and available documents
const generateAnswer = (query) => {
  // Simulate RAG (Retrieval Augmented Generation)
  const lowerQuery = query.toLowerCase();
  
  // Find relevant documents
  const relevantDocs = mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) || 
    doc.content.toLowerCase().includes(lowerQuery)
  );
  
  if (relevantDocs.length === 0) {
    return {
      answer: "I couldn't find any relevant information in the documents. Please try another question or upload more documents.",
      sources: []
    };
  }
  
  // Generate a mock answer based on the most relevant document
  const primaryDoc = relevantDocs[0];
  let answer = '';
  
  if (lowerQuery.includes('what') || lowerQuery.includes('how')) {
    answer = `Based on the ${primaryDoc.title}, ${primaryDoc.content.substring(0, 100)}...`;
  } else if (lowerQuery.includes('when') || lowerQuery.includes('date')) {
    answer = `According to ${primaryDoc.title} from ${primaryDoc.uploadDate}, this information was documented on that date.`;
  } else if (lowerQuery.includes('who') || lowerQuery.includes('person')) {
    answer = `The ${primaryDoc.title} uploaded by ${primaryDoc.uploadedBy} indicates responsibility in this area.`;
  } else {
    answer = `In the ${primaryDoc.title}, I found that ${primaryDoc.content.substring(0, 120)}...`;
  }
  
  return {
    answer,
    sources: relevantDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      excerpt: doc.content.substring(0, 150) + '...',
      uploadDate: doc.uploadDate
    }))
  };
};

// Mock service exports
export const documentService = {
  getDocuments: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockDocuments), 500);
    });
  },
  
  getDocumentById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const document = mockDocuments.find(doc => doc.id === id);
        if (document) {
          resolve(document);
        } else {
          reject(new Error('Document not found'));
        }
      }, 300);
    });
  },
  
  uploadDocument: async (documentData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newDocument = {
          id: String(mockDocuments.length + 1),
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'processing',
          ...documentData,
        };
        mockDocuments.push(newDocument);
        
        // Create ingestion entry
        const newIngestion = {
          id: String(mockIngestions.length + 1),
          documentId: newDocument.id,
          documentTitle: newDocument.title,
          startTime: new Date().toISOString(),
          endTime: null,
          status: 'in-progress',
          processedPages: 0,
          totalPages: Math.floor(Math.random() * 50) + 5
        };
        mockIngestions.push(newIngestion);
        
        resolve(newDocument);
      }, 1000);
    });
  },
  
  deleteDocument: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockDocuments.findIndex(doc => doc.id === id);
        if (index !== -1) {
          mockDocuments.splice(index, 1);
        }
        resolve({ success: true });
      }, 300);
    });
  }
};

export const userService = {
  getUsers: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },
  
  getUserById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(user => user.id === id);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  },
  
  createUser: async (userData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser = {
          id: String(mockUsers.length + 1),
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: null,
          status: 'active',
          ...userData,
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 700);
    });
  },
  
  updateUser: async (id, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(user => user.id === id);
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...userData };
          resolve(mockUsers[index]);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  },
  
  deleteUser: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockUsers.findIndex(user => user.id === id);
        if (index !== -1) {
          mockUsers.splice(index, 1);
        }
        resolve({ success: true });
      }, 300);
    });
  }
};

export const ingestionService = {
  getIngestions: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockIngestions), 500);
    });
  },
  
  getIngestionById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ingestion = mockIngestions.find(ing => ing.id === id);
        if (ingestion) {
          resolve(ingestion);
        } else {
          reject(new Error('Ingestion not found'));
        }
      }, 300);
    });
  },
  
  retryIngestion: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockIngestions.findIndex(ing => ing.id === id);
        if (index !== -1 && mockIngestions[index].status === 'failed') {
          mockIngestions[index].status = 'in-progress';
          mockIngestions[index].startTime = new Date().toISOString();
          mockIngestions[index].endTime = null;
          mockIngestions[index].processedPages = 0;
          
          // Simulate processing after a delay
          setTimeout(() => {
            mockIngestions[index].status = 'completed';
            mockIngestions[index].endTime = new Date().toISOString();
            mockIngestions[index].processedPages = mockIngestions[index].totalPages;
            
            // Update the document status
            const docIndex = mockDocuments.findIndex(doc => doc.id === mockIngestions[index].documentId);
            if (docIndex !== -1) {
              mockDocuments[docIndex].status = 'processed';
            }
          }, 5000);
          
          resolve(mockIngestions[index]);
        } else {
          reject(new Error('Ingestion not found or not in failed state'));
        }
      }, 300);
    });
  }
};

export const qaService = {
  askQuestion: async (query) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateAnswer(query));
      }, 1000);
    });
  }
};