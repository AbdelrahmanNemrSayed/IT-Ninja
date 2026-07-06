import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, User, Loader2, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function CommentsSection({ phaseId = 1 }) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchComments();
    
    // Set up Real-time listener for comments
    const channel = supabase
      .channel(`comments-phase-${phaseId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `phase_id=eq.${phaseId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [phaseId]);

  const fetchComments = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          text,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq("phase_id", phaseId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setFetching(false);
    }
  };

  const handlePost = async () => {
    if (!text.trim() || !user || loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("comments").insert({
        phase_id: phaseId,
        user_id: user.id,
        text: text.trim()
      });

      if (error) throw error;
      setText("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="font-extrabold text-xs text-slate-300 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          نقاشات وأسئلة الطلاب (Discussion Board)
        </h4>
        <span className="text-[10px] text-slate-500 font-medium">{comments.length} مشاركة</span>
      </div>

      {/* Input section */}
      {user ? (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            placeholder="اكتب سؤالاً أو تعليقاً حول هذه المرحلة..."
            className="flex-1 bg-slate-950/80 border border-slate-700/40 rounded-xl px-3 py-2.5 text-xs text-slate-200
              placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 text-right transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePost}
            disabled={!text.trim() || loading}
            className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400
              hover:bg-cyan-500/30 disabled:opacity-40 flex items-center justify-center cursor-pointer transition-all flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </motion.button>
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center text-xs text-slate-500">
          🔒 سجل دخولك للمشاركة في نقاشات هذه المرحلة.
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
        {fetching && comments.length === 0 ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-[11px] text-slate-600">
            لا توجد نقاشات بعد في هذه المرحلة. كن أول من يكتب!
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((comment) => {
              const isOwner = user && user.id === comment.user_id;
              const author = comment.profiles || {};
              const date = new Date(comment.created_at).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 text-right"
                >
                  {/* User Avatar */}
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] text-slate-500 font-medium">{date}</span>
                      <span className="text-[11px] font-black text-slate-300">
                        {author.username || "IT Ninja"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed break-words">
                      {comment.text}
                    </p>
                  </div>

                  {/* Actions */}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1 flex-shrink-0 cursor-pointer self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
