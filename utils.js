
export const getRomanianBounds = (flat = false) => {
    return flat ? 
    [20.2619, 43.6187, 29.6793, 48.2653] : 
    L.latLngBounds(
      L.latLng(43.5, 20.2), // Southwest corner
      L.latLng(48.3, 30.0)  // Northeast corner
    );
}

export const calculateCombinedBboxAndZoom = (selectedLocations) => {
  // Table of cities and their bounding boxes
  const citiesBboxes = {
    "bucuresti": [25.9699, 44.3615, 26.2684, 44.5449],
    "cluj-napoca": [23.5225, 46.7325, 23.6343, 46.8123],
    "iasi": [27.5306, 47.1167, 27.6667, 47.2000],
    "timisoara": [21.1702, 45.7211, 21.2800, 45.8000],
    "constanta": [28.5900, 44.1500, 28.7000, 44.2200],
    "brasov": [25.5500, 45.6200, 25.6700, 45.7000],
    "sibiu": [24.1000, 45.7500, 24.2000, 45.8500],
    "ploiesti": [25.9800, 44.9000, 26.0500, 45.0000],
    "craiova": [23.7500, 44.2800, 23.9000, 44.3500],
    "oradea": [21.9000, 47.0000, 22.0000, 47.1000],
};

  // Initialize the bounding box with extreme values
  let combinedBbox = [Infinity, Infinity, -Infinity, -Infinity]; // [min_lon, min_lat, max_lon, max_lat]

  // The margin in kilometers to add to each side of the bounding box
  const marginKm = 2; 

  // Calculate the combined bounding box
  selectedLocations.forEach((location) => {
    if (citiesBboxes[location]) {
      const bbox = citiesBboxes[location];
      combinedBbox[0] = Math.min(combinedBbox[0], bbox[0]); // Min longitude (west)
      combinedBbox[1] = Math.min(combinedBbox[1], bbox[1]); // Min latitude (south)
      combinedBbox[2] = Math.max(combinedBbox[2], bbox[2]); // Max longitude (east)
      combinedBbox[3] = Math.max(combinedBbox[3], bbox[3]); // Max latitude (north)
    }
  });

  // Add a margin to each side of the bbox
  const KM_TO_DEG_LAT = marginKm / 111; // ~1 km in degrees latitude
  const lat = (combinedBbox[1] + combinedBbox[3]) / 2; // Approximate center latitude
  const KM_TO_DEG_LON = marginKm / (111 * Math.cos(lat * (Math.PI / 180))); // Adjust longitude margin by latitude

  combinedBbox[0] -= KM_TO_DEG_LON; // Add margin to west
  combinedBbox[1] -= KM_TO_DEG_LAT; // Add margin to south
  combinedBbox[2] += KM_TO_DEG_LON; // Add margin to east
  combinedBbox[3] += KM_TO_DEG_LAT; // Add margin to north

  // Calculate zoom level based on bounding box dimensions
  function calculateZoom(bbox) {
    const WORLD_SIZE = 256; // Base tile size in pixels
    const MAX_ZOOM = 18;

    const width = Math.abs(bbox[2] - bbox[0]); // Longitude range
    const height = Math.abs(bbox[3] - bbox[1]); // Latitude range

    // Approximate zoom calculation
    const latZoom = Math.log2(WORLD_SIZE / height) + 1;
    const lonZoom = Math.log2(WORLD_SIZE / width) + 1;

    // Use the smaller of the two zoom levels to ensure the bbox fits
    return Math.min(MAX_ZOOM, Math.floor(Math.min(latZoom, lonZoom)));
  }

  const newZoom = calculateZoom(combinedBbox);

  return { combinedBbox, newZoom };
}

export const removeEmptyValues = (obj) => {
    if(! obj) return {}
    
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (Array.isArray(value) && value.length === 0) {
        delete obj[key];
      }
      if(! value) delete obj[key];
    });
    return obj;
}

