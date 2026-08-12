import HomeLabItemForm from "@/components/admin/homelab-item-form";
import { createHomeLabItem } from "@/lib/admin-content/homelab-mutations";

export default function NewHomeLabItemPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Home Lab Item</h1>
      <HomeLabItemForm action={createHomeLabItem} initial={null} mode="create" />
    </div>
  );
}
