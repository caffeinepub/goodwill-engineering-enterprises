import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { WhatsAppOrder } from "../../backend";
import { OrderStatus } from "../../backend";
import {
  useGetAllProducts,
  useUpdateOrderStatus,
} from "../../hooks/useQueries";

interface OrderDetailDrawerProps {
  order: WhatsAppOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDrawer({
  order,
  open,
  onOpenChange,
}: OrderDetailDrawerProps) {
  const updateStatus = useUpdateOrderStatus();
  const { data: products = [] } = useGetAllProducts();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );

  const productMap = new Map(products.map((p) => [p.id, p]));

  const handleStatusUpdate = async () => {
    try {
      await updateStatus.mutateAsync({
        orderId: order.id,
        status: selectedStatus,
      });
      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.new_:
        return "New";
      case OrderStatus.contacted:
        return "Contacted";
      case OrderStatus.confirmed:
        return "Confirmed";
      case OrderStatus.rejected:
        return "Rejected";
      default:
        return "New";
    }
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(
      order,
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Order ID", order.id.toString()],
      ["WhatsApp Number", order.whatsappNumber],
      ["Status", getStatusLabel(order.status)],
      ["Date", new Date(Number(order.timestamp) / 1000000).toLocaleString()],
      [""],
      ["Product", "Quantity", "Notes"],
      ...order.cartItems.map((item) => {
        const product = productMap.get(item.productId);
        return [
          product?.name || `Product ${item.productId}`,
          item.quantity.toString(),
          item.customNotes || "",
        ];
      }),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${order.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order #{order.id.toString()}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div>
            <Label>Order Date</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(Number(order.timestamp) / 1000000).toLocaleString()}
            </p>
          </div>

          <div>
            <Label>WhatsApp Number</Label>
            <p className="text-sm text-muted-foreground">
              {order.whatsappNumber}
            </p>
          </div>

          <Separator />

          <div>
            <Label className="mb-2 block">Order Items</Label>
            <div className="space-y-3">
              {order.cartItems.map((item, index) => {
                const product = productMap.get(item.productId);
                return (
                  <div
                    key={`order-item-${item.productId.toString()}-${index}`}
                    className="p-3 bg-muted rounded-lg space-y-1"
                  >
                    <p className="font-medium">
                      {product?.name || `Product ${item.productId}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity.toString()}
                    </p>
                    {item.customNotes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {item.customNotes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Update Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderStatus.new_}>New</SelectItem>
                <SelectItem value={OrderStatus.contacted}>Contacted</SelectItem>
                <SelectItem value={OrderStatus.confirmed}>Confirmed</SelectItem>
                <SelectItem value={OrderStatus.rejected}>Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleStatusUpdate}
              disabled={updateStatus.isPending}
              className="w-full"
            >
              {updateStatus.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Status
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Export Order</Label>
            <div className="flex gap-2">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