export const calculateTravelTime = (distanceMeters, mode = 'walking') => {
  const speeds = {
    walking: 5, // km/h
    cycling: 15,
    driving: 60,
  };

  const speed = speeds[mode];
  const distanceKm = distanceMeters / 1000; // Convert meters to kilometers
  const travelTimeHours = distanceKm / speed;

  return Math.round(travelTimeHours * 60); // Convert to minutes and round off
}

export const setHead = (title = '', meta = []) => {
  useHead({
    title,
    meta: [
      ...meta,
      {
        name: 'description',
        content: title,
      },
    ],
  });
}

export const chunkArray = (array, size) => {
  if (!Array.isArray(array)) {
      throw new TypeError("First argument must be an array.");
  }
  if (typeof size !== "number" || size <= 0) {
      throw new TypeError("Chunk size must be a positive number.");
  }

  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

export const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const distributeArray = (array, groups) => {
  if (groups <= 0) {
    throw new Error("Number of groups must be greater than 0");
  }

  const result = [];
  const groupSize = Math.ceil(array.length / groups);

  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }

  return result;
}

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const scrollToElement = (target, marginTop = 30) => {
  return new Promise(async(resolve, reject) => {
    const element = document.getElementById(target);

    if (element) {
        const collapsibleParent = element.closest('.collapsible');

        // Check if the parent has data-opened set to false
        if (collapsibleParent && collapsibleParent.dataset.opened === "false") {
            const toggleButton = collapsibleParent.querySelector('button');
            if (toggleButton) {
                toggleButton.click();
            }
        }

        await delay(300) // Allow time for the collapsible to expand before scrolling
        const elementRect = element.getBoundingClientRect();

        // Check if the element is already in the viewport
        const isInViewport = 
            elementRect.top >= marginTop && 
            elementRect.bottom <= window?.innerHeight;

        if (isInViewport) {
            element.focus();
        } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            await delay(400) //wait 400ms
            element.focus()
        }

        resolve()
    }
  })
}

export const  shakeElement = (target, duration = 0.5) => {
  const element = document.getElementById(target);

  if (!element) {
    return;
  }

  // Add the shake class
  element.classList.add('shake');

  // Remove the shake class after the duration ends
  setTimeout(() => {
    element.classList.remove('shake');
  }, duration * 1000);
}

export const launchConfetti = () => {
  useNuxtApp().$confetti({
    zIndex: 99999999,
    particleCount: 400,
    spread: 260,
    origin: { x: 0.5, y: 0.5 },
  });
}

export const objectToFormData = (obj, form, namespace) => {
  let fd = form || new FormData();
  let formKey;
  
  for(let property in obj) {
    if(obj.hasOwnProperty(property)) {
      formKey = namespace ? namespace + '[' + property + ']' : property
     
      if(typeof obj[property] === 'object' && !(obj[property] instanceof File) && !Array.isArray(obj[property])) {
        objectToFormData(obj[property], fd, property);
      } else if(Array.isArray(obj[property])) {
        obj[property].forEach((element, index) => {
          const elKey = element instanceof File ? formKey : formKey + '[' + index + ']'
          fd.append(elKey, element);
        })
      } else {
        fd.append(formKey, obj[property]);
      }
    }
  }
  
  return fd
}

export const generatePropertyRandomValues = () => {
  return {
    propertyType: 'apartment', // Randomized between 'apartment', 'comercial', 'commercial', 'land'
    transactionType: 'sell', // Randomized between 'sell', 'rent'
    description: 'Modern apartment with panoramic windows and smart home system, located in a prime area. Ideal for professionals and families.',

    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'], // Simulated image URLs
    selectedFacilities: [
      'panoramic_windows',
      'smart_home_system',
      'autonomous_heating',
      'internet',
      'playground',
    ],

    roomCount: 3, // Random value between 1 and 5
    area: 75, // Random value between 20 and 500
    floor: 5, // Random value between 0 and 25
    balcony: 2, // Random value between 1 and 4
    parking: 'garage', // Random value from parkingOptions: 'open', 'garage', 'covered', 'underground'
    apartmentCondition: 'euro-renovation', // Random value from apartmentConditionOptions
    location: 'Constanța', // Randomized location

    price: 95000, // Random value between 50 and 1,000,000 (in appropriate currency units)
    phones: ['+40 123 456 789', '+40 987 654 321'], // Randomized phone numbers
    terms_and_conditions: true // Kept as true
  }
}

