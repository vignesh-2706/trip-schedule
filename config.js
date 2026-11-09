// ====== EDIT THIS FILE ======
// Add document filenames and replace approximate coordinates/Maps links where needed.
const TRIP_CONFIG = {
  // Used as a fallback origin until a location is shared or a checkpoint is reached.
  home: { name: "Bengaluru Home", lat: 12.9716, lng: 77.5946 },

  documents: [
    { name: "Dharmasthala Stay Printout", file: "docs/Booking_dharma.pdf" },
    { name: "Blue Wave Homestay Printout", file: "docs/Bluewave_Vignesh_G_Booking_Confirmation.pdf" },
    { name: "Manipal Trip Image", file: "docs/Manipal.png" }
  ],

  travelEssentials: [
    "Convocation clothes + accessories",
    "Temple-appropriate clothing",
    "Toddler food, diapers, wipes + change of clothes",
    "Medicines + first-aid kit",
    "Water + road snacks",
    "Chargers + power bank + camera",
    "Car seat if available",
    "Booking confirmations + ID proofs"
  ],

  // Replace these URLs with exact Google Maps place/share links when available.
  days: [
    {
      id: "day1",
      label: "Day 1 — Wednesday, 18 Nov",
      subtitle: "Bengaluru → Dharmasthala",
      className: "day1",
      note: "Lunch at home at 2:00 PM → depart 2:30–3:00 PM → Hassan break / early dinner → Dharmasthala. Google Maps currently estimates about 3h 15m Bengaluru–Hassan and 2h 18m Hassan–Dharmasthala (about 5h 45m driving total, before the break). Estimate checked 9 Nov 2026; recheck Maps on the travel day.",
      meals: [
        ["2:00 PM", "Lunch at home"],
        ["5:45–6:15 PM", "Hassan break + early dinner"]
      ],
      stops: [
        { id:"d1-lunch", time:"2:00 PM", title:"Lunch at home", sub:"Eat before departure • final packing and luggage check", lat:12.9716,lng:77.5946, map:"https://www.google.com/maps/search/?api=1&query=Bengaluru" },
        { id:"d1-leave", time:"2:30 PM", title:"Leave Bengaluru", sub:"Target 2:30 PM; flexible until 3:00 PM • Maps estimates about 3h 15m to Hassan", lat:12.9716,lng:77.5946, map:"https://www.google.com/maps/dir/?api=1&origin=Bengaluru%2C%20Karnataka&destination=Hassan%2C%20Karnataka&travelmode=driving" },
        { id:"d1-snacks", time:"5:45 PM", title:"Hassan break + early dinner", sub:"Expected around 5:45–6:15 PM • take a 30–45 min rest/meal break • Maps estimates about 2h 18m onward", map:"https://www.google.com/maps/dir/?api=1&origin=Hassan%2C%20Karnataka&destination=Dharmasthala%2C%20Karnataka&travelmode=driving" },
        { id:"d1-dharma", time:"8:30 PM", title:"Reach Dharmasthala", sub:"Plan for about 8:30–9:30 PM depending on departure time, traffic, and the Hassan break • check in and rest", lat:12.9516,lng:75.3800, map:"https://www.google.com/maps/dir/?api=1&origin=Hassan%2C%20Karnataka&destination=Dharmasthala%2C%20Karnataka&travelmode=driving" }
      ]
    },
    {
      id:"day2",
      label:"Day 2 — Thursday, 19 Nov",
      subtitle:"Dharmasthala → Karkala → Homestay → Manipal Convocation → Udupi",
      className:"day2",
      note:"Homestay check-in is strict at 1:00 PM or later. Check-out next day is by 11:00 AM.",
      meals:[
        ["7:30 AM","Breakfast at Dharmasthala"],
        ["1:00 PM","Lunch / freshen up at homestay"],
        ["9:00 PM","Dinner after temple visits"]
      ],
      stops:[
        { id:"d2-darshan", time:"6:00 AM", title:"Dharmasthala Darshan", sub:"Early darshan • then breakfast", lat:12.9516,lng:75.3800, map:"https://www.google.com/maps/search/?api=1&query=Sri%20Manjunatha%20Swamy%20Temple%20Dharmasthala" },
        { id:"d2-breakfast", time:"7:30 AM", title:"Breakfast", sub:"Dharmasthala", map:"https://www.google.com/maps/search/?api=1&query=Dharmasthala%20Karnataka" },
        { id:"d2-karkala", time:"9:00 AM", title:"Gomateshwara — Karkala", sub:"Target ~60–90 min • only if Dharmasthala darshan stays on time", lat:13.2146,lng:74.9960, map:"https://www.google.com/maps/search/?api=1&query=Karkala%20Gomateshwara" },
        { id:"d2-stay", time:"11:30 AM", title:"Drive to Blue Wave Homestay", sub:"Aim to arrive at/after 1:00 PM", lat:13.2723,lng:74.7261, map:"https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxALGBMSBwjqDxALGBQYATICCAIqBwoFOgNJTlI&qs=CAEyFENnc0k4c0tCeTVHNW45ZnBBUkFCOAhCCRFuWcTb2-_6xkIJEaZYZIJasE3M&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" },
        { id:"d2-checkin", time:"1:00 PM", title:"Homestay check-in + freshen up", sub:"Strict check-in: 1:00 PM or later", lat:13.2723,lng:74.7261, map:"https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxALGBMSBwjqDxALGBQYATICCAIqBwoFOgNJTlI&qs=CAEyFENnc0k4c0tCeTVHNW45ZnBBUkFCOAhCCRFuWcTb2-_6xkIJEaZYZIJasE3M&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" },
        { id:"d2-convo", time:"2:00 PM", title:"Manipal Convocation", sub:"Keep buffer for travel • ceremony may finish 6–7 PM", lat:13.3520,lng:74.7920, map:"https://www.google.com/maps/search/?api=1&query=Manipal%20Institute%20of%20Technology" },
        { id:"d2-krishna", time:"7:00 PM", title:"Udupi Sri Krishna Mutt", sub:"If ceremony finishes in time", lat:13.3409,lng:74.7421, map:"https://www.google.com/maps/search/?api=1&query=Udupi%20Sri%20Krishna%20Matha" },
        { id:"d2-indrani", time:"8:00 PM", title:"Indrani Panchadurga Temple", sub:"Near Manipal/Udupi • optional if time is tight", lat:13.3400,lng:74.7760, map:"https://www.google.com/maps/search/?api=1&query=Indrani%20Panchadurga%20Temple%20Manipal" },
        { id:"d2-home", time:"9:30 PM", title:"Back to homestay + rest", sub:"Sleep early for beach morning", lat:13.2723,lng:74.7261, map:"https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxALGBMSBwjqDxALGBQYATICCAIqBwoFOgNJTlI&qs=CAEyFENnc0k4c0tCeTVHNW45ZnBBUkFCOAhCCRFuWcTb2-_6xkIJEaZYZIJasE3M&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" }
      ]
    },
    {
      id:"day3",
      label:"Day 3 — Friday, 20 Nov",
      subtitle:"Beach → Anegudde → Kapu → Mangalore → Bengaluru",
      className:"day3",
      note:"Enjoy the beach first. Check out before 11 AM. Pabbas + Kadri/Kateel are time-dependent and may push the Bengaluru arrival late.",
      meals:[
        ["7:30 AM","Breakfast at homestay"],
        ["1:30 PM","Lunch around Kapu/Udupi"],
        ["3:00 PM","Pabbas ice cream"],
        ["7:30–8:30 PM","Dinner on return journey"]
      ],
      stops:[
        { id:"d3-beach", time:"6:30 AM", title:"Beach play at the homestay", sub:"Family time • photos • toddler play", lat:13.2723,lng:74.7261, map:"https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxALGBMSBwjqDxALGBQYATICCAIqBwoFOgNJTlI&qs=CAEyFENnc0k4c0tCeTVHNW45ZnBBUkFCOAhCCRFuWcTb2-_6xkIJEaZYZIJasE3M&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" },
        { id:"d3-breakfast", time:"8:00 AM", title:"Breakfast", sub:"Homestay", lat:13.2723,lng:74.7261, map:"https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxALGBMSBwjqDxALGBQYATICCAIqBwoFOgNJTlI&qs=CAEyFENnc0k4c0tCeTVHNW45ZnBBUkFCOAhCCRFuWcTb2-_6xkIJEaZYZIJasE3M&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" },
        { id:"d3-checkout", time:"9:30 AM", title:"Pack + check out", sub:"Must leave by 11:00 AM", lat:13.2723,lng:74.7261, map:"https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxALGBMSBwjqDxALGBQYATICCAIqBwoFOgNJTlI&qs=CAEyFENnc0k4c0tCeTVHNW45ZnBBUkFCOAhCCRFuWcTb2-_6xkIJEaZYZIJasE3M&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" },
        { id:"d3-aane", time:"11:15 AM", title:"Anegudde Sri Vinayaka — Kumbhashi", sub:"Aane Gudda", lat:13.5920,lng:74.7060, map:"https://www.google.com/maps/search/?api=1&query=Anegudde%20Sri%20Vinayaka%20Temple" },
        { id:"d3-kapu", time:"12:15 PM", title:"Kapu Mariamma / Hosa Marigudi", sub:"Kapu", lat:13.2240,lng:74.7430, map:"https://www.google.com/maps/search/?api=1&query=Hosa%20Marigudi%20Kapu" },
        { id:"d3-lunch", time:"1:30 PM", title:"Lunch", sub:"Kapu/Udupi area", lat:13.2240,lng:74.7430, map:"https://www.google.com/maps/search/?api=1&query=Kapu%20Karnataka%20restaurants" },
        { id:"d3-pabbas", time:"3:00 PM", title:"Pabbas / Ideal Ice Cream — Mangalore", sub:"Gadbad / Gudbud / family treat", lat:12.8820,lng:74.8420, map:"https://www.google.com/maps/search/?api=1&query=Pabbas%20Ice%20Cream%20Mangalore" },
        { id:"d3-kadri", time:"4:00 PM", title:"Kadri Manjunath Temple", sub:"Optional — choose Kadri OR Kateel depending on time", lat:12.8840,lng:74.8560, map:"https://www.google.com/maps/search/?api=1&query=Kadri%20Manjunath%20Temple" },
        { id:"d3-return", time:"4:30 PM", title:"Start return to Bengaluru", sub:"Dinner on the way • expected late arrival", lat:12.9716,lng:77.5946, map:"https://www.google.com/maps/search/?api=1&query=Bengaluru" }
      ]
    }
  ]
};
