import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import { verifyCropPhoto } from '../services/cropVerification';
import { cropOptions, locations } from '../data/mockData';
import { Upload, CheckCircle2, XCircle, Loader2, ImagePlus } from 'lucide-react';

export default function AddListingPage({ onSuccess }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addListing } = useListings();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: '',
    storageType: '',
    contactNumber: user?.phone || '',
    whatsappNumber: user?.phone || '',
    notes: '',
    location: user?.location || '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'verifying' | 'verified' | 'rejected'
  const [verificationResult, setVerificationResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Trigger verification
    setVerificationStatus('verifying');
    setVerificationResult(null);
    try {
      const result = await verifyCropPhoto(file);
      setVerificationResult(result);
      setVerificationStatus(result.verified ? 'verified' : 'rejected');
    } catch {
      setVerificationStatus('rejected');
      setVerificationResult({ verified: false, message: 'Verification failed' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationStatus !== 'verified') return;

    setSubmitting(true);
    setTimeout(() => {
      addListing({
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseInt(formData.price),
        farmerName: user?.name || 'Unknown Farmer',
        farmerLocation: formData.location,
        photo: photoPreview,
        verified: true,
        report: verificationResult?.report || null
      });
      setSubmitting(false);
      if (onSuccess) onSuccess();
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Photo Upload Section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-800 mb-1">{t('cropPhoto')}</label>
          <p className="text-xs text-gray-500 mb-4">{t('cropPhotoDesc')}</p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer
              transition-all duration-300 hover:border-green-400 hover:bg-green-50/50
              ${photoPreview ? 'border-green-300 bg-green-50/30' : 'border-gray-300 bg-white'}
              ${verificationStatus === 'rejected' ? 'border-red-300 bg-red-50/30' : ''}`}
          >
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Crop preview" className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-full p-3">
                    <ImagePlus size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Upload size={28} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Click to upload crop photo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Verification Status */}
          {verificationStatus && (
            <div className={`mt-4 flex flex-col gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-scale-in
              ${verificationStatus === 'verifying' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
              ${verificationStatus === 'verified' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
              ${verificationStatus === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' : ''}`}
            >
              <div className="flex items-center gap-3 w-full">
                {verificationStatus === 'verifying' && (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {t('verifying')}
                  </>
                )}
                {verificationStatus === 'verified' && (
                  <>
                    <CheckCircle2 size={20} />
                    {t('realCropDetected')}
                    <span className="ml-auto text-xs opacity-70">Confidence: {verificationResult?.confidence}%</span>
                  </>
                )}
                {verificationStatus === 'rejected' && (
                  <>
                    <XCircle size={20} />
                    {t('aiGeneratedDetected')}
                  </>
                )}
              </div>
              
              {verificationStatus === 'verified' && verificationResult?.report && (
                <div className="mt-2 pt-3 border-t border-green-200/50 grid grid-cols-2 gap-2 text-xs">
                  <div className="col-span-2 text-green-800 font-bold mb-1">AI Crop Analysis Report:</div>
                  <div><span className="text-green-600">Condition:</span> {verificationResult.report.condition}</div>
                  <div><span className="text-green-600">Freshness:</span> {verificationResult.report.freshnessIndex}</div>
                  <div><span className="text-green-600">Pests:</span> {verificationResult.report.pestIssues}</div>
                  <div><span className="text-green-600">Color:</span> {verificationResult.report.colorQuality}</div>
                  <div className="col-span-2 text-green-800 mt-1 italic">"{verificationResult.report.overallAssessment}"</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('cropName')}</label>
            <select
              id="input-crop-name"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
            >
              <option value="">{t('selectCrop')}</option>
              {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('variety')}</label>
            <input
              id="input-variety"
              type="text"
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              placeholder="e.g. NS-501, GPU-28"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('quantityAvailable')}</label>
            <div className="flex gap-2">
              <input
                id="input-quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder="500"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                  focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                  focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
              >
                <option value="kg">{t('kg')}</option>
                <option value="quintal">{t('quintal')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('pricePerUnit')}</label>
            <input
              id="input-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="18"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('harvestDate')}</label>
            <input
              id="input-harvest-date"
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('storageType')}</label>
            <select
              id="input-storage-type"
              name="storageType"
              value={formData.storageType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
            >
              <option value="">{t('selectStorage')}</option>
              <option value="Cold Storage">{t('coldStorage')}</option>
              <option value="Warehouse">{t('warehouse')}</option>
              <option value="Open Field">{t('openField')}</option>
              <option value="Home Storage">{t('homeStorage')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('location')}</label>
            <select
              id="input-listing-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
            >
              <option value="">Select location</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contactNumber')}</label>
            <input
              id="input-contact"
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              pattern="\d{10}"
              title="Please enter a valid 10-digit phone number"
              required
              placeholder="9876543210"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('whatsappNumber')}</label>
            <input
              id="input-whatsapp"
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              pattern="\d{10}"
              title="Please enter a valid 10-digit phone number"
              required
              placeholder="9876543210"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('additionalNotes')}</label>
            <textarea
              id="input-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional details about your crop..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 pb-6">
          <button
            id="btn-submit-listing"
            type="submit"
            disabled={verificationStatus !== 'verified' || submitting}
            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer
              ${verificationStatus === 'verified'
                ? 'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:from-green-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                {t('loading')}
              </span>
            ) : (
              t('submitListing')
            )}
          </button>
          {verificationStatus === 'rejected' && (
            <p className="text-center text-red-500 text-sm mt-3">
              {t('aiGeneratedDetected')}
            </p>
          )}
          {!photoFile && (
            <p className="text-center text-gray-400 text-sm mt-3">
              Upload a crop photo first to enable submission
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
