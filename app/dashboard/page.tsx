'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertCircle, 
  Scan, 
  Calendar, 
  Users, 
  Plus,
  ChefHat,
  Search,
  Bell,
  Settings,
  Heart,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data for beautiful display
  const familyMembers = [
    { id: 1, name: 'Sarah', avatar: '👩', allergies: ['Peanuts', 'Dairy'], severity: 'severe' },
    { id: 2, name: 'Michael', avatar: '👨', allergies: ['Gluten'], severity: 'moderate' },
    { id: 3, name: 'Emma', avatar: '👧', allergies: ['Shellfish'], severity: 'mild' },
  ];

  const quickActions = [
    { icon: Scan, label: 'Scan Ingredients', color: 'from-blue-500 to-cyan-400', action: 'scan' },
    { icon: ChefHat, label: 'Meal Planner', color: 'from-purple-500 to-pink-400', action: 'meal' },
    { icon: Search, label: 'Check Product', color: 'from-amber-500 to-orange-400', action: 'check' },
    { icon: Calendar, label: 'Week Plan', color: 'from-emerald-500 to-green-400', action: 'calendar' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Beautiful Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AllergyGuard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Good morning, Family! 👋
            </h2>
            <p className="text-white/90 text-lg">
              Everyone's allergy profile is up to date. Stay safe today!
            </p>
          </div>
          <Sparkles className="absolute right-8 top-8 w-24 h-24 text-white/20" />
        </motion.div>

        {/* Family Members Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Family Members</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Member</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {familyMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{member.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        member.severity === 'severe' ? 'bg-red-100 text-red-700' :
                        member.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {member.severity} allergies
                      </span>
                    </div>
                  </div>
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                
                <div className="space-y-2">
                  {member.allergies.map((allergy) => (
                    <div
                      key={allergy}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>{allergy}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color}`} />
                <div className="relative z-10 flex flex-col items-center space-y-3">
                  <action.icon className="w-8 h-8" />
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Today's Safe Meals */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Today's Safe Meals</h3>
            <span className="text-sm text-green-600 font-medium">All allergen-free! ✅</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Breakfast', 'Lunch', 'Dinner'].map((meal, index) => (
              <motion.div
                key={meal}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <h4 className="font-medium text-gray-700 mb-2">{meal}</h4>
                <p className="text-sm text-gray-600 mb-3">Quinoa Buddha Bowl</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Safe for everyone</span>
                  <ChefHat className="w-4 h-4 text-green-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white"
      >
        <Scan className="w-6 h-6" />
      </motion.button>
    </div>
  );
}