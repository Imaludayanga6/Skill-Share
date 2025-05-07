import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Upload, Camera, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateUserProfile } from "../api/profileAPI";

const EditProfileModal = ({ user, onClose, onProfileUpdated, token }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("bio", user.bio || "");
      setSkills(user.skills || []);
      setProfileImage(user.profileImage || null);
    }
  }, [user, setValue]);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;

    if (skills.includes(skillInput.trim())) {
      toast.error("This skill is already added");
      return;
    }

    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const profileData = {
        ...data,
        skills,
        profileImage,
      };

      const updatedProfile = await updateUserProfile(
        user.id,
        profileData,
        token
      );

      toast.success("Profile updated successfully");
      onProfileUpdated(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 overflow-hidden border border-orange-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <label className="p-2 bg-orange-600 rounded-full text-white cursor-pointer hover:bg-orange-700 transition-colors">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </label>

                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Recommended: Square image, at least 200x200 pixels
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full p-2 bg-white rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              {...register("bio")}
              rows="3"
              className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none transition-colors"
              placeholder="Tell us a bit about yourself"
              disabled={isSubmitting}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-grow p-2 bg-white rounded-l-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors"
                placeholder="Add a skill (e.g., JavaScript, Design)"
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition-colors disabled:bg-orange-300 cursor-pointer"
                disabled={isSubmitting || !skillInput.trim()}
              >
                Add
              </button>
            </div>

            {/* Skills Tags */}
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-orange-600 hover:text-orange-800"
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-orange-100">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-300 cursor-pointer"
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
