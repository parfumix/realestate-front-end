
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
};

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
};

/**
 * Splits an array into chunks of a specified size.
 * @param {Array} array - The array to split.
 * @param {number} size - The size of each chunk.
 * @returns {Array} - An array of chunks.
 */
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
};

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