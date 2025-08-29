import React from 'react'

interface MailchimpLogoProps {
  className?: string
}

export const MailchimpLogo: React.FC<MailchimpLogoProps> = ({ className = "h-4 w-4" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Official Mailchimp Freddie SVG structure */}
      <circle cx="150" cy="150" r="150" fill="#FFE01B"/>
      
      {/* Main head shape */}
      <ellipse cx="150" cy="160" rx="120" ry="100" fill="#FFE01B"/>
      
      {/* Left ear */}
      <ellipse cx="80" cy="100" rx="25" ry="40" fill="#FFE01B"/>
      
      {/* Right ear */}
      <ellipse cx="220" cy="100" rx="25" ry="40" fill="#FFE01B"/>
      
      {/* Left eye */}
      <ellipse cx="120" cy="140" rx="18" ry="22" fill="#241C15"/>
      <ellipse cx="125" cy="135" rx="5" ry="7" fill="white"/>
      
      {/* Right eye */}
      <ellipse cx="180" cy="140" rx="18" ry="22" fill="#241C15"/>
      <ellipse cx="185" cy="135" rx="5" ry="7" fill="white"/>
      
      {/* Snout/nose area */}
      <ellipse cx="150" cy="170" rx="15" ry="12" fill="#E8B000"/>
      
      {/* Nostrils */}
      <ellipse cx="145" cy="168" rx="3" ry="4" fill="#241C15"/>
      <ellipse cx="155" cy="168" rx="3" ry="4" fill="#241C15"/>
      
      {/* Mouth */}
      <path d="M130 190 Q150 210 170 190" stroke="#241C15" strokeWidth="4" fill="none" strokeLinecap="round"/>
      
      {/* Hair tuft */}
      <path d="M150 20 Q120 10 130 60 Q150 0 170 60 Q180 10 150 20" fill="#FFE01B"/>
      
      {/* Face outline enhancement */}
      <path d="M50 160 Q150 80 250 160 Q150 240 50 160" fill="none" stroke="#E8B000" strokeWidth="2" opacity="0.3"/>
    </svg>
  )
}
