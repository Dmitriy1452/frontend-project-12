import filter from 'leo-profanity';

try {
  filter.loadDictionary('en');
  filter.loadDictionary('ru');
} catch (error) {
}

const badWords = [
  'boobs', 'boob', 'tits', 'tit', 'dick', 'pussy', 'fuck', 'shit', 
  'ass', 'bitch', 'cunt', 'cock', 'suck', 'whore', 'slut', 'bastard',
  'хуй', 'пизда', 'блядь', 'ебан', 'мудак', 'говно', 'залупа', 'петух'
];

try {
  filter.add(badWords);
} catch (error) {
}

export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  try {
    return filter.check(text);
  } catch (error) {
    return false;
  }
};

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  try {
    const cleaned = filter.clean(text);
    if (cleaned === text && hasProfanity(text)) {
      return text.split('').map(char => /[a-zA-Zа-яА-Я]/.test(char) ? '*' : char).join('');
    }
    return cleaned;
  } catch (error) {
    return text.split('').map(char => /[a-zA-Zа-яА-Я]/.test(char) ? '*' : char).join('');
  }
};

export const validateChannelName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Имя канала обязательно', filtered: '' };
  }
  
  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 20) {
    return { isValid: false, message: 'От 3 до 20 символов', filtered: trimmed };
  }
  
  const hasBadWords = hasProfanity(trimmed);
  if (hasBadWords) {
    return { 
      isValid: false, 
      message: 'Имя канала содержит недопустимые слова',
      filtered: filterProfanity(trimmed)
    };
  }
  
  return { isValid: true, message: '', filtered: trimmed };
};

export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, message: 'Сообщение не может быть пустым', filtered: '' };
  }
  
  const trimmed = message.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Сообщение не может быть пустым', filtered: '' };
  }
  
  const hasBadWords = hasProfanity(trimmed);
  if (hasBadWords) {
    return { 
      isValid: false, 
      message: 'Сообщение содержит недопустимые слова',
      filtered: filterProfanity(trimmed)
    };
  }
  
  return { isValid: true, message: '', filtered: trimmed };
};

export default filter;