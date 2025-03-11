export const validateName = (input: string): boolean => {
  const re = new RegExp(/^[a-zA-Z0-9àáâäãåąčćęèéêëėğıįìíîïłńòóôöõøşùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËĞÌÍİÎÏĮŁŃÒÓÔÖÕØŞÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'\-+&]+$/);
  return re.test(input);
};
