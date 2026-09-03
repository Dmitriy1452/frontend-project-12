import * as Yup from 'yup';
import i18n from '../i18n/index.js';

const t = (key) => i18n.t(key);

export const signupValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, t('errors.usernameMin'))
    .max(20, t('errors.usernameMax'))
    .matches(/^[a-zA-Z0-9а-яА-Я_-]+$/, t('errors.usernameInvalid'))
    .required(t('errors.usernameRequired')),
  password: Yup.string()
    .min(6, t('errors.passwordMin'))
    .required(t('errors.passwordRequired')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], t('errors.passwordMatch'))
    .required(t('errors.confirmPasswordRequired')),
});

export const createChannelValidationSchema = (existingChannels = []) => {
  const channelNames = existingChannels.map(ch => ch.name);
  
  return Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .matches(/^[a-zA-Z0-9а-яА-Я_\s-]+$/, 'Разрешены только буквы, цифры, _ и -')
      .notOneOf(channelNames, 'Канал с таким именем уже существует')
      .required('Имя канала обязательно')
      .trim(),
  });
};