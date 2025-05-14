// App.jsx - Main component for the Neapolitan Pizza Calculator
// Note: Custom favicon is defined in index.html
import { useState, useRef } from 'react';
import './App.css';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { Typography, useMediaQuery, FormControlLabel, Switch } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HotelIcon from '@mui/icons-material/Hotel';
import InventoryIcon from '@mui/icons-material/Inventory';
import CircleIcon from '@mui/icons-material/Circle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { motion } from 'framer-motion';

// Language translations
const translations = {
  en: {
    // App header
    appTitle: "Neapolitan Pizza Dough Calculator",
    tagline: "Based on AVPN authentic guidelines",
    
    // Input fields
    pizzaCount: "Number of Pizzas:",
    pizzaSize: "Size per Pizza (grams):",
    hydration: "Hydration %:",
    flourType: "Flour Type:",
    yeastType: "Yeast Type:",
    targetTime: "Target Cooking Time:",
    calculateButton: "Calculate Dough",
    
    // Flour types
    flourTypes: {
      "00": "00 Flour (Neapolitan)",
      "bread": "Bread Flour",
      "allpurpose": "All-Purpose Flour",
      "manitoba": "Manitoba Flour",
      "whole": "Whole Wheat Flour",
      "semolina": "Semolina Flour",
      "spelt": "Spelt Flour",
      "rye": "Rye Flour"
    },
    
    // Yeast types
    yeastTypes: {
      "dry": "Dry Yeast",
      "fresh": "Fresh Yeast",
      "sourdough": "Sourdough"
    },
    
    // Warning messages
    warningYeast: "⚠️ Fermentation time too short for {yeastType} yeast.\n🕒 AVPN recommends at least {hours} hours.\n📅 Earliest valid baking time: {earliestTime}",
    setSuggestedTime: "Set Suggested Time",
    
    // Recipe section
    recipeTitle: "📦 Dough Recipe",
    proteinContent: "Protein Content:",
    recommendedHydration: "Recommended Hydration:",
    flour: "Flour",
    water: "Water",
    salt: "Salt",
    yeast: "Yeast",
    sourdoughStarter: "Sourdough Starter",
    fermentationTime: "Fermentation Time:",
    hours: "hours",
    
    // Timeline section
    timelineTitle: "🧭 Example Timeline",
    timelineSteps: {
      mix: {
        title: "Mix",
        desc: "Mix the ingredients starting with water (room temperature), then dissolve the salt. Gradually add small amounts of flour, mixing continuously, then add yeast. Knead vigorously for 10-15 minutes until the dough is smooth and elastic with no lumps. The finished dough should be soft, smooth, and sticky to the touch."
      },
      rest: {
        title: "Rest",
        desc: "Allow the dough mass to rest on a work surface covered with a damp cloth, or in a food container for about 20-30 minutes. This initial rest period allows the dough to relax and begin gluten formation, making it easier to portion later."
      },
      bulk: {
        title: "Bulk Fermentation",
        desc: "For room temperature fermentation, maintain the dough at 22-25°C. For longer fermentation time (over 16 hours), place in refrigerator (4-6°C). The dough must be stored in sealed food containers to prevent surface drying. Rising time varies based on temperature and yeast type following AVPN standards."
      },
      balling: {
        title: "Balling",
        desc: "Divide the dough into balls (200-280g each depending on desired pizza size) using a spatula or scraper. Minimal handling is required, and the dough should only be shaped by folding the edges from bottom to top. Ball shaping should be completed in a few seconds. Place shaped balls in proofing boxes with a light dusting of flour between them."
      },
      bake: {
        title: "Ready to Bake",
        desc: "TRADITIONAL WOOD-FIRED OVEN: Heat to 430-480°C with cooking surface at 380-430°C. Using a pizza peel, stretch the dough disc by hand to 3mm thickness (1-2cm for the crust border). Add toppings and bake for 60-90 seconds, rotating as needed.\n\nHOME OVEN METHOD: Place a pizza stone or steel on the middle-top rack and preheat at maximum temperature (250-290°C) for at least 45-60 minutes. Stretch dough as above. For best results, use a pizza peel to launch onto the hot stone. Bake for 4-6 minutes until the crust is golden and charred in spots. If your oven has a broiler/grill function, switch to it for the final minute to char the crust."
      }
    },
    
    // Guidelines section
    guidelinesTitle: "📜 AVPN Official Guidelines Summary",
    guidelinesItems: {
      flourSpecs: {
        title: "🌾 Flour Specifications:",
        items: [
          "Type 00 flour with W value between 250-320",
          "Protein content: 11-13.5%",
          "Absorption rate: 55-62%"
        ]
      },
      ingredients: {
        title: "🧂 Ingredient Percentages:",
        items: [
          "Water: <strong>55-62%</strong> of flour weight (hydration)",
          "Salt: <strong>2-3%</strong> of flour weight",
          "Fresh Yeast: <strong>0.2-0.3%</strong> of flour weight",
          "Dry Yeast: <strong>0.1-0.2%</strong> of flour weight",
          "Sourdough Starter: <strong>5-20%</strong> of flour weight"
        ]
      },
      fermentation: {
        title: "🕒 Fermentation Requirements:",
        items: [
          "Direct Method with Fresh Yeast: minimum <strong>8-12 hours</strong>",
          "Direct Method with Dry Yeast: minimum <strong>8 hours</strong>",
          "Sourdough Method: minimum <strong>16-24 hours</strong>",
          "Poolish Method: minimum <strong>16-18 hours</strong> (4-6h for pre-ferment + 12h for dough)",
          "Biga Method: minimum <strong>18-24 hours</strong> (6-18h for pre-ferment + 12h for dough)"
        ]
      },
      temperature: {
        title: "🌡️ Temperature Controls:",
        items: [
          "Room Temperature Fermentation: <strong>22-25°C</strong>",
          "Cold Fermentation: <strong>4-6°C</strong>",
          "Dough Temperature after Mixing: <strong>23-25°C</strong>"
        ]
      },
      preparation: {
        title: "🥣 Preparation Process:",
        items: [
          "Mixing: 10-15 minutes until smooth texture",
          "First Rest: 20-30 minutes at room temperature",
          "Bulk Fermentation: 6-24 hours depending on method",
          "Balling: Form dough balls of 200-280g",
          "Final Proof: Approximately <strong>2 hours</strong> before baking"
        ]
      },
      cooking: {
        title: "🍕 Cooking Specifications:",
        items: [
          "Oven Temperature: <strong>430-480°C</strong>",
          "Cooking Surface: <strong>380-430°C</strong>",
          "Cooking Time: <strong>60-90 seconds</strong>",
          "Traditional Wood-fired Oven Recommended",
          "Final Diameter: 22-35cm with raised border (cornicione) of 1-2cm"
        ]
      },
      notes: {
        title: "⚠️ Important Notes:",
        items: [
          "No mechanical or automated press devices allowed",
          "Manual handling and stretching only",
          "No rolling pins or mechanical dough shaping",
          "No oils or fats in the dough (except on the surface for storage)"
        ]
      }
    },
    references: "Official References:",
    referencesPdf: "2024 AVPN Guidelines (PDF)",
    referencesWeb: "AVPN Pizza Napoletana Recipe (Webpage)"
  },
  tr: {
    // App header
    appTitle: "Napolitan Pizza Tarifi Hesaplayicisi",
    tagline: "Otantik AVPN kurallarına temel almaktadir",
    
    // Input fields
    pizzaCount: "Pizza Sayısı:",
    pizzaSize: "Pizza Başına Boyut (gram):",
    hydration: "Hidrasyon %:",
    flourType: "Un Tipi:",
    yeastType: "Maya Tipi:",
    targetTime: "Hedef Pişirme Zamanı:",
    calculateButton: "Hesapla",
    
    // Flour types
    flourTypes: {
      "00": "00 Un (Napoli)",
      "bread": "Ekmeklik Un",
      "allpurpose": "Standart Çok Amaçlı Un",
      "manitoba": "Manitoba Unu",
      "whole": "Tam Buğday Unu",
      "semolina": "İrmik Unu",
      "spelt": "Dinkel Buğdayı Unu",
      "rye": "Çavdar Unu"
    },
    
    // Yeast types
    yeastTypes: {
      "dry": "Kuru Maya",
      "fresh": "Yaş Maya",
      "sourdough": "Ekşi Maya"
    },
    
    // Warning messages
    warningYeast: "⚠️ {yeastType} için fermentasyon süresi çok kısa.\n🕒 AVPN en az {hours} saat öneriyor.\n📅 En erken geçerli pişirme zamanı: {earliestTime}",
    setSuggestedTime: "Önerilen Zamanı Ayarla",
    
    // Recipe section
    recipeTitle: "📦 Pizza Hamuru Tarifi",
    proteinContent: "Protein İçeriği:",
    recommendedHydration: "Önerilen Hidrasyon:",
    flour: "Un",
    water: "Su",
    salt: "Tuz",
    yeast: "Maya",
    sourdoughStarter: "Ekşi Maya Başlangıcı",
    fermentationTime: "Fermentasyon Süresi:",
    hours: "saat",
    
    // Timeline section
    timelineTitle: "🧭 Örnek Zaman Çizelgesi",
    timelineSteps: {
      mix: {
        title: "Karıştırma",
        desc: "Malzemeleri once su ile başlayarak sirasiyla ekleyip karıştırın (oda sıcaklığında), ardından tuzu çözün. Küçük miktarlarda un ekleyerek sürekli karıştırın, sonra mayayı ekleyin. Hamur pürüzsüz ve elastik olana kadar 10-15 dakika boyunca yoğurun. Hazır hamur yumuşak, pürüzsüz ve dokunulduğunda yapışkan olmalıdır."
      },
      rest: {
        title: "Dinlendirme",
        desc: "Hamuru nemli bir bezle örtülmüş bir çalışma yüzeyinde veya bir yiyecek kabında yaklaşık 20-30 dakika dinlenmesine izin verin. Bu ilk dinlenme süresi, hamurun rahatlamasına ve gluten oluşumuna başlamasına izin vererek daha sonra porsiyonlamayı kolaylaştırır."
      },
      bulk: {
        title: "Ana Fermantasyon",
        desc: "Oda sıcaklığında fermantasyon için, hamuru 22-25°C'de tutun. Daha uzun fermantasyon süresi için (16 saatten fazla), buzdolabına koyun (4-6°C). Hamur, yüzey kurumasını önlemek için kapalı gıda kaplarında saklanmalıdır. Kabarma süresi AVPN standartlarına göre sıcaklık ve maya tipine bağlı olarak değişir."
      },
      balling: {
        title: "Pizza Toplarini Hazirlama",
        desc: "Hamuru bir spatula veya kazıyıcı kullanarak toplara bölün (istenen pizza boyutuna bağlı olarak her biri 200-280g). Minimal dokunma gereklidir ve hamur sadece kenarları alttan üste katlayarak şekillendirilmelidir. Top şekillendirme birkaç saniyede tamamlanmalıdır. Şekillendirilmiş topları aralarında hafif un serpiştirilmiş mayalama kutularına yerleştirin."
      },
      bake: {
        title: "Pişirmeye Hazır",
        desc: "GELENEKSEL ODUN FIRINI: Pişirme yüzeyi 380-430°C olacak şekilde 430-480°C'ye kadar ısıtın. Pizza küreği kullanarak hamur diskini elle 3mm kalınlığında (kenar kabartısı için 1-2cm) açın. Malzemeleri ekleyin ve gerektiğinde döndürerek 60-90 saniye pişirin.\n\nEV FIRINI YÖNTEMİ: Bir pizza taşını veya çeliğini orta-üst rafa yerleştirin ve en az 45-60 dakika boyunca maksimum sıcaklıkta (250-290°C) ön ısıtma yapın. Hamuru yukarıda belirtildiği gibi açın. En iyi sonuçlar için, sıcak taşın üzerine atmak için bir pizza küreği kullanın. Kenarlar altın rengi ve yanık noktalar olana kadar 4-6 dakika pişirin. Fırınınızda ızgara/grill işlevi varsa, kenarları kızartmak için son dakikada bu işleve geçin."
      }
    },
    
    // Guidelines section
    guidelinesTitle: "📜 AVPN Resmi Kuralları Özeti",
    guidelinesItems: {
      flourSpecs: {
        title: "🌾 Un Özellikleri:",
        items: [
          "W değeri 250-320 arasında Tip 00 un",
          "Protein içeriği: %11-13.5",
          "Emilim oranı: %55-62"
        ]
      },
      ingredients: {
        title: "🧂 Malzeme Yüzdeleri:",
        items: [
          "Su: Un ağırlığının <strong>%55-62</strong>'si (hidrasyon)",
          "Tuz: Un ağırlığının <strong>%2-3</strong>'ü",
          "Yaş Maya: Un ağırlığının <strong>%0.2-0.3</strong>'ü",
          "Kuru Maya: Un ağırlığının <strong>%0.1-0.2</strong>'si",
          "Ekşi Maya Başlangıcı: Un ağırlığının <strong>%5-20</strong>'si"
        ]
      },
      fermentation: {
        title: "🕒 Fermantasyon Gereksinimleri:",
        items: [
          "Yaş Maya ile Doğrudan Yöntem: minimum <strong>8-12 saat</strong>",
          "Kuru Maya ile Doğrudan Yöntem: minimum <strong>8 saat</strong>",
          "Ekşi Maya Yöntemi: minimum <strong>16-24 saat</strong>",
          "Poolish Yöntemi: minimum <strong>16-18 saat</strong> (ön-fermantasyon için 4-6s + hamur için 12s)",
          "Biga Yöntemi: minimum <strong>18-24 saat</strong> (ön-fermantasyon için 6-18s + hamur için 12s)"
        ]
      },
      temperature: {
        title: "🌡️ Sıcaklık Kontrolleri:",
        items: [
          "Oda Sıcaklığında Fermantasyon: <strong>22-25°C</strong>",
          "Soğuk Fermantasyon: <strong>4-6°C</strong>",
          "Karıştırma Sonrası Hamur Sıcaklığı: <strong>23-25°C</strong>"
        ]
      },
      preparation: {
        title: "🥣 Hazırlık Süreci:",
        items: [
          "Karıştırma: Pürüzsüz doku elde edilene kadar 10-15 dakika",
          "İlk Dinlenme: Oda sıcaklığında 20-30 dakika",
          "Toplu Fermantasyon: Yönteme bağlı olarak 6-24 saat",
          "Toparlama: 200-280g hamur topları oluşturun",
          "Son Mayalanma: Pişirmeden önce yaklaşık <strong>2 saat</strong>"
        ]
      },
      cooking: {
        title: "🍕 Pişirme Özellikleri:",
        items: [
          "Fırın Sıcaklığı: <strong>430-480°C</strong>",
          "Pişirme Yüzeyi: <strong>380-430°C</strong>",
          "Pişirme Süresi: <strong>60-90 saniye</strong>",
          "Geleneksel Odun Ateşli Fırın Tavsiye Edilir",
          "Son Çap: 1-2cm yükseltilmiş kenar (cornicione) ile 22-35cm"
        ]
      },
      notes: {
        title: "⚠️ Önemli Notlar:",
        items: [
          "Mekanik veya otomatik pres cihazları kullanılmasına izin verilmez",
          "Sadece elle şekillendirme ve açma",
          "Merdane veya mekanik hamur şekillendirme kullanmayın",
          "Hamurda yağ yok (depolama için yüzey hariç)"
        ]
      }
    },
    references: "Resmi Referanslar:",
    referencesPdf: "2024 AVPN Kuralları (PDF)",
    referencesWeb: "AVPN Pizza Napoletana Tarifi (Web sayfası)"
  }
};

