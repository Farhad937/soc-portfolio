import NotYetBacked from "@/components/admin/not-yet-backed";

export default function AdminBlogPage() {
  return (
    <NotYetBacked
      title="Blog"
      reason="The original site plan's Blog section and the Write-ups section may end up being the same content type. Building a second, separate blog_posts table that duplicates Write-ups without checking first seemed like the wrong call — flagging this rather than guessing which you meant."
      phase="Phase 6, pending a decision on Blog vs Write-ups"
    />
  );
}
