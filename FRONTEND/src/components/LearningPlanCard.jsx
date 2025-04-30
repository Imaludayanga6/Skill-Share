import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash, Book, Link } from "lucide-react";
import Comment, { CommentForm } from "./CommentComponent";
import useConfirmModal from "../hooks/useConfirmModal";
import ConfirmModal from "./ConfirmModal";
import UserAvatar from "./UserAvatar";

const LearningPlanCard = ({
  plan,
  currentUser,
  onLike,
  onComment,
  onDeleteComment,
  onUpdateComment,
  onEdit,
  onDelete,
  token,
}) => {
  const [showComments, setShowComments] = useState(false);
  const { modalState, openModal, closeModal } = useConfirmModal();

  const isLikedByUser = plan.likes?.some(
    (like) => like.userId === currentUser?.id
  );
  const isOwner = plan.userId === currentUser?.id;

  const handleDeleteClick = () => {
    openModal({
      title: "Delete Learning Plan",
      message:
        "Are you sure you want to delete this learning plan? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => onDelete(plan.id),
    });
  };

  const handleAddComment = async (planId, commentData) => {
    try {
      await onComment(planId, commentData);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const topicTags =
    plan.topics
      ?.split(",")
      .map((topic) => topic.trim())
      .filter(Boolean) || [];

  const resourceList =
    plan.resources
      ?.split(",")
      .map((resource) => resource.trim())
      .filter(Boolean) || [];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-teal-100 mb-6 overflow-hidden">
      {/* Plan Header */}
      <div className="p-4 flex items-center justify-between border-b border-teal-100">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white overflow-hidden">
            <UserAvatar
              src={plan.userProfileImage}
              alt={plan.userName}
              name={plan.userName}
              size="h-10 w-10"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{plan.userName}</h3>
            <p className="text-xs text-gray-500">
              {new Date(plan.createdAt).toLocaleString()}
              {plan.updatedAt &&
                plan.updatedAt !== plan.createdAt &&
                " (updated)"}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex space-x-1">
            <motion.button
              onClick={() => onEdit(plan)}
              className="p-1 rounded-full hover:bg-teal-50 text-teal-600 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              onClick={handleDeleteClick}
              className="p-1 rounded-full hover:bg-red-50 text-red-500 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash size={16} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Plan Content */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{plan.title}</h3>

        {plan.description && (
          <p className="text-gray-700 mb-3">{plan.description}</p>
        )}

        {/* Topics Section */}
        {topicTags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Book size={16} className="text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Topics:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {topicTags.map((topic, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resources Section */}
        {resourceList.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Link size={16} className="text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                Resources:
              </span>
            </div>
            <div className="bg-white rounded-lg p-3 space-y-1">
              {resourceList.map((resource, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {resource.startsWith("http") ? (
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline truncate inline-block max-w-full"
                    >
                      {resource}
                    </a>
                  ) : (
                    <span>{resource}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pb-2 border-b border-teal-100">
          <button
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLikedByUser
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-teal-50"
            }`}
            onClick={() => onLike(plan.id)}
          >
            <span className="text-lg">{isLikedByUser ? "❤️" : "🤍"}</span>
            <span>{plan.likes?.length || 0}</span>
          </button>

          <button
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-teal-50 transition-colors cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="text-lg">💬</span>
            <span>{plan.comments?.length || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50">
          <CommentForm
            postId={plan.id}
            onAddComment={handleAddComment}
            currentUser={currentUser}
          />

          <div className="space-y-3 max-h-64 overflow-y-auto mt-4">
            {plan.comments && plan.comments.length > 0 ? (
              plan.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={plan.id}
                  currentUser={currentUser}
                  postUserId={plan.userId}
                  onCommentUpdated={onUpdateComment}
                  onCommentDeleted={onDeleteComment}
                  token={token}
                  commentType="LEARNING_PLANS"
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-3">No comments yet</p>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        confirmButtonClass={modalState.confirmButtonClass}
        type={modalState.type}
      />
    </div>
  );
};

export default LearningPlanCard;
