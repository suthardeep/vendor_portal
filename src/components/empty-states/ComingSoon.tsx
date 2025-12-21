import React from 'react';

import Icon from '@/components/base/Icon';

interface ComingSoonProps {
  title?: string;
  description?: string;
  routePath?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Coming Soon", 
  description = "This feature is under development and will be available soon.",
  routePath 
}) => {
  return (
    <div className="h-full flex items-center justify-center p-6 overflow-hidden" style={{ background: 'var(--base-200)' }}>
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div 
          className="relative overflow-hidden rounded-3xl p-8 text-center"
          style={{ 
            background: 'var(--base-1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5">
            <div 
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
              style={{ background: 'var(--primary-500)' }}
            />
            <div 
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full"
              style={{ background: 'var(--accent-500)' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Animated Icon Container */}
            <div className="mb-6 flex justify-center">
              <div 
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                <Icon 
                  name="Rocket" 
                  className="w-10 h-10" 
                  style={{ color: 'white' }}
                />
                <div 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--warning-500)' }}
                >
                  <Icon name="Sparkles" className="w-4 h-4" style={{ color: 'white' }} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-4xl font-bold mb-3"
              style={{ 
                color: 'var(--base-content)',
                letterSpacing: '-0.02em'
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p 
              className="text-base mb-6 max-w-md mx-auto leading-relaxed"
              style={{ color: 'var(--body-content)' }}
            >
              {description}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)'
                }}
              >
                <Icon name="Clock" className="w-4 h-4" />
                In Progress
              </div>
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  background: 'var(--success-content)',
                  color: 'var(--success)'
                }}
              >
                <Icon name="Bell" className="w-4 h-4" />
                Stay Tuned
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="max-w-xs mx-auto mb-6">
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--base-300)' }}
              >
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: '65%',
                    background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <p 
                className="text-xs mt-2 font-medium"
                style={{ color: 'var(--disabled-content)' }}
              >
                Development in progress
              </p>
            </div>

            {/* Thank You Message */}
            <div 
              className="pt-6 border-t"
              style={{ borderColor: 'var(--base-300)' }}
            >
              <p 
                className="text-sm font-medium"
                style={{ color: 'var(--body-content)' }}
              >
                We're working hard to bring you this feature.
                <br />
                <span style={{ color: 'var(--primary-600)' }}>
                  Thank you for your patience!
                </span>
              </p>
            </div>

            {/* Debug Route Path */}
            
          </div>
        </div>

        {/* Additional Info Card */}
        <div 
          className="mt-4 p-4 rounded-2xl text-center"
          style={{ 
            background: 'var(--base-1)',
            border: '1px solid var(--base-300)'
          }}
        >
         
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};


export default ComingSoon;