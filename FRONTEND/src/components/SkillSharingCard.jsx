import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Comment, { CommentForm } from "./CommentComponent";
import useConfirmModal from "../hooks/useConfirmModal";
import EditPostModal from "./EditSkillPostModal";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";

const SkillSharingCard = ({
  post,
  currentUser,
  onLike,
  onDelete,
  onComment,
  onCommentUpdated,
  onCommentDeleted,
  token,
}) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { modalState, openModal, closeModal } = useConfirmModal();

  const isLikedByUser = post?.likes?.some(
    (like) => like.userId === currentUser?.id
  );
  const isOwner = post?.userId === currentUser?.id;

  const handleUserClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const handleAddComment = async (postId, commentData) => {
    try {
      return await onComment(postId, commentData);
    } catch (error) {
      console.error("Error adding comment:", error);
      return false;
    }
  };

  const handleCommentUpdated = (postId, commentId, newContent) => {
    onCommentUpdated(postId, commentId, newContent);
  };

  const handleCommentDeleted = (postId, commentId) => {
    onCommentDeleted(postId, commentId);
  };

  const handlePostUpdated = () => {
    setShowEditModal(false);
    onDelete(post.id, true);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md border border-teal-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-teal-100">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleUserClick}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white overflow-hidden">
            <UserAvatar
              src={post.userProfileImage}
              alt={post.userName}
              name={post.userName}
              size="h-10 w-10"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{post.userName}</h3>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex space-x-2">
            <motion.button
              onClick={() => setShowEditModal(true)}
              className="text-teal-600 hover:text-teal-700 p-1 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit size={18} />
            </motion.button>
            <motion.button
              onClick={() => {
                openModal({
                  title: "Delete Post",
                  message:
                    "Are you sure you want to delete this post? This action cannot be undone.",
                  confirmText: "Delete",
                  cancelText: "Cancel",
                  type: "danger",
                  onConfirm: () => {
                    onDelete(post.id);
                    toast.success("Post deleted successfully");
                  },
                });
              }}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash size={18} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-4">{post.description}</p>

        {/* Media Content */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div
            className={`grid gap-2 mb-4 ${
              post.mediaUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {post.mediaUrls.map((urlString, index) => {
              let mediaObject;
              let isVideo = false;
              let url = urlString;

              try {
                mediaObject = JSON.parse(urlString);
                url = mediaObject.dataUrl;
                isVideo = mediaObject.type === "video";
              } catch (error) {
                isVideo =
                  urlString.includes("video") ||
                  urlString.includes("data:video/");
              }

              return (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden bg-black bg-opacity-10"
                >
                  {isVideo ? (
                    <video
                      controls
                      src={url}
                      className="w-full h-full object-contain max-h-80"
                    />
                  ) : (
                    <img
                      src={url}
                      alt="Post content"
                      className="w-full h-full object-contain max-h-80"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-2 pb-2 border-b border-teal-100">
          <motion.button
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLikedByUser
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-teal-50"
            }`}
            onClick={() => onLike(post.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={18} className={isLikedByUser ? "fill-red-500" : ""} />
            <span>{post.likes?.length || 0}</span>
          </motion.button>

          <motion.button
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-teal-50 transition-colors cursor-pointer"
            onClick={() => setShowComments(!showComments)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={18} />
            <span>{post.comments?.length || 0}</span>
          </motion.button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              className="p-4 bg-gray-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentUser && (
                <CommentForm
                  postId={post.id}
                  onAddComment={handleAddComment}
                  currentUser={currentUser}
                />
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto mt-4">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      currentUser={currentUser}
                      postUserId={post.userId}
                      onCommentUpdated={handleCommentUpdated}
                      onCommentDeleted={handleCommentDeleted}
                      token={token}
                      commentType="SKILL_SHARING"
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-3">
                    No comments yet
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={handlePostUpdated}
          token={token}
        />
      )}
    </motion.div>
  );
};

export default SkillSharingCard;
