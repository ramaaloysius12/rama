"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteArticleAction } from "@/actions/article.actions";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen? Tindakan ini tidak bisa dibatalkan.")) {
      startTransition(async () => {
        await deleteArticleAction(id);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" /> 
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
