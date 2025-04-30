import React, { useState } from "react";
import Comment, { CommentForm } from "./CommentComponent";
import UserAvatar from "./UserAvatar";

const PostCard = ({
  post,
  currentUser,
  onLike,
  onComment,
  onDeleteComment,
  onUpdateComment,
}) => {
  const [showComments, setShowComments] = useState(false);

  const isLikedByUser = post.likes?.some(
    (like) => like.userId === currentUser?.id
  );

  const handleAddComment = async (postId, commentData) => {
    try {
      await onComment(postId, commentData);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-teal-100 mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center space-x-3 border-b border-teal-100">
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
            {post.mediaUrls.map((url, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden bg-black bg-opacity-10"
              >
                {url.includes("video") ? (
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
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-2 pb-2 border-b border-teal-100">
          <button
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLikedByUser
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-teal-50"
            }`}
            onClick={() => onLike(post.id)}
          >
            <span className="text-lg">{isLikedByUser ? "❤️" : "🤍"}</span>
            <span>{post.likes?.length || 0}</span>
          </button>

          <button
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-teal-50 transition-colors cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="text-lg">💬</span>
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50">
          <CommentForm
            postId={post.id}
            onAddComment={handleAddComment}
            currentUser={currentUser}
          />

          <div className="space-y-3 max-h-64 overflow-y-auto mt-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  currentUser={currentUser}
                  postUserId={post.userId}
                  onCommentUpdated={onUpdateComment}
                  onCommentDeleted={onDeleteComment}
                  token={post.token}
                  commentType="SKILL_SHARING"
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-3">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
