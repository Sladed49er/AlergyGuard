'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  AlertTriangle,
  AlertCircle, 
  CheckCircle, 
  X,
  Loader,
  ArrowLeft,
  Sparkles,
  Shield,
  ShieldCheck,
  Info
} from 'lucide-react';
import Link from 'next/link';

// Define types for the scan result
interface Warning {
  allergen: string;
  severity: string;
  ingredient: string;
  reason: string;
}

interface ScanResult {
  safetyRating: 'safe' | 'caution' | 'danger' | 'unknown';
  warnings: Warning[];
  crossContaminationRisk: 'low' | 'medium' | 'high' | 'unknown';
  summary: string;
}

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [ingredientText, setIngredientText] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock family allergies (in production, fetch from database)
  const familyAllergies = [
    { type: 'peanut', severity: 'severe' },
    { type: 'dairy', severity: 'moderate' },
    { type: 'gluten', severity: 'moderate' },
    { type: 'shellfish', severity: 'mild' }
  ];

  const analyzeIngredients = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredientText,
          allergies: familyAllergies
        })
      });

      const result = await response.json();
      setScanResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      // For demo, use mock data if API fails
      setScanResult({
        safetyRating: 'danger',
        warnings: [
          {
            allergen: 'peanut',
            severity: 'severe',
            ingredient: 'peanut oil',
            reason: 'Contains peanut derivatives'
          }
        ],
        crossContaminationRisk: 'high',
        summary: 'This product contains ingredients that are unsafe for your family.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSafetyColor = (rating: string) => {
    switch(rating) {
      case 'safe': return 'from-green-500 to-emerald-500';
      case 'caution': return 'from-amber-500 to-orange-500';
      case 'danger': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSafetyIcon = (rating: string) => {
    switch(rating) {
      case 'safe': return <ShieldCheck className="w-8 h-8" />;
      case 'caution': return <Shield className="w-8 h-8" />;
      case 'danger': return <X className="w-8 h-8" />;
      default: return <Info className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Ingredient Scanner</h1>
            </div>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scanner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Input Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Ingredients for Allergens
              </h2>
              <p className="text-gray-600">
                Paste ingredient list or take a photo to check for family allergens
              </p>
            </div>

            {/* Camera/Upload Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl"
                onClick={() => setIsScanning(true)}
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
              </motion.button>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or paste ingredients here:
              </label>
              <textarea
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                placeholder="Water, Wheat Flour, Sugar, Peanut Oil, Salt..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeIngredients}
              disabled={!ingredientText || isAnalyzing}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 ${
                !ingredientText || isAnalyzing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Check for Allergens</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`bg-gradient-to-r ${getSafetyColor(scanResult.safetyRating)} p-8`}
              >
                <div className="bg-white/95 backdrop-blur rounded-2xl p-6">
                  {/* Safety Rating */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {getSafetyIcon(scanResult.safetyRating)}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {scanResult.safetyRating} {scanResult.safetyRating === 'safe' ? '✅' : '⚠️'}
                        </h3>
                        <p className="text-sm text-gray-600">{scanResult.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {scanResult.warnings && scanResult.warnings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Allergen Warnings:</h4>
                      {scanResult.warnings.map((warning, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
                        >
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {warning.allergen} detected ({warning.severity})
                            </p>
                            <p className="text-sm text-gray-600">
                              Found in: {warning.ingredient}
                            </p>
                            <p className="text-sm text-gray-500">
                              {warning.reason}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Cross-contamination Risk */}
                  {scanResult.crossContaminationRisk && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Cross-contamination risk:</span>{' '}
                        <span className="capitalize">{scanResult.crossContaminationRisk}</span>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Family Allergies Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Checking for these family allergies:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {familyAllergies.map((allergy) => (
              <div
                key={allergy.type}
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  allergy.severity === 'severe' ? 'bg-red-50' :
                  allergy.severity === 'moderate' ? 'bg-amber-50' :
                  'bg-yellow-50'
                }`}
              >
                <AlertCircle className={`w-4 h-4 ${
                  allergy.severity === 'severe' ? 'text-red-500' :
                  allergy.severity === 'moderate' ? 'text-amber-500' :
                  'text-yellow-500'
                }`} />
                <span className="text-sm font-medium capitalize">{allergy.type}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}