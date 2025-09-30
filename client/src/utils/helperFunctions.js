const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, text: '', color: 'error' };

  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;

  if (strength < 50) return { strength, text: 'Weak', color: 'error' };
  if (strength < 75) return { strength, text: 'Fair', color: 'warning' };
  if (strength < 100) return { strength, text: 'Good', color: 'info' };
  return { strength, text: 'Strong', color: 'success' };
};

export { getPasswordStrength };