export const propertyFieldsMeta = {
  propertyType: {
    required: true,
    short: "Tip propr.",
    long: "Tipul de proprietate",
    description: "Categoria de proprietate, cum ar fi apartament, casă, teren, sau altceva.",
  },
  transactionType: {
    required: true,
    short: "Tip tranz.",
    long: "Tipul de tranzacție",
    description: "Tipul de tranzacție dorită, cum ar fi vânzare, închiriere sau schimb.",
  },
  description: {
    required: true,
    short: "Descr.",
    long: "Descriere",
    description: "Un text detaliat care evidențiază caracteristicile și avantajele proprietății.",
  },
  selectedFacilities: {
    short: "Facilități",
    long: "Facilități",
    description: "Lista facilităților disponibile, cum ar fi lift, piscină, parcare subterană.",
  },
  images: {
    required: true,
    short: "Img.",
    long: "Imagini",
    description: "Fotografii sau imagini ale proprietății pentru o prezentare vizuală mai clară.",
  },
  roomCount: {
    required: true,
    short: "Nr. camere",
    long: "Număr de camere",
    description: "Numărul total de camere disponibile în proprietate.",
  },
  area: {
    required: true,
    short: "Sup. totală",
    long: "Suprafață totală",
    description: "Suprafața totală a proprietății, incluzând toate anexele, cum ar fi balcoane.",
  },
  floor: {
    required: true,
    short: "Etaj",
    long: "Etaj",
    description: "Nivelul etajului unde se află proprietatea (ex: parter, etaj 1, mansardă).",
  },
  balcony: {
    short: "Balcon",
    long: "Balcon/lojie",
    description: "Detalii despre balcoane sau lojiile incluse, cum ar fi dimensiunea sau numărul acestora.",
  },
  parking: {
    short: "Parcare",
    long: "Loc de parcare",
    description: "Informații despre disponibilitatea și tipul locului de parcare.",
  },
  apartmentCondition: {
    short: "Stare ap.",
    long: "Starea apartamentului",
    description: "Starea actuală a apartamentului, cum ar fi renovat, mobilat, semifinisat.",
  },
  location: {
    required: true,
    short: "Loc.",
    long: "Locație",
    description: "Adresa sau locația utilizată pentru a identifica poziția sau punctul de contact."
  },
  price: {
    required: true,
    short: "Preț",
    long: "Prețul proprietății",
    description: "Costul proprietății, exprimat în moneda specificată.",
  },
  phones: {
    required: true,
    short: "Tel.",
    long: "Telefon",
    description: "Numărul de telefon pentru contact direct.",
  },
  terms_and_conditions: {
    required: true,
    short: "T&C",
    long: "Am citit și sunt de acord cu",
    description: "Termeni și condiții pentru utilizarea serviciului.",
  },
}

export const truncateString = (str, maxLength = 100) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}

export const useThrottle = (func, delay) => {
  let lastCall = 0;
  
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const normalizeQuery = (query) => {
  return query
    .toLowerCase()
    .normalize('NFD')                       // Split accented characters into base + diacritics
    .replace(/[\u0300-\u036f]/g, '')       // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '')           // Remove non-alphanumeric characters except spaces
    .replace(/\s+/g, ' ')                  // Collapse multiple spaces
    .trim();                               // Remove leading/trailing spaces
};

export const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);
