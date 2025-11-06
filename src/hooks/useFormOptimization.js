import { useCallback, useMemo } from "react";

export const useFormOptimization = (formData, validationRules) => {
  const validateField = useCallback(
    (fieldName, value) => {
      const rule = validationRules[fieldName];
      if (!rule) return true;

      if (rule.required && (!value || value.trim() === "")) {
        return false;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return false;
      }

      if (rule.minLength && value.length < rule.minLength) {
        return false;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return false;
      }

      return true;
    },
    [validationRules],
  );

  const isFormValid = useMemo(() => {
    return Object.keys(validationRules).every((fieldName) =>
      validateField(fieldName, formData[fieldName]),
    );
  }, [formData, validateField, validationRules]);

  const getFieldError = useCallback(
    (fieldName) => {
      const value = formData[fieldName];
      const rule = validationRules[fieldName];

      if (!rule) return null;

      if (rule.required && (!value || value.trim() === "")) {
        return rule.requiredMessage || `${fieldName} is required`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.patternMessage || `${fieldName} format is invalid`;
      }

      if (rule.minLength && value.length < rule.minLength) {
        return (
          rule.minLengthMessage ||
          `${fieldName} must be at least ${rule.minLength} characters`
        );
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return (
          rule.maxLengthMessage ||
          `${fieldName} must be no more than ${rule.maxLength} characters`
        );
      }

      return null;
    },
    [formData, validationRules],
  );

  return {
    validateField,
    isFormValid,
    getFieldError,
  };
};
