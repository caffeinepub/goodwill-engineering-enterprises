import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { useState } from "react";
import type { WhatsAppOrder } from "../../backend";
import { OrderStatus } from "../../backend";
import { useGetAllOrders } from "../../hooks/useQueries";
import { OrderDetailDrawer } from "./OrderDetailDrawer";

export function OrdersAdminTable() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const [selectedOrder, setSelectedOrder] = useState<WhatsAppOrder | null>(
    null,
  );

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.new_]: { label: "New", variant: "default" as const },
      [OrderStatus.contacted]: {
        label: "Contacted",
        variant: "secondary" as const,
      },
      [OrderStatus.confirmed]: {
        label: "Confirmed",
        variant: "default" as const,
      },
      [OrderStatus.rejected]: {
        label: "Rejected",
        variant: "destructive" as const,
      },
    };

    const info = statusMap[status] || statusMap[OrderStatus.new_];
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["s1", "s2", "s3", "s4", "s5"].map((k) => (
              <Skeleton key={k} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>WhatsApp Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id.toString()}>
                    <TableCell className="font-mono">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell>{formatDate(order.timestamp)}</TableCell>
                    <TableCell>{order.cartItems.length} items</TableCell>
                    <TableCell>{order.whatsappNumber}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </>
  );
}
