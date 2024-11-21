
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