
export const getRomanianBounds = (flat = false) => {
    return flat ? [20.2619, 43.6187, 29.6793, 48.2653] :[
      [43.6, 20.2],
      [48.3, 29.7]
    ]
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
            elementRect.bottom <= window.innerHeight;

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

export const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}
