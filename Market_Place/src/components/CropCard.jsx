import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useListings } from '../context/ListingContext';
import CropImage from './CropImage';
import { Phone, MessageCircle, Bookmark, BookmarkCheck, MapPin, Calendar, Scale, BadgeCheck, Eye, FileText, X } from 'lucide-react';

export default function CropCard({ listing, showContact = true, showSave = false }) {
  const { t } = useLanguage();
  const { toggleSaved, isSaved, incrementView } = useListings();
  const saved = isSaved(listing.id);
  const [hasViewed, setHasViewed] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const registerView = () => {
    if (showContact && !hasViewed && incrementView) {
      incrementView(listing.id);
      setHasViewed(true);
    }
  };

  const handleContactClick = () => {
    registerView();
  };

  const contactNumber = listing.contactNumber || listing.whatsappNumber || "9999999999";
  const whatsappNumber = listing.whatsappNumber || listing.contactNumber || "9999999999";

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in your ${listing.cropName} listing on KisanBazaar.`
  );
  const whatsappLink = `https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group animate-fade-in flex flex-col cursor-pointer"
        onMouseEnter={registerView}
        onClick={registerView}
      >
        {/* Image */}
        <div className="relative">
          <CropImage cropName={listing.cropName} photo={listing.photo} size="md" />
          {listing.verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
              <BadgeCheck size={14} />
              {t('verifiedReal')}
            </div>
          )}
          {showSave && (
            <button
              id={`save-listing-${listing.id}`}
              onClick={(e) => { e.stopPropagation(); toggleSaved(listing.id); }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md hover:bg-white
                transition-all duration-200 cursor-pointer hover:scale-110"
            >
              {saved ? (
                <BookmarkCheck size={18} className="text-amber-500" />
              ) : (
                <Bookmark size={18} className="text-gray-500" />
              )}
            </button>
          )}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow">
            <span className="text-green-800 font-bold text-lg">₹{listing.price}</span>
            <span className="text-gray-500 text-xs">/{listing.unit === 'quintal' ? 'q' : 'kg'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{listing.cropName}</h3>
              {listing.variety && (
                <p className="text-sm text-gray-500">{listing.variety}</p>
              )}
            </div>
            {!showContact && (
              <div className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                <Eye size={12} />
                {listing.views || 0}
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-sm text-gray-600 flex-1">
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-green-600 shrink-0" />
              <span>{listing.quantity} {listing.unit} {t('available') || 'Available'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-green-600 shrink-0" />
              <span>{listing.farmerLocation || listing.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-green-600 shrink-0" />
              <span>{t('harvestedOn') || 'Harvested'}: {listing.harvestDate}</span>
            </div>
          </div>

          {listing.farmerName && (
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              {t('farmer') || 'Farmer'}: <span className="font-medium text-gray-700">{listing.farmerName}</span>
            </div>
          )}

          {listing.verified && listing.report && showContact && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              <FileText size={14} />
              {t('viewAiReport') || "View AI Inspection Report"}
            </button>
          )}

          {/* Contact buttons */}
          {showContact ? (
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
              <a
                href={`tel:+91${contactNumber}`}
                onClick={(e) => { e.stopPropagation(); handleContactClick(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white
                  rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm"
                id={`call-farmer-${listing.id}`}
              >
                <Phone size={15} />
                <span className="hidden sm:inline">{t('contactFarmer') || 'Call'}</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a
                href={whatsappLink}
                onClick={(e) => { e.stopPropagation(); handleContactClick(); }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white
                  rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
                id={`whatsapp-farmer-${listing.id}`}
              >
                <MessageCircle size={15} />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
              <button
                onClick={(e) => { e.stopPropagation(); if (listing.onEdit) listing.onEdit(listing); }}
                className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
              >
                {t('edit') || 'Edit'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (listing.onDelete) listing.onDelete(listing.id); }}
                className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors duration-200"
              >
                {t('delete') || 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showReport && listing.report && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900" onClick={() => setShowReport(false)}>
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <BadgeCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t('aiReport')}</h3>
                <p className="text-xs text-gray-500">Verified locally via ML Vision</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{t('condition')}</span>
                <span className="font-semibold text-gray-900">{listing.report.condition || 'Healthy'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{t('freshnessIndex')}</span>
                <span className="font-semibold text-green-600">{listing.report.freshnessIndex || '95%'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{t('pestIssues')}</span>
                <span className="font-semibold text-gray-900">{listing.report.pestIssues || 'None Detected'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{t('colorQuality')}</span>
                <span className="font-semibold text-gray-900">{listing.report.colorQuality || 'Optimal'}</span>
              </div>
              <div className="pt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 block mb-1">{t('overallAssessment')}:</span>
                <span className="font-medium text-gray-800 italic">"{listing.report.overallAssessment || 'Crop is market ready and verified'}"</span>
              </div>
            </div>
            <button className="mt-6 w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800" onClick={() => setShowReport(false)}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
