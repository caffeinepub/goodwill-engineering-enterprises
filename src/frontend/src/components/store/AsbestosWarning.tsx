import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AsbestosWarningProps {
  variant?: 'warning' | 'info';
}

export function AsbestosWarning({ variant = 'warning' }: AsbestosWarningProps) {
  if (variant === 'info') {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Asbestos Products in Cart</AlertTitle>
        <AlertDescription>
          Your cart contains asbestos products. Please ensure you understand the safety requirements and handling procedures before proceeding.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Asbestos Product Safety Warning</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          This product contains asbestos. Asbestos fibers can cause serious health issues including lung disease and cancer when inhaled.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Handle only in well-ventilated areas</li>
          <li>Use appropriate personal protective equipment (PPE)</li>
          <li>Follow all local safety regulations and guidelines</li>
          <li>Dispose of according to hazardous waste procedures</li>
        </ul>
        <p className="font-semibold">
          By purchasing this product, you acknowledge these risks and agree to handle it safely and in compliance with all applicable regulations.
        </p>
      </AlertDescription>
    </Alert>
  );
}
