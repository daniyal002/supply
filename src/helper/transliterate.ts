// utils/transliterate.ts
export function generateLoginFromName(fullName: string): string {
    const map: { [key: string]: string } = {
      А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D',
      Е: 'E', Ё: 'Yo', Ж: 'Zh', З: 'Z', И: 'I',
      Й: 'Y', К: 'K', Л: 'L', М: 'M', Н: 'N',
      О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T',
      У: 'U', Ф: 'F', Х: 'H', Ц: 'Ts', Ч: 'Ch',
      Ш: 'Sh', Щ: 'Shch', Ъ: '', Ы: 'Y', Ь: '',
      Э: 'E', Ю: 'Yu', Я: 'Ya',
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
      е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
      й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
      о: 'o', п: 'p', р: 'r', с: 's', т: 't',
      у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
      ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '',
      э: 'e', ю: 'yu', я: 'ya',
    };

    const parts = fullName.trim().split(/\s+/); // разбиваем по пробелам
    if (parts.length === 0) return '';

    const lastName = parts[0] || ''; // Фамилия
    const firstName = parts[1] || ''; // Имя
    const patronymic = parts[2] || ''; // Отчество

    // Транслитерируем каждую часть
    const transliterate = (str: string) => {
      return str.split('').map(char => map[char] || char).join('');
    };

    const last = transliterate(lastName);
    const firstInitial = firstName ? transliterate(firstName[0]) : '';
    const patronymicInitial = patronymic ? transliterate(patronymic[0]) : '';

    return (last + firstInitial + patronymicInitial).toLowerCase();
  }