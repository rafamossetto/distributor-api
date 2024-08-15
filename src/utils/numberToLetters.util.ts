export function convertirNumeroALetras(num: number): string {
  function unidades(num: number): string {
    switch (num) {
      case 1: return 'Un';
      case 2: return 'Dos';
      case 3: return 'Tres';
      case 4: return 'Cuatro';
      case 5: return 'Cinco';
      case 6: return 'Seis';
      case 7: return 'Siete';
      case 8: return 'Ocho';
      case 9: return 'Nueve';
      default: return '';
    }
  }

  function decenasY(strSin: string, numUnidades: number): string {
    if (numUnidades > 0) {
      return strSin + ' y ' + unidades(numUnidades);
    }
    return strSin;
  }

  function decenas(num: number): string {
    const numDecena = Math.floor(num / 10);
    const numUnidad = num - numDecena * 10;

    switch (numDecena) {
      case 1:
        switch (numUnidad) {
          case 0: return 'Diez';
          case 1: return 'Once';
          case 2: return 'Doce';
          case 3: return 'Trece';
          case 4: return 'Catorce';
          case 5: return 'Quince';
          default: return 'Dieci' + unidades(numUnidad).toLowerCase();
        }
      case 2:
        switch (numUnidad) {
          case 0: return 'Veinte';
          default: return 'Veinti' + unidades(numUnidad).toLowerCase();
        }
      case 3: return decenasY('Treinta', numUnidad);
      case 4: return decenasY('Cuarenta', numUnidad);
      case 5: return decenasY('Cincuenta', numUnidad);
      case 6: return decenasY('Sesenta', numUnidad);
      case 7: return decenasY('Setenta', numUnidad);
      case 8: return decenasY('Ochenta', numUnidad);
      case 9: return decenasY('Noventa', numUnidad);
      case 0: return unidades(numUnidad);
      default: return '';
    }
  }

  function centenas(num: number): string {
    const numCentenas = Math.floor(num / 100);
    const numDecenas = num - numCentenas * 100;

    switch (numCentenas) {
      case 1: return numDecenas > 0 ? 'Ciento ' + decenas(numDecenas) : 'Cien';
      case 2: return 'Doscientos ' + decenas(numDecenas);
      case 3: return 'Trescientos ' + decenas(numDecenas);
      case 4: return 'Cuatrocientos ' + decenas(numDecenas);
      case 5: return 'Quinientos ' + decenas(numDecenas);
      case 6: return 'Seiscientos ' + decenas(numDecenas);
      case 7: return 'Setecientos ' + decenas(numDecenas);
      case 8: return 'Ochocientos ' + decenas(numDecenas);
      case 9: return 'Novecientos ' + decenas(numDecenas);
      default: return decenas(numDecenas);
    }
  }

  function seccion(num: number, divisor: number, strSingular: string, strPlural: string): string {
    const numCientos = Math.floor(num / divisor);
    const numResto = num - numCientos * divisor;

    let letras = '';

    if (numCientos > 0) {
      if (numCientos > 1) {
        letras = centenas(numCientos) + ' ' + strPlural;
      } else {
        letras = strSingular;
      }
    }

    if (numResto > 0) {
      letras += '';
    }

    return letras;
  }

  function miles(num: number): string {
    const divisor = 1000;
    const numCientos = Math.floor(num / divisor);
    const numResto = num - numCientos * divisor;
    const strMiles = seccion(num, divisor, 'Un Mil', 'Mil');
    const strCentenas = centenas(numResto);

    if (strMiles === '') {
      return strCentenas;
    }

    return (strMiles + ' ' + strCentenas).trim();
  }

  function millones(num: number): string {
    const divisor = 1000000;
    const numCientos = Math.floor(num / divisor);
    const numResto = num - numCientos * divisor;
    const strMillones = seccion(num, divisor, 'Un Millón de', 'Millones de');
    const strMiles = miles(numResto);

    if (strMillones === '') {
      return strMiles;
    }

    return (strMillones + ' ' + strMiles).trim();
  }

  function centavosALetras(centavos: number) {
    const unidades = [
      '', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez',
      'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'
    ];
  
    const decenas = ['', '', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
    
    if (centavos < 20) {
      return unidades[centavos];
    }
  
    const decena = Math.floor(centavos / 10);
    const unidad = centavos % 10;
  
    return `${decenas[decena]}${unidad > 0 ? ' y ' + unidades[unidad] : ''}`;
  }

  const enteros = Math.floor(num);
  const centavos = Math.round(num * 100) - Math.floor(num) * 100;
  let letrasCentavos = '';

  if (centavos > 0) {
    letrasCentavos = `con ${centavosALetras(centavos)} centavos`;
  }

  if (enteros === 0) {
    return `Cero Pesos ${letrasCentavos}`.trim();
  }

  if (enteros === 1) {
    return `${millones(enteros)} Peso ${letrasCentavos}`.trim();
  }

  return `${millones(enteros)} Pesos ${letrasCentavos}`.trim().toLocaleUpperCase();
}
