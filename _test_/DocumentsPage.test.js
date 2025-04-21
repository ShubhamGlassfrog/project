import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentsPage from '@/app/documents/page';
import { AuthProvider } from '@/lib/auth';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('DocumentsPage', () => {
  it('renders documents table', async () => {
    render(
      <AuthProvider>
        <DocumentsPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Upload Document')).toBeInTheDocument();
    });
  });

  it('opens upload dialog', async () => {
    render(
      <AuthProvider>
        <DocumentsPage />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Upload Document'));

    await waitFor(() => {
      expect(screen.getByText('Document Title')).toBeInTheDocument();
    });
  });
});