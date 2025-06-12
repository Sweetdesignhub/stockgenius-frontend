import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import proImage from '../../assets/proDetails.jpg';
import masterImage from '../../assets/masterDetails.png';
import PlanSelectDialog from './PlanSelectDialog';

const FeatureItem = ({ text, plan = 'pro' }) => (
  <div className="flex items-center space-x-2 sm:space-x-3">
    <svg 
      className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
        plan === 'pro' 
          ? 'text-[rgba(69,252,252,1)]' 
          : 'text-[rgba(73,255,91,1)]'
      }`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-sm sm:text-base text-gray-800 dark:text-gray-300">{text}</span>
  </div>
);

export default function PlanDetailsDialog({ isOpen = false, onClose, initialPlan = 'pro' }) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [showPlanSelect, setShowPlanSelect] = useState(false);

  useEffect(() => {
    setSelectedPlan(initialPlan);
  }, [initialPlan]);

  return (
    <Transition appear show={isOpen || false} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-start sm:items-center justify-center overflow-y-auto scrollbar-hide">
          <div className="flex min-h-full w-full items-start sm:items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              className="w-full"
            >
              <Dialog.Panel className="relative mx-auto w-full max-w-[1200px] min-h-screen sm:min-h-[700px] bg-white dark:bg-black/100 rounded-none sm:rounded-[10px] border border-gray-200 dark:border-gray-700 transform transition-all shadow-xl overflow-hidden">
                <button 
                  onClick={onClose} 
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div className="flex flex-col w-full h-full">
                  <div className="w-full text-center py-4 sm:py-8">
                    <h2 className="font-['Aldrich'] text-[28px] sm:text-[40px] font-normal leading-[100%] tracking-[0.02em] text-gray-900 dark:text-white mb-4 sm:mb-6">
                      StockScope Pass
                    </h2>                    <div className="flex justify-center space-x-3 px-2 sm:px-0">
                      <button 
                        onClick={() => setSelectedPlan('pro')}
                        className={`relative px-8 py-1 rounded-lg transition-all duration-300 font-semibold border-[0.9px] text-white ${
                          selectedPlan === 'pro' ? 'scale-105' : 'scale-95'
                        }`}
                        style={{
                          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B4D5C 132.95%)',
                          opacity: selectedPlan === 'pro' ? 1 : 0.7,
                          borderImageSource: 'linear-gradient(180deg, rgba(11, 87, 92, 0.4) 17.19%, rgba(98, 223, 251, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(11, 73, 92, 0) -4.69%, rgba(189, 246, 254, 0.3) 100%)',
                          borderImageSlice: '1',
                          backdropFilter: 'blur(17.94871711730957px)',
                          WebkitBackdropFilter: 'blur(17.94871711730957px)',
                          boxShadow: '0px 8.97px 26.92px 0px rgba(73, 244, 255, 0.7) inset, 0px 8.97px 35.9px 0px rgba(11, 58, 92, 0.5)'
                        }}
                      >
                        <span className="relative z-10 text-sm">PRO PASS</span>
                      </button>
                      <button 
                        onClick={() => setSelectedPlan('master')}
                        className={`relative px-4 py-1.5 rounded-lg transition-all duration-300 font-semibold border-[0.9px] text-white ${
                          selectedPlan === 'master' ? 'scale-105' : 'scale-95'
                        }`}
                        style={{
                          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #278848 132.95%)',
                          opacity: selectedPlan === 'master' ? 1 : 0.7,
                          borderImageSource: 'linear-gradient(180deg, rgba(39, 136, 72, 0.4) 17.19%, rgba(98, 251, 141, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)',
                          borderImageSlice: '1',
                          backdropFilter: 'blur(17.94871711730957px)',
                          WebkitBackdropFilter: 'blur(17.94871711730957px)',
                          boxShadow: '0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.7) inset, 0px 8.97px 35.9px 0px rgba(65, 175, 63, 0.5)'
                        }}
                      >
                        <span className="relative z-10 text-sm">MASTER PASS</span>
                      </button>
                    </div>
                  </div>
                    <div className="flex-1 px-4 sm:px-8 pb-4 sm:pb-8">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 h-full relative">
                      <div className="flex-1 flex flex-col z-10 order-2 lg:order-1">                        <div className="w-full lg:w-[600px] h-[80px] sm:h-[120px] rounded-[10px] border border-gray-200 dark:border-[rgba(255,255,255,0.15)] p-3 sm:p-6 mb-4 sm:mb-6 flex items-center"
                          style={{                            background: selectedPlan === 'pro'
                              ? 'linear-gradient(180deg, rgba(79, 255, 246, 0.1) 99.99%, rgba(27, 51, 51, 0.02) 100%), radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)'
                              : 'linear-gradient(180deg, rgba(0, 255, 26, 0.1) 99.99%, rgba(27, 51, 31, 0.02) 100%), radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)',
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)'
                          }}
                        >
                          <div className="flex items-center w-full overflow-x-auto scrollbar-hide">
                            <div className="flex items-center pl-2 sm:pl-4">                              <span className="font-['Poppins'] text-[16px] sm:text-[30px] font-semibold leading-[24px] sm:leading-[48px] tracking-[0%] text-gray-800 dark:text-white whitespace-nowrap"
                                style={{
                                  textShadow: selectedPlan === 'pro' 
                                    ? '0 0 10px rgba(69, 252, 252, 0.3)'
                                    : '0 0 10px rgba(73, 255, 91, 0.3)'
                                }}
                              >
                                STOCKSCOPE PASS
                              </span>
                              <span 
                                className="font-['Poppins'] text-[24px] sm:text-[55px] font-extrabold leading-[100%] tracking-[2%] bg-clip-text text-transparent whitespace-nowrap ml-2 sm:ml-4"
                                style={selectedPlan === 'pro' ? {
                                  color: 'rgba(69, 252, 252, 1)',
                                  
                                } : {
                                  color: 'rgba(73, 255, 91, 1)',
                                  
                                }}
                              >
                                {selectedPlan === 'pro' ? 'PRO' : 'MASTER'}
                              </span>
                            </div>
                          </div>
                        </div>                        <div className="w-full lg:w-[600px] min-h-[140px] rounded-[7.62px] border-[0.69px] border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6 bg-white dark:bg-black"
                          style={{
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)'
                          }}
                        >
                          <div className="flex flex-col space-y-2 sm:space-y-3 px-4 sm:px-10">
                            {selectedPlan === 'pro' ? (
                              <>
                                <FeatureItem text="10 lakhs funds cap (Paper Trading)" plan="pro" />
                                <FeatureItem text="10 daily/50 weekly transactions using bots" plan="pro" />
                                <FeatureItem text="Past 7 days per ticker (News & Sentiments)" plan="pro" />
                                <FeatureItem text="25 simulations/month" plan="pro" />
                              </>
                            ) : (
                              <>
                                <FeatureItem text="Full market hours, 20 lakhs funds cap" plan="master" />
                                <FeatureItem text="Unlimited bots, full trading hours" plan="master" />
                                <FeatureItem text="Full history with insights" plan="master" />
                                <FeatureItem text="Unlimited simulations (News & Sentiments)" plan="master" />
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 sm:mt-4 px-2 sm:px-4">
                          <div className="flex items-baseline mb-3 sm:mb-4">
                            <span className="font-['Poppins'] text-[20px] sm:text-[28px] font-medium leading-[22px] tracking-[0%] text-gray-800 dark:text-white align-middle">
                              Starts at {selectedPlan === 'pro' ? '25$' : '50$'}/Month
                            </span>
                          </div>                          <button 
                            onClick={() => {
                              console.log(`Selected ${selectedPlan.toUpperCase()} Plan`);
                              setShowPlanSelect(true);
                            }}
                            className="w-[140px] sm:w-[165px] h-[32px] sm:h-[35px] rounded-md px-[20px] sm:px-[26.92px] py-[6px] sm:py-[7px] font-['Poppins'] text-[16px] sm:text-[18px] font-semibold text-white dark:text-white leading-[17.95px] tracking-[2%] text-center align-middle transition-all duration-300 relative overflow-hidden group flex items-center justify-center"
                            style={{
                              background: selectedPlan === 'pro'
                                ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B4D5C 132.95%)'
                                : 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #278848 132.95%)',
                              borderImageSource: selectedPlan === 'pro'
                                ? 'linear-gradient(180deg, rgba(11, 87, 92, 0.4) 17.19%, rgba(98, 223, 251, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(11, 73, 92, 0) -4.69%, rgba(189, 246, 254, 0.3) 100%)'
                                : 'linear-gradient(180deg, rgba(39, 136, 72, 0.4) 17.19%, rgba(98, 251, 141, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)',
                              borderImageSlice: 1,
                              backdropFilter: 'blur(17.94871711730957px)',
                              WebkitBackdropFilter: 'blur(17.94871711730957px)',
                              boxShadow: selectedPlan === 'pro'
                                ? '0px 8.97px 26.92px 0px rgba(73, 244, 255, 0.7) inset, 0px 8.97px 35.9px 0px rgba(11, 58, 92, 0.5)'
                                : '0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.7) inset, 0px 8.97px 35.9px 0px rgba(65, 175, 63, 0.5)',
                              transition: 'all 0.3s ease-in-out'
                            }}
                          >
                            <span className="relative z-10">Select Plan</span>
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: selectedPlan === 'pro'
                                  ? 'linear-gradient(180deg, rgba(11, 73, 92, 0) -4.69%, rgba(189, 246, 254, 0.3) 100%)'
                                  : 'linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)',
                                boxShadow: selectedPlan === 'pro'
                                  ? 'inset 0px 8.97px 26.92px 0px rgba(73, 244, 255, 0.8)'
                                  : 'inset 0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.8)',
                              }}
                            />
                          </button>
                        </div>
                      </div>                      <div className="relative w-full lg:w-[482px] h-[250px] sm:h-[300px] lg:h-[500px] mt-4 lg:mt-0 lg:ml-auto order-1 lg:order-2">
                        <div className="absolute inset-0 overflow-hidden rounded-[7.62px] border-[0.69px] border-[rgba(255,255,255,0.15)]">
                          <img 
                            src={selectedPlan === 'pro' ? proImage : masterImage}
                            alt={selectedPlan === 'pro' ? "Pro Plan Details" : "Master Plan Details"}
                            className="w-full h-full object-cover opacity-60 transform scale-105"
                            style={{
                              maxWidth: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              transition: 'all 0.3s ease-in-out'
                            }}
                          />
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: selectedPlan === 'pro'
                                ? 'linear-gradient(180deg, rgba(0, 255, 240, 0.1) 0%, rgba(27, 51, 51, 0.2) 100%)'
                                : 'linear-gradient(180deg, rgba(0, 255, 26, 0.1) 0%, rgba(27, 51, 31, 0.2) 100%)',
                              mixBlendMode: 'overlay'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      <PlanSelectDialog
        isOpen={showPlanSelect}
        onClose={() => setShowPlanSelect(false)}
        initialPlan={selectedPlan}
      />
    </Transition>
  );
}
