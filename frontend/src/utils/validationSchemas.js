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
  return Yup.object({
    name: Yup.string()
      .min(3, t('channels.channelNameMin'))
      .max(20, t('channels.channelNameMax'))
      .matches(/^[a-zA-Z0-9а-яА-Я_\s-]+$/, t('channels.channelNameInvalid'))
      .notOneOf(
        existingChannels.map(ch => ch.name),
        t('channels.channelExists')
      )
      .required(t('channels.channelNameRequired')),
  });
};