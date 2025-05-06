import React, { useState, useEffect } from "react";
import { Users, Compass, Bookmark, User, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { useAuth } from "../context/auth/useAuth";

const suggestedUsers = [
  {
    id: 1,
    name: "Emma Wilson",
    bio: "UI/UX Designer",
    skills: ["Design", "Figma"],
  },
  {
    id: 2,
    name: "Michael Chen",
    bio: "Full Stack Developer",
    skills: ["React", "Node.js"],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    bio: "Data Scientist",
    skills: ["Python", "ML"],
  },
];

const trendingTopics = [
  { id: 1, name: "React Hooks", count: 342 },
  { id: 2, name: "CSS Grid", count: 275 },
  { id: 3, name: "UX Design", count: 189 },
  { id: 4, name: "Python", count: 156 },
];

const MainLayout = ({ children, activeTab }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
  <Header activeTab={activeTab} />

  <div className="pt-20 pb-10 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar */}
      <motion.div
        className="hidden lg:block lg:col-span-3 space-y-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Panel */}
        <div className="bg-white rounded-2xl shadow-md border border-orange-200 overflow-hidden">
          <div className="p-4 border-b border-orange-200">
            <h3 className="font-semibold text-gray-800">Navigation</h3>
          </div>
          <div className="p-2">
            <div className="space-y-1">
              {[
                { icon: <User size={18} />, label: "My Profile" },
                { icon: <Bookmark size={18} />, label: "Saved Items" },
                { icon: <Compass size={18} />, label: "Explore" },
                { icon: <Users size={18} />, label: "My Network" },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-orange-50 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isLoaded ? 1 : 0,
                    x: isLoaded ? 0 : -20,
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-orange-500">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="col-span-1 lg:col-span-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Right Sidebar */}
      <motion.div
            className="hidden lg:block lg:col-span-3 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            

            {/* Learning Stats */}
            <div className="bg-white rounded-2xl shadow-md border border-orange-200 overflow-hidden">
              <div className="p-4 border-b border-orange-200">
                <h3 className="font-semibold text-gray-800">
                  Your Learning Stats
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Weekly Progress
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        75%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-orange-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, delay: 1 }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Completed Courses
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        12
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-orange-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 1, delay: 1.3 }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Active Streaks
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        5 days
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-orange-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "50%" }}
                        transition={{ duration: 1, delay: 1.5 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  className="w-full mt-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                >
                  View Detailed Stats
                </motion.button>
              </div>
            </div>
          </motion.div>
    </div>
  </div>
</div>
  );
};

export default MainLayout;
