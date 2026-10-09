import assets from "./assets.json";
export const asset = (query: string) => {
  const a = assets.find((x) =>
    (x.alt + " " + x.original).toLowerCase().includes(query.toLowerCase()),
  );
  return a ? a.optimized || a.local : "";
};
export const products = [
  {
    name: "ETi-SOL",
    category: "Monitor",
    label: "Cloud IoT SCADA",
    route: "/eti-sol/",
    description:
      "Cloud IoT SCADA to monitor, control and analyse your solar PV assets remotely, in real time.",
    imageQuery: "Inverter dashboard",
  },
  {
    name: "ETi-EDGE",
    category: "Monitor",
    label: "Local SCADA",
    route: "/eti-edge-local-scada/",
    description:
      "Edge SCADA that monitors, controls and analyses your plants from your own server.",
    imageQuery: "Inverter dashboard",
  },
  {
    name: "ETi-LOG",
    category: "Monitor",
    label: "IoT datalogger",
    route: "/eti-log/",
    description:
      "IoT datalogger that collects real-time plant data and pushes it to the cloud or a local server.",
    imageQuery: "ETi-LOG",
  },
  {
    name: "ETi-PPC",
    category: "Control",
    label: "Power plant controller",
    route: "/eti-ppc-power-plant-controller/",
    description:
      "Power plant controller for active power, reactive power, power factor and ramp rate at plant, block and inverter level.",
    imageQuery: "PPC",
  },
  {
    name: "ETi-ZES",
    category: "Control",
    label: "Zero export",
    route: "/eti-zes-zero-export-system/",
    description:
      "Zero export control at the edge, so no solar power reaches the grid.",
    imageQuery: "Zero export",
  },
  {
    name: "ETi-LMS",
    category: "Control",
    label: "Load management and DG sync",
    route: "/eti-lms-load-management-system/",
    description:
      "Load management with DG sync: adjusts solar output to live load, grid and diesel generator status.",
    imageQuery: "DG",
  },
  {
    name: "ETi-CAST",
    category: "Forecast",
    label: "Generation forecasting",
    route: "/eti-cast-solar-generation-forecasting/",
    description:
      "Forecasts solar plant generation from weather data: day-ahead, week-ahead and intra-day reports.",
    imageQuery: "forecast",
  },
];
export const benefits = [
  [
    "Multi-plant view",
    "Works as individual plant SCADA, or multiple plants SCADA with CMS and RMS capabilities.",
  ],
  ["Alerts", "In-app alert notifications and tracking."],
  [
    "Automated reports and DGR",
    "Customisable dashboard and reports, with automatic daily generation reports.",
  ],
  [
    "Downtime loss analysis",
    "Grid downtime loss, inverter downtime loss, curtailment loss and more.",
  ],
  [
    "Inverter performance ranking",
    "Insight into the best and worst performing inverter.",
  ],
  ["SLD and map view", "SLD view and Google Map view of the plant."],
  [
    "Data sharing",
    "Data exchange with third-party systems using FTP, OPC and API.",
  ],
  [
    "Retrofit any SCADA",
    "Uses the existing hardware of a non-functional SCADA already in the plant.",
  ],
];
export const metrics = [
  { value: 3, suffix: "+ GW", label: "Solar portfolio" },
  { value: 700, suffix: "+", label: "Solar plants" },
  { value: 300, suffix: "+", label: "Customers" },
  { value: 10, suffix: "+", label: "Countries" },
];
export const industries = [
  [
    "IPPs",
    "One portfolio view across plants, states and vendors, with the numbers a lender or buyer asks for.",
    "/eti-sol/",
  ],
  [
    "EPCs",
    "Hand over a plant with monitoring already live, and keep O&M visibility after handover.",
    "/products/",
  ],
  [
    "C&I plant owners",
    "Know today’s generation and yesterday’s faults without walking to the inverter room.",
    "/eti-zes-zero-export-system/",
  ],
  [
    "Utilities",
    "Government, SLDC or secured facilities: SCADA on your own server, without internet.",
    "/eti-edge-local-scada/",
  ],
];
export const social = [
  ["LinkedIn", "https://www.linkedin.com/company/enerman/"],
  ["YouTube", "https://www.youtube.com/@enermantechnologiesprivate2816"],
  ["Facebook", "https://www.facebook.com/enermantechnologies"],
  ["Instagram", "https://www.instagram.com/enermantech/"],
  ["X", "https://x.com/enermantech"],
  [
    "WhatsApp",
    "https://wa.me/919980698001?text=Hello%20EnerMAN%2C%20I%20have%20a%20question.",
  ],
];
export const phoneNumbers = [
  "+91 99806 98001",
  "+91 70229 49911",
  "+91 74117 70381",
  "+91 90365 06303",
];
export const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=EnerMAN+Technologies+Daystar+Center+Kempapura+Hebbal+Bengaluru+560024";
export const appLinks = [
  [
    "Android app",
    "https://play.google.com/store/apps/details?id=com.pyramid.enerman",
  ],
  ["iOS app", "https://apps.apple.com/in/app/eti-sol/id1528670740"],
];
export const internalHref = (href: string) =>
  href.startsWith("https://enerman.in/") && !href.includes("/wp-content/")
    ? href.replace("https://enerman.in", "")
    : href;
