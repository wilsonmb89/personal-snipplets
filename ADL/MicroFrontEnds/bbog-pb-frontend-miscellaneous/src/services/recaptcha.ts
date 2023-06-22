export const getRecaptchaToken = async (): Promise<string> => {
  await new Promise(res => grecaptcha.ready(() => res(null)));
  const getTokenPromise = grecaptcha.execute(process.env.REACAPTCHA_KEY, { action: 'submit' });
  return await getTokenPromise;
};
