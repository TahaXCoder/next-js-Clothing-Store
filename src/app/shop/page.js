import { Suspense } from 'react';
import ShopPage from '@/views/ShopPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1rem' }}>Loading shop...</div>}>
      <ShopPage />
    </Suspense>
  );
}
