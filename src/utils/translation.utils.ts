export function translateMeasurement(measurement: string): string {
    const translations = {
      'unit': 'Unidad',
      'kilogram': 'Kilogramo',
    };
    return translations[measurement] || measurement;
  }
  