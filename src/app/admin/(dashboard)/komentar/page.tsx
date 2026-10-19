import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateCommentStatus(formData: FormData) {
  "use server";
  const commentId = formData.get("commentId") as string;
  const status = formData.get("status") as "APPROVED" | "REJECTED";

  try {
    await prisma.comment.update({
      where: { id: commentId },
      data: { status },
    });
    revalidatePath("/admin/komentar");
  } catch (err) {
    console.error(err);
  }
}

export default async function AdminKomentarPage() {
  const comments = await prisma.comment.findMany({
    include: { article: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Moderasi Komentar Pembaca</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {comments.length === 0 ? (
          <p className="p-12 text-center text-sm text-gray-500">Belum ada komentar yang masuk.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="py-3 px-6">Pengirim</th>
                <th className="py-3 px-4">Komentar</th>
                <th className="py-3 px-4">Artikel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comments.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{comm.authorName}</td>
                  <td className="py-4 px-4 text-gray-700 max-w-xs">{comm.content}</td>
                  <td className="py-4 px-4 text-xs text-islamic-700 font-medium truncate max-w-[150px]">
                    {comm.article?.title}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        comm.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : comm.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {comm.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {comm.status !== "APPROVED" && (
                      <form action={updateCommentStatus} className="inline">
                        <input type="hidden" name="commentId" value={comm.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold">
                          Setujui
                        </button>
                      </form>
                    )}
                    {comm.status !== "REJECTED" && (
                      <form action={updateCommentStatus} className="inline">
                        <input type="hidden" name="commentId" value={comm.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold">
                          Tolak
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
