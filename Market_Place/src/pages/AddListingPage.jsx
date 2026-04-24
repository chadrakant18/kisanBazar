import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import { verifyCropPhoto } from '../services/cropVerification';
import { cropOptions, locations } from '../data/mockData';
import { Upload, CheckCircle2, XCircle, Loader2, ImagePlus, Mic, MicOff } from 'lucide-react';

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
  const [isListening, setIsListening] = useState(false);

  const startVoiceTyping = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice typing is not supported in this browser. Please type manually.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, cropName: transcript }));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

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
              <div className="relative group">
                <img src={photoPreview} alt="Crop preview" className="w-full h-64 object-cover" />
                
                {/* AI Scanning Overlay */}
                {verificationStatus === 'verifying' && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                    <div className="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-scan"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                         <Loader2 size={24} className="text-white animate-spin" />
                         <span className="text-white font-black text-sm uppercase tracking-widest">AI ANALYZING PIXELS...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-full p-3 shadow-xl">
                    <ImagePlus size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mb-4 rotate-3 group-hover:rotate-0 transition-transform">
                  <Upload size={32} className="text-green-600" />
                </div>
                <p className="text-lg font-black text-gray-800">Upload Crop Harvest</p>
                <p className="text-sm font-medium text-gray-400 mt-1">Our AI will verify authenticity & quality</p>
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
            <div className={`mt-6 flex flex-col gap-4 px-6 py-5 rounded-[24px] text-sm font-medium animate-scale-in
              ${verificationStatus === 'verifying' ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-blue-100/50 shadow-lg' : ''}
              ${verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-emerald-100/50 shadow-lg' : ''}
              ${verificationStatus === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200/50 shadow-red-100/50 shadow-lg' : ''}`}
            >
              <div className="flex items-center gap-4 w-full">
                {verificationStatus === 'verifying' && (
                  <>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Loader2 size={18} className="animate-spin" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black uppercase tracking-widest text-[10px]">Processing Vision Pipeline</p>
                      <p className="text-xs opacity-70 italic">Extracting freshness metrics & verifying geolocation metadata...</p>
                    </div>
                  </>
                )}
                {verificationStatus === 'verified' && (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={24} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black uppercase tracking-widest text-[10px]">Verification Successful</p>
                      <p className="text-xs opacity-70 italic">High-quality {formData.cropName || 'produce'} detected. Metadata matches.</p>
                    </div>
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">CONFIDENCE: {verificationResult?.confidence}%</span>
                  </>
                )}
                {verificationStatus === 'rejected' && (
                  <>
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black uppercase tracking-widest text-[10px]">Verification Failed</p>
                      <p className="text-xs opacity-70 italic">{verificationResult?.message || t('aiGeneratedDetected')}</p>
                    </div>
                  </>
                )}
              </div>
              
              {verificationStatus === 'verified' && verificationResult?.report && (
                <div className="mt-2 pt-5 border-t border-emerald-200/30 grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                    <span className="text-emerald-900 font-black uppercase tracking-widest text-[10px]">AI Crop Analysis Report</span>
                  </div>
                  <div className="bg-white/50 p-3 rounded-2xl border border-emerald-100/50 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-tighter">Condition</span>
                    <span className="font-bold text-emerald-900">{verificationResult.report.condition}</span>
                  </div>
                  <div className="bg-white/50 p-3 rounded-2xl border border-emerald-100/50 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-tighter">Freshness</span>
                    <span className="font-bold text-emerald-900">{verificationResult.report.freshnessIndex}</span>
                  </div>
                  <div className="bg-white/50 p-3 rounded-2xl border border-emerald-100/50 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-tighter">Pest Status</span>
                    <span className="font-bold text-emerald-900">{verificationResult.report.pestIssues}</span>
                  </div>
                  <div className="bg-white/50 p-3 rounded-2xl border border-emerald-100/50 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-tighter">Color Metric</span>
                    <span className="font-bold text-emerald-900">{verificationResult.report.colorQuality}</span>
                  </div>
                  <div className="col-span-2 bg-emerald-100/20 p-4 rounded-2xl border border-emerald-200/50 shadow-inner">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Summary Assessment</p>
                    <p className="text-xs text-emerald-900/80 font-medium leading-relaxed">"{verificationResult.report.overallAssessment}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('cropName')}</label>
            <div className="relative flex items-center">
              <input
                id="input-crop-name"
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleChange}
                required
                placeholder="Type or use voice to enter ANY crop name (e.g. Lemon, Paddy)"
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                  focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={startVoiceTyping}
                className={`absolute right-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                title="Use Voice to Type"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
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
