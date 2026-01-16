// Type declarations for direct lucide-react icon imports
// This allows importing icons directly from their individual files for better tree-shaking
// while maintaining TypeScript type safety

declare module 'lucide-react/dist/esm/icons/*' {
  import { LucideIcon } from 'lucide-react';
  const icon: LucideIcon;
  export default icon;
}
