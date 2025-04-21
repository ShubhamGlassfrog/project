import { render, screen } from '@testing-library/react';
import Navigation from '@/components/Navigation';
import { AuthProvider } from '@/lib/auth';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Navigation', () => {
  it('renders logo and navigation items', () => {
    render(
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    );

    expect(screen.getByText('DocuQuery')).toBeInTheDocument();
  });

  it('shows login and signup buttons when not authenticated', () => {
    render(
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    );

    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});