function App() {  
  const [language, setLanguage] = useState('en');
  const t = translations[language];
  
  const [pizzaCount, setPizzaCount] = useState(4);
  const [pizzaSize, setPizzaSize] = useState(250);
  const [hydration, setHydration] = useState(60);
  const [flourType, setFlourType] = useState('00');
  const [yeastType, setYeastType] = useState('dry');
  const yeastFermentationHours = { dry: 8, fresh: 12, sourdough: 16 };
  const recipeRef = useRef(null);
  const [expandedStep, setExpandedStep] = useState(null);
    // Flour characteristics by type
  const flourCharacteristicsEN = {
    '00': { 
      hydrationRange: [55, 62], 
      proteinContent: '11-13.5%', 
      description: 'Fine Italian flour ideal for Neapolitan pizza',
      saltPercentage: 3.0,
      yeastMultiplier: 1.0
    },
    'bread': { 
      hydrationRange: [60, 65], 
      proteinContent: '12-14%', 
      description: 'High protein content, great structure',
      saltPercentage: 2.5,
      yeastMultiplier: 0.9
    },
    'allpurpose': { 
      hydrationRange: [60, 65], 
      proteinContent: '10-12%', 
      description: 'Versatile flour with moderate protein',
      saltPercentage: 2.5,
      yeastMultiplier: 1.1
    },
    'manitoba': { 
      hydrationRange: [65, 70], 
      proteinContent: '14-15%', 
      description: 'Very strong Canadian flour for long fermentation',
      saltPercentage: 2.8,
      yeastMultiplier: 0.8
    },
    'whole': { 
      hydrationRange: [65, 75], 
      proteinContent: '13-14%', 
      description: 'Whole wheat flour, more rustic flavor',
      saltPercentage: 2.2,
      yeastMultiplier: 1.2
    },
    'semolina': { 
      hydrationRange: [55, 65], 
      proteinContent: '12-13%', 
      description: 'Durum wheat flour, adds texture and flavor',
      saltPercentage: 2.8,
      yeastMultiplier: 1.0
    },
    'spelt': { 
      hydrationRange: [65, 75], 
      proteinContent: '11-13%', 
      description: 'Ancient grain with nutty flavor, less gluten',
      saltPercentage: 2.0,
      yeastMultiplier: 1.3
    },
    'rye': { 
      hydrationRange: [70, 85], 
      proteinContent: '9-11%', 
      description: 'Distinctive flavor, use in combination with wheat flour',
      saltPercentage: 2.0,
      yeastMultiplier: 1.4
    }
  };
  
  const flourCharacteristicsTR = {
    '00': { 
      hydrationRange: [55, 62], 
      proteinContent: '11-13.5%', 
      description: 'Napoli pizzası için ideal ince İtalyan unu',
      saltPercentage: 3.0,
      yeastMultiplier: 1.0
    },
    'bread': { 
      hydrationRange: [60, 65], 
      proteinContent: '12-14%', 
      description: 'Yüksek protein içeriği, mükemmel yapı',
      saltPercentage: 2.5,
      yeastMultiplier: 0.9
    },
    'allpurpose': { 
      hydrationRange: [60, 65], 
      proteinContent: '10-12%', 
      description: 'Orta düzeyde proteinli çok yönlü un',
      saltPercentage: 2.5,
      yeastMultiplier: 1.1
    },
    'manitoba': { 
      hydrationRange: [65, 70], 
      proteinContent: '14-15%', 
      description: 'Uzun fermantasyon için çok güçlü Kanada unu',
      saltPercentage: 2.8,
      yeastMultiplier: 0.8
    },
    'whole': { 
      hydrationRange: [65, 75], 
      proteinContent: '13-14%', 
      description: 'Tam buğday unu, daha rustik lezzet',
      saltPercentage: 2.2,
      yeastMultiplier: 1.2
    },
    'semolina': { 
      hydrationRange: [55, 65], 
      proteinContent: '12-13%', 
      description: 'Durum buğdayı unu, doku ve lezzet katar',
      saltPercentage: 2.8,
      yeastMultiplier: 1.0
    },
    'spelt': { 
      hydrationRange: [65, 75], 
      proteinContent: '11-13%', 
      description: 'Cevizsi lezzeti olan, daha az glütenli eski tahıl',
      saltPercentage: 2.0,
      yeastMultiplier: 1.3
    },
    'rye': { 
      hydrationRange: [70, 85], 
      proteinContent: '9-11%', 
      description: 'Belirgin lezzet, buğday unu ile birlikte kullanın',
      saltPercentage: 2.0,
      yeastMultiplier: 1.4
    }
  };
  
  // Select the right flour characteristics based on language
  const flourCharacteristics = language === 'en' ? flourCharacteristicsEN : flourCharacteristicsTR;
  
  // Check if the screen is mobile-sized
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const toLocalDatetimeInputValue = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const getInitialTargetTime = (type) => {
    const localNow = new Date();
    // Add fermentation hours plus 10 minutes (600000 ms)
    return new Date(localNow.getTime() + (yeastFermentationHours[type] * 60 * 60 * 1000) + 600000);
  };
  const defaultTargetTime = getInitialTargetTime(yeastType);
  const [targetTime, setTargetTime] = useState(() => toLocalDatetimeInputValue(defaultTargetTime));  
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState('');
  const [suggestedTime, setSuggestedTime] = useState(null);
  const [guidelinesExpanded, setGuidelinesExpanded] = useState(false);

  // Define timeline instructions to support translation
  const timelineInstructions = t.timelineSteps;
  
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const calculateDough = () => {
    const now = new Date();
    const bakeTime = new Date(targetTime);
    const hoursUntilBake = (bakeTime - now) / 1000 / 3600;

    const minHoursRequired = {
      dry: 8,
      fresh: 12,
      sourdough: 16,
    };    
    const requiredHours = minHoursRequired[yeastType];
    const earliestValidTime = new Date(now.getTime() + requiredHours * 60 * 60 * 1000 + 600000); // Add 10 minutes (600000 ms)

    if (hoursUntilBake < requiredHours) {
      const formattedEarliest = formatDate(earliestValidTime);
      setWarning(
        t.warningYeast
          .replace('{yeastType}', t.yeastTypes[yeastType].toUpperCase())
          .replace('{hours}', requiredHours)
          .replace('{earliestTime}', formattedEarliest)
      );
      setSuggestedTime(toLocalDatetimeInputValue(earliestValidTime));
      setResult(null);
      return;
    } else {
      setWarning('');
      setSuggestedTime(null);
    }    
    const doughWeight = pizzaCount * pizzaSize;
    const hydrationRatio = hydration / 100;
    const flour = doughWeight / (1 + hydrationRatio);
    const water = flour * hydrationRatio;
    
    // Use flour-specific salt percentage
    const saltPercentage = flourCharacteristics[flourType].saltPercentage / 100;
    const salt = flour * saltPercentage;

    // Adjust yeast based on flour type
    const yeastMultiplier = flourCharacteristics[flourType].yeastMultiplier;
    let yeast;
    if (yeastType === 'dry') {
      yeast = flour * 0.001 * yeastMultiplier;
    } else if (yeastType === 'fresh') {
      yeast = flour * 0.0025 * yeastMultiplier;
    } else {
      yeast = flour * 0.20 * yeastMultiplier;
    }

    const mixTime = now;
    const restTime = new Date(mixTime.getTime() + 20 * 60 * 1000);
    const ballTime = new Date(bakeTime.getTime() - 2 * 60 * 60 * 1000);
    const bulkStart = restTime;
    const bulkEnd = ballTime;    
    setResult({
      flour,
      water,
      salt,
      yeast,
      yeastType,
      targetTime,
      hoursUntilBake,
      waterPct: hydration,
      saltPct: (salt / flour) * 100,
      yeastPct: (yeast / flour) * 100,
      mixTime,
      restTime,
      bulkStart,
      bulkEnd,
      ballTime,
      bakeTime,
    });
    
    // Scroll to recipe section after calculation is successful
    setTimeout(() => {
      if (recipeRef.current) {
        recipeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const getYeastColor = (type) => {
    switch (type) {
      case 'sourdough': return '#8e44ad';
      case 'fresh': return '#f39c12';
      default: return '#3498db';
    }
  };

  return (
    <div className="container">      
      <div className="app-header">
        <h1>{t.appTitle}</h1>
        <p className="header-tagline">{t.tagline}</p>
        <div className="language-toggle">
          <FormControlLabel
            control={
              <Switch
                checked={language === 'tr'}
                onChange={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                color="primary"
              />
            }
            label={language === 'en' ? 'Türkçe' : 'English'}
          />
        </div>
      </div>
      <div className="input-box">
        <label>{t.pizzaCount}</label>
        <input type="number" value={pizzaCount} onChange={e => setPizzaCount(Number(e.target.value))} />

        <label>{t.pizzaSize}</label>
        <input type="number" value={pizzaSize} onChange={e => setPizzaSize(Number(e.target.value))} />

        <label>{t.hydration}</label>
        <input type="number" value={hydration} onChange={e => setHydration(Number(e.target.value))} />        
        <label>{t.flourType}</label>
        <select value={flourType} onChange={e => {
          const newFlourType = e.target.value;
          setFlourType(newFlourType);
          
          // Adjust hydration to middle of recommended range for the selected flour
          const [minHydration, maxHydration] = flourCharacteristics[newFlourType].hydrationRange;
          const recommendedHydration = Math.round((minHydration + maxHydration) / 2);
          setHydration(recommendedHydration);
        }}>
          {Object.keys(t.flourTypes).map(key => (
            <option key={key} value={key}>{t.flourTypes[key]}</option>
          ))}
        </select>

        <label>{t.yeastType}</label>        
        <select value={yeastType} onChange={e => {
            const selectedType = e.target.value;
            setYeastType(selectedType);
            const newTime = new Date(Date.now() + (yeastFermentationHours[selectedType] * 60 * 60 * 1000) + 600000);
            setTargetTime(toLocalDatetimeInputValue(newTime));
          }}> 
          {Object.keys(t.yeastTypes).map(key => (
            <option key={key} value={key}>{t.yeastTypes[key]}</option>
          ))}
        </select>

        <label>{t.targetTime}</label>
        <input type="datetime-local" value={targetTime} onChange={e => setTargetTime(e.target.value)} />

        <button onClick={calculateDough} className="calculate-button">
          <span className="button-icon">🧮</span>
          {t.calculateButton}
        </button>

        {warning && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            color: '#856404',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setWarning('');
                setSuggestedTime(null);
              }}
              style={{
                position: 'absolute',
                top: '6px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#856404'
              }}
            >✖</button>
            {warning}
            {suggestedTime && (
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  onClick={() => setTargetTime(suggestedTime)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffeeba',
                    border: '1px solid #f5c06d',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#856404'
                  }}
                >
                  {t.setSuggestedTime}
                </button>
              </div>
            )}
          </div>
        )}
      </div>      
      {result && (
        <>          
          <div className="result-section recipe" ref={recipeRef}>
            <h3>{t.recipeTitle}</h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <div className="flour-info">
                <h4>{flourCharacteristics[flourType].description}</h4>
                <p><strong>{t.proteinContent}</strong> {flourCharacteristics[flourType].proteinContent}</p>
                <p><strong>{t.recommendedHydration}</strong> {flourCharacteristics[flourType].hydrationRange[0]}-{flourCharacteristics[flourType].hydrationRange[1]}%</p>
              </div>
              <table className="recipe-table">
                <tbody>
                  <tr><td>{t.flour}</td><td>{result.flour.toFixed(1)} g</td><td>(100%)</td></tr>
                  <tr><td>{t.water}</td><td>{result.water.toFixed(1)} g</td><td>({result.waterPct.toFixed(1)}%)</td></tr>
                  <tr><td>{t.salt}</td><td>{result.salt.toFixed(1)} g</td><td>({result.saltPct.toFixed(2)}%)</td></tr>
                  <tr>
                    <td>{result.yeastType === 'sourdough' ? t.sourdoughStarter : t.yeast}</td>
                    <td>{result.yeast.toFixed(2)} g</td>
                    <td>({result.yeastPct.toFixed(3)}%)</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: '1.5rem' }}>
                <strong>{t.fermentationTime}</strong> ~{result.hoursUntilBake.toFixed(1)} {t.hours}
              </p>
            </motion.div>
          </div>          
          <div className="result-section timeline">
            <h3>{t.timelineTitle}</h3>
            <Timeline position={isMobile ? "alternate" : "right"}>
              {[
                { time: result.mixTime, title: t.timelineSteps.mix.title, desc: t.timelineSteps.mix.desc, icon: <AccessTimeIcon />, color: 'primary' },
                { time: result.restTime, title: t.timelineSteps.rest.title, desc: t.timelineSteps.rest.desc, icon: <HotelIcon />, color: 'secondary' },
                {
                  time: result.bulkStart,
                  title: t.timelineSteps.bulk.title,
                  desc: t.timelineSteps.bulk.desc,
                  icon: <InventoryIcon sx={{ color: '#fff' }} />, dotColor: getYeastColor(yeastType)
                },
                { time: result.ballTime, title: t.timelineSteps.balling.title, desc: t.timelineSteps.balling.desc, icon: <CircleIcon />, color: 'success' },
                { time: result.bakeTime, title: t.timelineSteps.bake.title, desc: t.timelineSteps.bake.desc, icon: <LocalFireDepartmentIcon />, color: 'error' },
              ].map((step, idx) => (
                <TimelineItem key={idx} sx={{ alignItems: 'center' }}>
                  <TimelineOppositeContent 
                    sx={{ 
                      flex: {xs: 0.3, sm: 0.5, md: 0.8}, 
                      textAlign: 'right', 
                      pr: {xs: 1, sm: 2, md: 3}, 
                      fontSize: {xs: '0.85rem', sm: '0.9rem', md: '0.95rem'}, 
                      color: 'gray', 
                      minWidth: {xs: '70px', sm: '80px', md: '90px'}, 
                      alignSelf: 'center' 
                    }}
                  >
                    {formatDate(step.time)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={step.color || 'grey'} sx={step.dotColor ? { backgroundColor: step.dotColor } : {}}>
                      {step.icon}
                    </TimelineDot>
                    {idx < 4 && <TimelineConnector />}
                  </TimelineSeparator>                  <TimelineContent>
                    <motion.div initial={{ opacity: 0, translateY: 30 }} whileInView={{ opacity: 1, translateY: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                      <Typography variant="h6" 
                        onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                        sx={{ 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          color: expandedStep === idx ? '#e63946' : 'inherit',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {step.title}
                        <span style={{ fontSize: '0.9rem', marginLeft: '8px' }}>
                          {expandedStep === idx ? '▼' : '▶'}
                        </span>
                      </Typography>                      {expandedStep === idx ? (
                        <Typography sx={{ 
                          mt: 1, 
                          p: 1.5, 
                          backgroundColor: 'rgba(230, 57, 70, 0.05)', 
                          borderLeft: '3px solid #e63946',
                          borderRadius: '0 4px 4px 0',
                          transition: 'all 0.3s ease'
                        }} className="instruction-section">
                          {step.desc}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                          {step.desc.substring(0, 60)}...
                        </Typography>
                      )}
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>          
          <div className="result-section guidelines">
            <h3 
              onClick={() => setGuidelinesExpanded(!guidelinesExpanded)} 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
            >
              {t.guidelinesTitle}
              <span style={{ fontSize: '1rem' }}>
                {guidelinesExpanded ? '▼' : '▶'}
              </span>
            </h3>
            
            {guidelinesExpanded && (
              <>
                <ul className="avpn-guidelines">
                  {Object.keys(t.guidelinesItems).map(key => (
                    <li key={key}><strong>{t.guidelinesItems[key].title}</strong>
                      <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                        {t.guidelinesItems[key].items.map((item, index) => (
                          <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>🔗 {t.references}</strong></p>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                    📄 <a href="https://www.pizzanapoletana.org/public/pdf/Disciplinare-2024-ENG.pdf" target="_blank" rel="noopener noreferrer">{t.referencesPdf}</a><br />
                    🌐 <a href="https://www.pizzanapoletana.org/en/ricetta_pizza_napoletana" target="_blank" rel="noopener noreferrer">{t.referencesWeb}</a>
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
