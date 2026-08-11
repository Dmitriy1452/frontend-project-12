import filter from 'leo-profanity';

if (!filter) {
  console.warn('Profanity filter not loaded');
}

try {
  filter.loadDictionary('ru');
} catch (error) {
  console.warn('Failed to load Russian dictionary:', error);
}

export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  try {
    return filter.check(text);
  } catch (error) {
    console.warn('Error checking profanity:', error);
    return false;
  }
};

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  try {
    return filter.clean(text);
  } catch (error) {
    console.warn('Error filtering profanity:', error);
    return text;
  }
};

export const validateChannelName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Имя канала обязательно', filtered: '' };
  }
  
  const hasBadWords = hasProfanity(name);
  if (hasBadWords) {
    return { 
      isValid: false, 
      message: 'Имя канала содержит недопустимые слова',
      filtered: filterProfanity(name)
    };
  }
  
  return { isValid: true, message: '', filtered: name };
};

export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, message: 'Сообщение не может быть пустым', filtered: '' };
  }
  
  const hasBadWords = hasProfanity(message);
  if (hasBadWords) {
    return { 
      isValid: false, 
      message: 'Сообщение содержит недопустимые слова',
      filtered: filterProfanity(message)
    };
  }
  
  return { isValid: true, message: '', filtered: message };
};

export default filter;