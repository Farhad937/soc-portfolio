import { notFound } from "next/navigation";
import { getHomeLabItemByIdAdmin } from "@/lib/admin-content";
import { updateHomeLabItem } from "@/lib/admin-content/homelab-mutations";
import HomeLabItemForm from "@/components/admin/homelab-item-form";

export default async function EditHomeLabItemPage({ params }: { params: { id: string } }) {
  const item = await getHomeLabItemByIdAdmin(params.id);
  if (!item) notFound();

  const boundUpdate = updateHomeLabItem.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Edit Home Lab Item</h1>
      <HomeLabItemForm action={boundUpdate} initial={item} mode="edit" />
    </div>
  );
}
