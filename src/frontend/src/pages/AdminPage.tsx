import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminGuard } from '../components/admin/AdminGuard';
import { ProductsAdminTable } from '../components/admin/ProductsAdminTable';
import { OrdersAdminTable } from '../components/admin/OrdersAdminTable';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';

interface AdminPageProps {
  onNavigate: (view: 'home') => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Manage products and orders</p>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">WhatsApp Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsAdminTable />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersAdminTable />
            </TabsContent>

            <TabsContent value="settings">
              <AdminSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}
