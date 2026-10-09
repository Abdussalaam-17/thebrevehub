export const config = {
  brand: {
    name: "Soundbank Media and Entertainment",
    shortName: "Soundbank",
    venue: "The Breve Hub",
    tagline: "Ibadan's Premium 50-Seater Conference & Training Hall",
    logo: "/images/soundbank-logo.png",
    colors: {
      primary: "#0F172A",
      accent: "#F59E0B",
      bg: "#FFFFFF",
      muted: "#64748B",
    },
    whatsapp: "2348012345678",
    email: "bookings@soundbankmedia.com",
    phone: "+234 801 234 5678",
    socials: {
      instagram: "https://instagram.com/soundbankmedia",
      facebook: "https://facebook.com/soundbankmedia",
    },
  },
  venue: {
    name: "The Breve Hub",
    address: "No. 258 Awolowo Road, Beside Friendly Top Petrol Station, Molete, Ibadan",
    mapEmbed:
      "https://www.google.com/maps?q=258+Awolowo+Road+Molete+Ibadan&output=embed",
    directionsNote: "No stressful turns — just by the road side.",
  },
  pricing: {
    hourly: 35000,
    currency: "₦",
    depositPercent: 50,
  },
  included: [
    { icon: "Users", title: "50 Seats", desc: "Comfortable, spaced seating for 50 guests." },
    { icon: "Zap", title: "Back Up Power Supply", desc: "Zero interruptions — power stays on." },
    { icon: "Wifi", title: "WiFi", desc: "Fast, reliable internet for all attendees." },
    { icon: "Monitor", title: "Smart Display Screen", desc: "Crisp presentations, videos & slides." },
    { icon: "Mic", title: "PA System", desc: "2 microphones + clear audio coverage." },
    { icon: "Snowflake", title: "Air Condition", desc: "Cool, comfortable environment." },
    { icon: "Lightbulb", title: "LED Stage Light", desc: "Professional stage lighting + technical support." },
  ],
  extras: [
    { id: "livestream", title: "Livestreaming", price: 50000, desc: "Broadcast your event live to remote attendees." },
    { id: "audio", title: "Audio Recording", price: 30000, desc: "Clean multi-track audio of your event." },
    { id: "video", title: "Video Coverage", price: 80000, desc: "Professional multi-cam video recording." },
    { id: "photo", title: "Photography", price: 60000, desc: "Event photography with edited highlights." },
  ],
  faqs: [
    { q: "How do I book the hall?", a: "Pick your date on the calendar, choose hours, add extras, and pay 50% deposit to lock it in." },
    { q: "What's included in ₦35,000/hour?", a: "50 seats, backup power, WiFi, smart screen, PA system (2 mics), AC, LED stage light, and technical support." },
    { q: "Can I pay at the venue?", a: "No. A 50% deposit locks your date online. Balance is due 48 hours before the event." },
    { q: "Do you offer livestreaming?", a: "Yes — livestreaming, audio recording, video coverage, and photography are available as paid add-ons." },
    { q: "Is parking available?", a: "Yes, and we're right by the roadside on Awolowo Road — no stressful turns." },
    { q: "What's the cancellation policy?", a: "Deposits are transferable to a new date within 7 days. Full policy sent with your invoice." },
  ],
};
